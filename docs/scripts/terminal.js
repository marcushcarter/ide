let term;
let fitAddon;

export function initTerminal() {
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

export function getTerminal() {
    return term;
}
