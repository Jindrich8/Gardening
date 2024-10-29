import { device } from './modules/device.js';
import './modules/scroll_detector.js';
import { once_event_listener_options as once_options } from './modules/utils.js';



const event_time_gap = 1;
const last_event = {
    timeStamp: undefined,
    target: undefined,
    x: undefined,
    y: undefined
};

document.body.dataset['js'] = true;


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
    last_event.timeStamp = e.timeStamp;
    last_event.target = e.target;
    last_event.x = e.x;
    last_event.y = e.y;
}


function isDropdownOpen(e) {
    return e.classList.contains("open");
}

function isDuplicateEvent(e
) {
    const isDifferent = last_event.timeStamp === undefined || last_event.target === undefined ||
        e.timeStamp - last_event.timeStamp >= event_time_gap
        || (last_event.x !== undefined && last_event.x !== e.x)
        || (last_event.y !== undefined && last_event.y !== last_event.y);
    if (isDifferent) {
        setLastEvent(e);
    }
    return !isDifferent;
}

function toggleDropdown(e, force) {
    const isOpen = e.classList.toggle("open", force);
    const btn = e.querySelector(".dropdown_btn");
    if (btn) {
        btn.ariaExpanded = isOpen.toString();
    }
    console.log(`isOpen: ${isOpen}`);
    return isOpen;
}

let scroll_controller = new AbortController();
let dropdown_open_count = 0;

const handleDropdownClose = () => {
    if (--dropdown_open_count <= 0 && scroll_controller) {
        scroll_controller.abort();
        scroll_controller = undefined;
    }
};

function dropdownShouldStayOpen(e) {
    e instanceof HTMLElement && (e === document.activeElement || !device.isMobile() && e.matches(':hover'))
}



const handleDropdownOpen = () => {
    if (dropdown_open_count <= 0) {
        dropdown_open_count = 0;
        scroll_controller = new AbortController();
        document.addEventListener('scroll', () => {
            document.querySelectorAll(".dropdown.open").forEach(e => {
                if (e instanceof HTMLElement && !dropdownShouldStayOpen(e)) {
                    toggleDropdown(e, false);
                }
            });
        }, { ...once_options, signal: scroll_controller.signal });
    }
    ++dropdown_open_count;
}

const registerDropdown = (e) => {
    if (!(e instanceof HTMLElement) || !e.classList.contains('dropdown')) {
        return;
    }
    function openCallback(state) {
        state.controller?.abort();
        toggle(state.e, true);
        registerOnClose(state);
    }

    function closeCallback(state) {
        state.controller?.abort();
        toggle(state.e, false);
        registerOnOpen(state);
    }

    function toggle(e, force) {
        const isOpen = toggleDropdown(e, force);
        (isOpen ? handleDropdownOpen : handleDropdownClose)();
        return isOpen;
    }

    function getOptions(state) {
        return { ...once_options, signal: state.controller.signal };
    }



    function registerOnOpen(state) {
        state.controller = new AbortController();
        const options = getOptions(state);
        state.callback = createCallback(() => openCallback(state));
        state.e.addEventListener('focus', state.callback, options);
        if (!device.isMobile()) {
            state.e.addEventListener('mouseenter', state.callback, options);
        }
    }

    function registerOnClose(state) {
        state.controller = new AbortController();
        const options = getOptions(state);
        state.callback = createCallback(() => closeCallback(state));
        state.e.addEventListener('blur', state.callback, options);
        if (!device.isMobile()) {
            state.e.addEventListener('mouseleave', state.callback, options);
        }

    }

    const state = {
        e: e,
        controller: undefined,
        callback: undefined
    };
    const callback = createCallback(() => {
        state.controller?.abort();
        if (toggle(state.e)) {
            registerOnClose(state)
        }
        else {
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

    const btn = state.e.querySelector('.dropdown_btn');
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

document.querySelectorAll(".dropdown").forEach(e => registerDropdown(e));







