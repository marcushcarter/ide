export const ICONS = {
    files: "../assets/fonts/vscode-codicon/files.svg",
    git: "../assets/fonts/vscode-codicon/git-branch.svg",
    cmake: "../assets/icons/cmake.svg",
    account: "../assets/fonts/vscode-codicon/account.svg",
    settings: "../assets/fonts/vscode-codicon/settings-gear.svg"
};

export const global = {
    fsRoot: null,
    selectedNode: null,
    currentFilePath: null,
    currentFolderPath: null,
    selectedActivity: null,
    lastActiveActivity: null,
    lastSidebarWidth: 200
};

export class FSNode {
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