
const { Terminal } = window;
const { FitAddon } = window;

let currentFilePath = null;
let currentFolderPath = null;

const currentFilePathEl = document.getElementById("current-file-path");
const currentFolderPathEl = document.getElementById("current-folder-path");

let selectedActivity = null;

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
    initActivityControls();
    initSidebarResize();
    initTerminalResize();
    initTerminal();
});

function injectIcons(root = document) {
    root.querySelectorAll("[data-icon]").forEach(el => {
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

function initActivityControls() {
    const activityButtons = document.querySelectorAll('.activity-btn');
    const app = document.querySelector('.app');
    const sidebar = document.querySelector('.side-bar');
    const activityLabel = document.getElementById('current-activity');
    const DEFAULT_SIDEBAR_WIDTH = 200;

    let previousActivity = null;

    const ACTIVITY_NAMES = {
        files: 'Files',
        git: 'Git',
        cmake: 'CMake',
        profile: 'Profile',
        settings: 'Settings'
    };

    if (activityButtons.length > 0) {
        selectedActivity = activityButtons[0].dataset.id;
        previousActivity = selectedActivity;
        if (app) app.style.setProperty('--sidebar-width', `${DEFAULT_SIDEBAR_WIDTH}px`);
        if (activityLabel) activityLabel.textContent = ACTIVITY_NAMES[selectedActivity] || '';
    }

    activityButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (selectedActivity === btn.dataset.id) {
                selectedActivity = null;
            } else {
                selectedActivity = btn.dataset.id;
                if (previousActivity === null && app) {
                    app.style.setProperty('--sidebar-width', `${DEFAULT_SIDEBAR_WIDTH}px`);
                }
            }
            updateActivitySelection();
        });
    });

    updateActivitySelection();

    function updateActivitySelection() {
        activityButtons.forEach(btn => {
            btn.classList.toggle('selected', btn.dataset.id === selectedActivity);
        });

        if (sidebar) {
            sidebar.style.display = selectedActivity ? 'block' : 'none';
            if (!selectedActivity && app) {
                app.style.setProperty('--sidebar-width', '0px');
            }
        }

        if (activityLabel) {
            activityLabel.textContent = selectedActivity ? (ACTIVITY_NAMES[selectedActivity] || '') : '';
        }

        previousActivity = selectedActivity;

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
}

function initSidebarResize() {
    const resizer = document.querySelector(".sidebar-resizer");
    const app = document.querySelector(".app");
    if (!resizer || !app) return;

    let isResizing = false;
    const MIN_WIDTH = 100;

    function clampSidebar(width) {
        const max = window.innerWidth - 100;
        return Math.max(MIN_WIDTH, Math.min(max, width));
    }

    resizer.addEventListener("mousedown", (e) => {
        e.preventDefault();
        isResizing = true;
        resizer.classList.add("active");
        document.body.style.cursor = "ew-resize";
        document.body.style.userSelect = "none";
    });

    window.addEventListener("mousemove", (e) => {
        if (!isResizing) return;
        const activityWidth = parseInt(getComputedStyle(app).getPropertyValue("--activitybar-width"));
        const rawWidth = e.clientX - activityWidth;
        const clamped = clampSidebar(rawWidth);
        app.style.setProperty("--sidebar-width", `${clamped}px`);
    });

    window.addEventListener("mouseup", () => {
        isResizing = false;
        resizer.classList.remove("active");
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
    });

    window.addEventListener("resize", () => {
        const current = parseInt(getComputedStyle(app).getPropertyValue("--sidebar-width"));
        const clamped = clampSidebar(current);
        app.style.setProperty("--sidebar-width", `${clamped}px`);
    });
}

function initTerminalResize() {
    const resizer = document.querySelector(".terminal-resizer");
    const app = document.querySelector(".app");
    if (!resizer || !app) return;

    let isResizing = false;
    const MIN_HEIGHT = 50;

    function clampTerminal(height) {
        const menubar = parseInt(getComputedStyle(app).getPropertyValue("--menubar-height"));
        const statusbar = parseInt(getComputedStyle(app).getPropertyValue("--statusbar-height"));
        const max = window.innerHeight - menubar - statusbar - 50;
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

function initTerminal() {
    const terminalContainer = document.getElementById('terminal-container');
    if (!terminalContainer) return;

    const term = new Terminal({
        fontFamily: '"Fira Code", monospace',
        fontSize: 14,
        cursorBlink: true,
        theme: { background: '#1e1e1e', foreground: '#ffffff' },
        disableStdin: false
    });

    const fitAddon = new FitAddon.FitAddon();
    term.loadAddon(fitAddon);

    term.open(terminalContainer);
    fitAddon.fit();

    term.focus();

    // Terminal input/output hooks
    term.onData(data => window.electronAPI.sendTerminalInput(data));
    window.electronAPI.onTerminalOutput(data => term.write(data));

    // Resize terminal when window resizes or sidebar changes
    window.addEventListener('resize', resize);
}
