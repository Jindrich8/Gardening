import { device } from './modules/device.js';
import './modules/scroll_detector.js';
import { registerDropdown } from './modules/dropdown.js';

function main() {
    window.device = device;
    document.querySelectorAll(".js-dropdown").forEach(e => registerDropdown(e));
}
main();






