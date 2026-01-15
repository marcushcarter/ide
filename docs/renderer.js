
const { Terminal } = window;
const { FitAddon } = window;

let currentFilePath = null;
let currentFolderPath = null;

const currentFilePathEl = document.getElementById("current-file-path");
const currentFolderPathEl = document.getElementById("current-folder-path");
const editorEl = document.getElementById("editor");

let selectedActivity = null;
let lastActiveActivity = null;
let lastSidebarWidth = 200;

let term;
let fitAddon;

let fsRoot = null;
let selectedNode = null;


const ICONS = {
    files: "../assets/fonts/vscode-codicon/files.svg",
    git: "../assets/fonts/vscode-codicon/git-branch.svg",
    cmake: "../assets/icons/cmake.svg",
    account: "../assets/fonts/vscode-codicon/account.svg",
    settings: "../assets/fonts/vscode-codicon/settings-gear.svg"
};

window.addEventListener('DOMContentLoaded', () => {
    injectIcons();
    initWindowControls();
    initMenuDropdown();
    initButtonControls();
    initActivityBar();
    initSidebar();
    initTerminal();

    window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveFile();
    }
});
});

class FSNode {
    constructor({ name, path, type, parent = null, depth = 0 }) {
        this.name = name;
        this.path = path;
        this.type = type;
        this.parent = parent;
        this.depth = depth;

        this.children = null;
        this.expanded = false;
        this.dom = null;
        this.childrenEl = null;
    }
}


function buildRoot(path) {
    fsRoot = new FSNode({
        name: path.split(/[\\/]/).pop(),
        path,
        type: "dir"
    });
}

async function loadChildren(node) {
    if (node.type !== "dir") return;
    if (node.children !== null) return;

    const entries = await window.electronAPI.readDir(node.path);

    entries.sort((a, b) => {
        // dirs first
        if (a.type !== b.type) {
            return a.type === "dir" ? -1 : 1;
        }

        // same type: alphabetical
        return a.name.localeCompare(b.name, undefined, {
            sensitivity: "base"
        });
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

function renderNode(node) {
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

        // Folder click toggles expand/collapse anywhere on row
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

            // folder selection highlight (optional)
            if (selectedNode?.dom) selectedNode.dom.classList.remove("selected");
            selectedNode = node;
            container.classList.add("selected");
        });
    } else {
        // File click selects
        row.addEventListener("click", (e) => {
            e.stopPropagation();

            if (selectedNode?.dom) selectedNode.dom.classList.remove("selected");

            selectedNode = node;
            container.classList.add("selected");

            openFile(node.path);
            currentFilePath = node.path;
            // hook openFile(node.path) here if you want to immediately open
        });
    }

    return container;
}

function renderFilesystem() {
    const panel = document.getElementById("filesystem-panel");
    if (!panel || !fsRoot) return;

    panel.innerHTML = "";
    panel.appendChild(renderNode(fsRoot));
}

function injectIcons() {
    document.querySelectorAll("[data-icon]").forEach(el => {
        if (el.dataset.iconInjected) return;
        const iconName = el.dataset.icon;
        const path = ICONS[iconName];
        if (!path) {
            console.warn(`Missing icon: ${iconName}`);
            return;
        }
        fetch(path).then(r => r.text()).then(svg => { el.innerHTML = svg; el.dataset.iconInjected = "true"; });
    });
}

function initWindowControls() {
    const minimizeBtn = document.getElementById("minimize");
    const maximizeBtn = document.getElementById("maximize");
    const closeBtn = document.getElementById("close");

    minimizeBtn.addEventListener("click", () => window.electronAPI.windowControl("minimize"));
    maximizeBtn.addEventListener("click", () => window.electronAPI.windowControl("maximize"));
    closeBtn.addEventListener("click", () => window.electronAPI.windowControl("close"));

    window.electronAPI.onWindowStateChange((state) => {
        maximizeBtn.textContent = state === "maximized" ? "❐" : "□";
    });
}

function selectFolder(folder) {
    currentFolderPath = folder;
    if (currentFolderPathEl) currentFolderPathEl.textContent = folder;

    buildRoot(folder);
    renderFilesystem();

    if (!selectedActivity) {
        selectedActivity = 'files';
        updateActivitySelection();
    }
}

function openFile(path) {
    window.electronAPI.readFile(path).then(content => {
        editorEl.value = content;
        currentFilePath = path;
        if (currentFilePathEl) currentFilePathEl.textContent = currentFilePath;
    });
}

function saveFile() {
    if (!currentFilePath) return;
    const content = editorEl.value;
    window.electronAPI.writeFile(currentFilePath, content);
}

function initMenuDropdown() {
    const menuBtn = document.getElementById("menu-btn");
    const menuDropdown = document.getElementById("menu-dropdown");

    menuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        menuDropdown.style.display = menuDropdown.style.display === "flex" ? "none" : "flex";
    });

    menuDropdown.addEventListener("click", (e) => {
        e.stopPropagation();
    });

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

function initButtonControls() {
    window.addEventListener("keydown", async (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "o") {
            e.preventDefault();
            await handleMenuAction("open-folder");
        }
    });
}

function updateActivitySelection() {
    const activityButtons = document.querySelectorAll('.activity-btn');
    const app = document.querySelector('.app');
    const sidebar = document.querySelector('.side-bar');
    const activityLabel = document.getElementById('current-activity');

    const ACTIVITY_NAMES = {
        files: 'Files',
        git: 'Git',
        cmake: 'CMake',
        profile: 'Profile',
        settings: 'Settings'
    };

    activityButtons.forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.id === selectedActivity);
    });

    if (sidebar) {
        sidebar.style.display = selectedActivity ? 'block' : 'none';
    }

    if (activityLabel) {
        activityLabel.textContent = selectedActivity
            ? (ACTIVITY_NAMES[selectedActivity] || '')
            : '';
    }

    const panels = {
        files: document.getElementById("filesystem-panel"),
        git: document.getElementById("git-panel"),
        cmake: document.getElementById("cmake-panel"),
        profile: document.getElementById("profile-panel"),
        settings: document.getElementById("settings-panel")
    };

    for (const key in panels) {
        if (!panels[key]) continue;
        panels[key].classList.toggle('active', key === selectedActivity);
    }
}

function initActivityBar() {
    const activityButtons = document.querySelectorAll('.activity-btn');
    const app = document.querySelector('.app');
    const resizer = document.querySelector(".sidebar-resizer");
    const DEFAULT_SIDEBAR_WIDTH = 200;

    activityButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();

            if (selectedActivity === btn.dataset.id) {
                selectedActivity = null;
                app.style.setProperty('--sidebar-width', '0px');
            } else {
                selectedActivity = btn.dataset.id;
                app.style.setProperty('--sidebar-width', `${lastSidebarWidth || DEFAULT_SIDEBAR_WIDTH}px`);
            }

            updateActivitySelection();

            if (resizer) {
                const width = parseInt(getComputedStyle(app).getPropertyValue("--sidebar-width"));
                resizer.style.left = `calc(var(--activitybar-width) + ${width}px)`;
            }
        });
    });
}

function initSidebar() {
    const app = document.querySelector('.app');
    const sidebar = document.querySelector('.side-bar');
    const resizer = document.querySelector(".sidebar-resizer");

    if (app) app.style.setProperty('--sidebar-width', '0px');
    if (sidebar) sidebar.style.display = 'none';
    if (!resizer || !app) return;

    let isResizing = false;
    let pendingCollapse = false;
    const MIN_WIDTH = 125;
    const COLLAPSE_THRESHOLD = 40;

    resizer.addEventListener("mousedown", (e) => {
        e.preventDefault();
        isResizing = true;
        pendingCollapse = false;
        document.body.style.cursor = "ew-resize";
        document.body.style.userSelect = "none";
    });

    window.addEventListener("mousemove", (e) => {
        if (!isResizing) return;

        const activityWidth = parseInt(getComputedStyle(app).getPropertyValue("--activitybar-width"));
        const rawWidth = e.clientX - activityWidth;
        let width;

        if (rawWidth <= COLLAPSE_THRESHOLD) {
            pendingCollapse = true;
            width = 0;
        } else {
            pendingCollapse = false;
            width = Math.max(MIN_WIDTH, rawWidth);
            if (!selectedActivity) {
                selectedActivity = lastActiveActivity || 'files'; 
                updateActivitySelection();
            }
        }
        app.style.setProperty("--sidebar-width", `${width}px`);
        resizer.style.left = `calc(var(--activitybar-width) + ${width}px)`;
        const sidebar = document.querySelector(".side-bar");
        if (sidebar) sidebar.style.display = width === 0 ? "none" : "block";
    });

    window.addEventListener("mouseup", () => {
        if (!isResizing) return;
        isResizing = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";

        if (pendingCollapse) {
            if (selectedActivity) lastActiveActivity = selectedActivity;
            selectedActivity = null;
            updateActivitySelection();
            app.style.setProperty("--sidebar-width", "0px");
            resizer.style.left = `calc(var(--activitybar-width) + 0px)`;
        } else {
            lastSidebarWidth = parseInt(getComputedStyle(app).getPropertyValue("--sidebar-width"));
            app.style.setProperty("--sidebar-width", `${width}px`);
            resizer.style.left = `calc(var(--activitybar-width) + ${width}px)`;
            const sidebar = document.querySelector(".side-bar");
            if (sidebar) sidebar.style.display = width === 0 ? "none" : (selectedActivity ? "block" : "none");

        }

        const finalWidth = parseInt(getComputedStyle(app).getPropertyValue("--sidebar-width"));
        resizer.style.left = `calc(var(--activitybar-width) + ${finalWidth}px)`;
    });

    window.addEventListener("resize", () => {
        const current = parseInt(getComputedStyle(app).getPropertyValue("--sidebar-width"));
        resizer.style.left = `calc(var(--activitybar-width) + ${current}px)`;
    });
}

function initTerminal() {
    const container = document.getElementById('terminal');
    const resizer = document.querySelector(".terminal-resizer");
    const app = document.querySelector(".app");
    if (!container  || !resizer || !app) return;
    
    term = new Terminal({
        fontFamily: '"Fira Code", monospace',
        fontSize: 10,
        cursorBlink: true,
        theme: {
            background: '#121212',
            foreground: '#ffffff',
            cursor: '#ffffff'
        }
    });

    // fitAddon = new FitAddon();
    // term.loadAddon(fitAddon);
    term.open(container);
    // fitAddon.fit();

    window.terminalAPI.onOutput(data => term.write(data));
    window.terminalAPI.start();
    term.onData(data => window.terminalAPI.send(data));

    let isResizing = false;
    const MIN_HEIGHT = 0;

    function clampTerminal(height) {
        const menubar = parseInt(getComputedStyle(app).getPropertyValue("--menubar-height"));
        const statusbar = parseInt(getComputedStyle(app).getPropertyValue("--statusbar-height"));
        const max = window.innerHeight - menubar - statusbar - 4;
        return Math.max(MIN_HEIGHT, Math.min(max, height));
    }

    resizer.addEventListener("mousedown", (e) => {
        e.preventDefault();
        isResizing = true;
        resizer.classList.add("active");
        document.body.style.cursor = "ns-resize";
        document.body.style.userSelect = "none";
    });

    window.addEventListener("mousemove", (e) => {
        if (!isResizing) return;
        const statusbar = parseInt(getComputedStyle(app).getPropertyValue("--statusbar-height"));
        const rawHeight = window.innerHeight - e.clientY - statusbar;
        const clamped = clampTerminal(rawHeight);
        app.style.setProperty("--terminal-height", `${clamped}px`);
        if (term && fitAddon) fitAddon.fit();
    });

    window.addEventListener("mouseup", () => {
        isResizing = false;
        resizer.classList.remove("active");
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
    });

    window.addEventListener("resize", () => {
        const current = parseInt(getComputedStyle(app).getPropertyValue("--terminal-height"));
        app.style.setProperty("--terminal-height", `${clampTerminal(current)}px`);
    });
}
