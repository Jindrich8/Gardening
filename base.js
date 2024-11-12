import { device } from './modules/device.js';
import './modules/scroll_detector.js';
import { registerDropdown } from './modules/dropdown.js';

//#region temp header and footer synchronizer

function getBetween(text, tag) {
    const startTag = `<${tag}>`;
    const endTag = `</${tag}>`;
    const start = text.indexOf(startTag) + startTag.length;
    const end = text.indexOf(endTag);
    return text.substring(start, end);
}
fetch(window.location.origin).then((resp) => resp.text())
    .then((text) => {
        document.querySelector('header').innerHTML = getBetween(text, 'header');
        document.querySelector('footer').innerHTML = getBetween(text, 'footer');
        main();
    });
//#endregion temp header and footer synchronizer

function main() {
    window.device = device;
    document.querySelectorAll(".js-dropdown").forEach(e => registerDropdown(e));
}






