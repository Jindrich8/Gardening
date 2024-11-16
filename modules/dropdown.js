import { onceEventListenerOptions as onceOptions } from './utils.js';
import { device } from './device.js';

const eventTimeGap = 1;
const lastEvent = {
    timeStamp: undefined,
    target: undefined,
    x: undefined,
    y: undefined
};

document.body.classList.add("supports-js");


function createCallback(callback) {
    return (event, ...params) => {
        if (isDuplicateEvent(event)) {
            console.log(`--Duplicate event ${event.type}--`);
            return;
        }
        console.log(`--Event ${event.type}--`);
        callback(event, ...params);
    };
}

function setLastEvent(e) {
    lastEvent.timeStamp = e.timeStamp;
    lastEvent.target = e.target;
    lastEvent.x = e.x;
    lastEvent.y = e.y;
}

function getBtn(e) {
    return e.querySelector('.js-dropdown-btn');
}


function isDropdownOpen(e) {
    return e.classList.contains("open");
}

function isDuplicateEvent(e
) {
    const isDifferent = lastEvent.timeStamp === undefined || lastEvent.target === undefined ||
        e.timeStamp - lastEvent.timeStamp >= eventTimeGap
        || (lastEvent.x !== undefined && lastEvent.x !== e.x)
        || (lastEvent.y !== undefined && lastEvent.y !== lastEvent.y);
    if (isDifferent) {
        setLastEvent(e);
    }
    return !isDifferent;
}

function toggleDropdown(e, force) {
    const isOpen = e.classList.toggle("open", force);
    const btn = getBtn(e);
    if (btn) {
        btn.ariaExpanded = isOpen.toString();
    }
    console.log(`isOpen: ${isOpen}`);
    return isOpen;
}

let scrollController = new AbortController();
let dropdownOpenCount = 0;

const handleDropdownClose = () => {
    if (--dropdownOpenCount <= 0 && scrollController) {
        scrollController.abort();
        scrollController = undefined;
    }
};

function dropdownShouldStayOpen(e) {
    return e instanceof HTMLElement && (e === document.activeElement || !device.isTouch() && e.matches(':hover'));
}



const handleDropdownOpen = () => {
    if (dropdownOpenCount <= 0) {
        dropdownOpenCount = 0;
        scrollController = new AbortController();
        document.addEventListener('scroll', () => {
            document.querySelectorAll(".js-dropdown.open").forEach(e => {
                if (e instanceof HTMLElement && !dropdownShouldStayOpen(e)) {
                    toggleDropdown(e, false);
                    --dropdownOpenCount;
                }
            });
        }, { ...onceOptions, signal: scrollController.signal });
    }
    ++dropdownOpenCount;
}

const registerDropdown = (e) => {
    if (!(e instanceof HTMLElement) || !e.classList.contains('js-dropdown')) {
        return;
    }
    function openCallback(event, state) {
        onOpen(event, state.e);
        state.controller?.abort();
        toggle(state.e, true);
        registerOnClose(state);
    }

    function onOpen(event, e) {
        const type = event.type === 'mouseenter' ? 'hover' : event.type;
        e.dataset['openedBy'] = type;
    }

    function onClose(e) {
        delete e.dataset['openedBy'];
    }

    function closeCallback(state) {
        onClose(state.e);
        state.controller?.abort();
        toggle(state.e, false);
        registerOnOpen(state);
    }

    function toggle(e, force) {
        const isOpen = toggleDropdown(e, force);
        if (isOpen) {
            handleDropdownOpen();
        }
        else {
            handleDropdownClose();
        }
        return isOpen;
    }

    function getOptions(state) {
        return { ...onceOptions, signal: state.controller.signal };
    }

    function registerOnOpen(state) {
        state.controller = new AbortController();
        const options = getOptions(state);
        const callback = (event) => openCallback(event, state);
        state.callback = createCallback(callback);
        state.e.addEventListener('focus', callback, options);
        if (!device.isMobile()) {
            state.e.addEventListener('mouseenter', state.callback, options);
        }
    }

    function registerOnClose(state) {
        state.controller = new AbortController();
        const options = getOptions(state);
        state.callback = createCallback(() => closeCallback(state));
        state.e.addEventListener('blur', state.callback, options);
        state.e.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeCallback(state);
                getBtn(state.e).focus();
            }
        }, { ...options, once: false });
        if (!device.isMobile()) {
            state.e.addEventListener('mouseleave', state.callback, options);
        }

    }

    const state = {
        e: e,
        controller: undefined,
        callback: undefined,
    };
    const callback = createCallback((event) => {
        state.controller?.abort();
        if (state.e.dataset['openedBy'] === 'hover' && !device.isTouch() && !device.isMobile()) {
            const allHref = state.e.dataset['jsAllHref'];
            if (allHref != null) {
                const href = (new URL(allHref, window.location.origin)).href;
                window.location.href = href;
            }
        }
        if (toggle(state.e)) {
            onOpen(event, state.e);
            registerOnClose(state)
        }
        else {
            onClose(state.e);
            registerOnOpen(state);
        }
    });

    device.addDeviceChangeListener((isMobile) => {
        if (state.callback) {
            const e = state.e;
            const event = isDropdownOpen(e) ? 'mouseleave' : 'mouseenter';
            const options = getOptions(state);
            if (isMobile) {
                e.removeEventListener(event, state.callback, options);
            }
            else {
                e.addEventListener(event, state.callback, options);
            }
        }
    });

    const btn = getBtn(state.e);
    const isOpen = isDropdownOpen(state.e);
    if (btn) {
        btn?.addEventListener('click', callback, {
            passive: true,
            capture: false
        });
        btn.ariaExpanded = isOpen.toString();
    }
    if (isOpen) {
        registerOnClose(state);
    }
    else {
        registerOnOpen(state);
    }


};

export { registerDropdown };