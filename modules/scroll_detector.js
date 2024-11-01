import { onceEventListenerOptions as onceOptions } from "./utils.js";
const scrollEndOptions = {
    once: false,
    passive: true,
    capture: false
};

function handleScroll() {
    document.body.classList.toggle('scrolled', window.scrollY !== 0);
}

function scrollEndCallback(e) {
    handleScroll();
    if (window.scrollY === 0) {
        window.addEventListener('scroll', scrollCallback, onceOptions);
        window.removeEventListener('scrollend', scrollEndCallback, scrollEndOptions);
    }
}

function scrollCallback(e) {
    handleScroll();
    window.addEventListener('scrollend', scrollEndCallback, scrollEndOptions);
}

handleScroll();
window.addEventListener('scroll', scrollCallback, onceOptions);