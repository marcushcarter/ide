import { global, FSNode } from './constants.js';

export async function loadChildren(node) {
    if (node.type !== "dir") return;
    if (node.children !== null) return;

    const entries = await window.electronAPI.readDir(node.path);

    entries.sort((a, b) => {
        if (a.type !== b.type) return a.type === "dir" ? -1 : 1;
        return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
    });

    node.children = entries.map(e =>
        new FSNode({
            name: e.name,
            path: e.path,
            type: e.type,
            parent: node,
            depth: node.depth + 1
        })
    );
}

export function renderNode(node) {
    if (node.dom) return node.dom;

    const row = document.createElement("div");
    row.className = "fs-row";
    row.style.paddingLeft = `${node.depth * 14}px`;

    const chevron = document.createElement("div");
    chevron.className = "fs-chevron";
    chevron.textContent = node.type === "dir" ? "▶" : "";
    row.appendChild(chevron);

    const label = document.createElement("div");
    label.className = "fs-label";
    label.textContent = node.name;
    row.appendChild(label);

    const container = document.createElement("div");
    container.className = "fs-node";
    container.appendChild(row);

    node.dom = container;

    if (node.type === "dir") {
        const childrenEl = document.createElement("div");
        childrenEl.className = "fs-children";
        childrenEl.style.display = "none";
        container.appendChild(childrenEl);
        node.childrenEl = childrenEl;

        row.addEventListener("click", async (e) => {
            e.stopPropagation();
            node.expanded = !node.expanded;
            chevron.style.transform = node.expanded ? "rotate(90deg)" : "";

            if (node.expanded) {
                await loadChildren(node);
                childrenEl.style.display = "block";

                if (childrenEl.childElementCount === 0) {
                    for (const child of node.children) {
                        childrenEl.appendChild(renderNode(child));
                    }
                }
            } else {
                childrenEl.style.display = "none";
            }

            if (global.selectedNode?.dom) global.selectedNode.dom.classList.remove("selected");
            global.selectedNode = node;
            container.classList.add("selected");
        });
    } else {
        row.addEventListener("click", (e) => {
            e.stopPropagation();
            if (global.selectedNode?.dom) global.selectedNode.dom.classList.remove("selected");
            global.selectedNode = node;
            container.classList.add("selected");

            openFile(node.path);
            global.currentFilePath = node.path;
        });
    }

    return container;
}

export function renderFilesystem() {
    const panel = document.getElementById("filesystem-panel");
    if (!panel || !global.fsRoot) return;

    panel.innerHTML = "";
    panel.appendChild(renderNode(global.fsRoot));
}

export function selectFolder(folder) {
    global.currentFolderPath = folder;
    const currentFolderPathEl = document.getElementById("current-folder-path");
    if (currentFolderPathEl) currentFolderPathEl.textContent = folder;

    global.fsRoot = new FSNode({
        name: folder.split(/[\\/]/).pop(),
        path: folder,
        type: "dir"
    });

    renderFilesystem();

    if (!global.selectedActivity) {
        global.selectedActivity = 'files';
        updateActivitySelection();
    }
}

export function openFile(path) {
    const editorEl = document.getElementById("editor");
    const currentFilePathEl = document.getElementById("current-file-path");

    window.electronAPI.readFile(path).then(content => {
        if (editorEl) editorEl.value = content;
        global.currentFilePath = path;
        if (currentFilePathEl) currentFilePathEl.textContent = global.currentFilePath;
    });
}

export function saveFile() {
    if (!global.currentFilePath) return;
    const editorEl = document.getElementById("editor");
    if (!editorEl) return;

    window.electronAPI.writeFile(global.currentFilePath, editorEl.value);
}

export function initMenu() {
    const menuBtn = document.getElementById("menu-btn");
    const menuDropdown = document.getElementById("menu-dropdown");

    menuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        menuDropdown.style.display = menuDropdown.style.display === "flex" ? "none" : "flex";
    });

    menuDropdown.addEventListener("click", (e) => e.stopPropagation());

    window.addEventListener("click", (e) => {
        if (e.target !== menuBtn && !menuDropdown.contains(e.target)) {
            menuDropdown.style.display = "none";
        }
    });

    window.addEventListener("blur", () => {
        menuDropdown.style.display = "none";
    });

    menuDropdown.querySelectorAll(".menu-item").forEach((item) => {
        item.addEventListener("click", async () => {
            const action = item.dataset.action;
            menuDropdown.style.display = "none";
            await handleMenuAction(action);
        });
    });

    window.handleMenuAction = async function(action) {
        switch(action) {
            case "open-folder":
                const folder = await window.electronAPI.openProjectFolder();
                if (folder) selectFolder(folder);
                break;
            case "open-file":
                const file = await window.electronAPI.openFile();
                if (file) openFile(file);
                break;
            default:
                console.warn("Unknown menu action:", action);
        }
    }
}