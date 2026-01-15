const { Terminal } = window;
const { FitAddon } = window;

import { global, FSNode } from './scripts/constants.js';

import { injectIcons } from './scripts/icons.js';
import { initWindowControls } from './scripts/windowControls.js';
import { initTerminal } from './scripts/terminal.js';
import { initActivityBar, initSidebar } from './scripts/activity.js';
import { initMenu, saveFile } from './scripts/filesystem.js';

const currentFilePathEl = document.getElementById("current-file-path");
const currentFolderPathEl = document.getElementById("current-folder-path");
const editorEl = document.getElementById("editor");

window.addEventListener('DOMContentLoaded', () => {
    injectIcons();
    initWindowControls();
    initMenu();
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