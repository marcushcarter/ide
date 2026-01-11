window.addEventListener('DOMContentLoaded', () => {
	
    const minimizeBtn = document.getElementById('minimize');
    const maximizeBtn = document.getElementById('maximize');
    const closeBtn = document.getElementById('close');

    minimizeBtn.addEventListener('click', () => window.electronAPI.windowControl('minimize'));
    maximizeBtn.addEventListener('click', () => window.electronAPI.windowControl('maximize'));
    closeBtn.addEventListener('click', () => window.electronAPI.windowControl('close'));

    window.electronAPI.onWindowStateChange((state) => {
        maximizeBtn.textContent = state === 'maximized' ? '❐' : '□';
    });
});
