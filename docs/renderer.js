
let currentFilePath = null;
let currentFolderPath = null;

const currentFilePathEl = document.getElementById("current-file-path");
const currentFolderPathEl = document.getElementById("current-folder-path");

let selectedActivity = null;

window.addEventListener('DOMContentLoaded', () => {
    injectIcons();
    initWindowControls();
    initMenuDropdown();
    initButtonControls();
    initActivityControls();
});

const ICONS = {
    files: "../assets/fonts/vscode-codicon/files.svg",
    git: "../assets/fonts/vscode-codicon/git-branch.svg",
    cmake: "../assets/icons/cmake.svg",
    settings: "../assets/fonts/vscode-codicon/settings-gear.svg"
};

function injectIcons(root = document) {
    root.querySelectorAll("[data-icon]").forEach(el => {
        if (el.dataset.iconInjected) return;

        const iconName = el.dataset.icon;
        const path = ICONS[iconName];
        if (!path) {
            console.warn(`Missing icon: ${iconName}`);
            return;
        }

        fetch(path)
            .then(r => r.text())
            .then(svg => {
                el.innerHTML = svg;
                el.dataset.iconInjected = "true";
            });
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

    async function handleMenuAction(action) {
        switch (action) {
            case "open-folder":
                const folder = await window.electronAPI.openProjectFolder();
                if (folder) {
                    currentFolderPath = folder;
                    console.log("Current project folder:", currentFolderPath);
                    currentFilePathEl.textContent = currentFolderPath;
                }
                break;
            case "open-file":
                const file = await window.electronAPI.openFile();
                if (file) {
                    currentFilePath = file;
                    console.log("Current file path:", currentFilePath);
                    currentFolderPathEl.textContent = currentFilePath;
                }
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

function initActivityControls() {
    const activityButtons = document.querySelectorAll('.activity-btn');

    if (activityButtons.length > 0) {
        selectedActivity = activityButtons[0].dataset.id;
    }

    activityButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            selectedActivity = btn.dataset.id;
            updateActivitySelection();
        });
    });

    updateActivitySelection();

    function updateActivitySelection() {
        activityButtons.forEach(btn => {
            if (btn.dataset.id === selectedActivity) {
                btn.classList.add('selected');
            } else {
                btn.classList.remove('selected');
            }
        });
    }
}