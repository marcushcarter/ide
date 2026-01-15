import { ICONS } from './constants.js';

export function injectIcons() {
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