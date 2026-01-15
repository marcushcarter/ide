
import { global, FSNode } from './constants.js';

export function updateActivitySelection() {
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
        btn.classList.toggle('selected', btn.dataset.id === global.selectedActivity);
    });

    if (sidebar) {
        sidebar.style.display = global.selectedActivity ? 'block' : 'none';
    }

    if (activityLabel) {
        activityLabel.textContent = global.selectedActivity
            ? (ACTIVITY_NAMES[global.selectedActivity] || '')
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
        panels[key].classList.toggle('active', key === global.selectedActivity);
    }
}

export function initActivityBar() {
    window.addEventListener("keydown", async (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "o") {
            e.preventDefault();
            await handleMenuAction("open-folder");
        }
    });
    
    const activityButtons = document.querySelectorAll('.activity-btn');
    const app = document.querySelector('.app');
    const resizer = document.querySelector(".sidebar-resizer");
    const DEFAULT_SIDEBAR_WIDTH = 200;

    activityButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();

            if (global.selectedActivity === btn.dataset.id) {
                global.selectedActivity = null;
                app.style.setProperty('--sidebar-width', '0px');
            } else {
                global.selectedActivity = btn.dataset.id;
                app.style.setProperty('--sidebar-width', `${global.lastSidebarWidth || DEFAULT_SIDEBAR_WIDTH}px`);
            }

            updateActivitySelection();

            if (resizer) {
                const width = parseInt(getComputedStyle(app).getPropertyValue("--sidebar-width"));
                resizer.style.left = `calc(var(--activitybar-width) + ${width}px)`;
            }
        });
    });
}

export function initSidebar() {
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
            if (!global.selectedActivity) {
                global.selectedActivity = global.lastActiveActivity || 'files'; 
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
            if (global.selectedActivity) global.lastActiveActivity = global.selectedActivity;
            global.selectedActivity = null;
            updateActivitySelection();
            app.style.setProperty("--sidebar-width", "0px");
            resizer.style.left = `calc(var(--activitybar-width) + 0px)`;
        } else {
            global.lastSidebarWidth = parseInt(getComputedStyle(app).getPropertyValue("--sidebar-width"));
            app.style.setProperty("--sidebar-width", `${width}px`);
            resizer.style.left = `calc(var(--activitybar-width) + ${width}px)`;
            const sidebar = document.querySelector(".side-bar");
            if (sidebar) sidebar.style.display = width === 0 ? "none" : (global.selectedActivity ? "block" : "none");

        }

        const finalWidth = parseInt(getComputedStyle(app).getPropertyValue("--sidebar-width"));
        resizer.style.left = `calc(var(--activitybar-width) + ${finalWidth}px)`;
    });

    window.addEventListener("resize", () => {
        const current = parseInt(getComputedStyle(app).getPropertyValue("--sidebar-width"));
        resizer.style.left = `calc(var(--activitybar-width) + ${current}px)`;
    });
}