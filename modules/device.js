const mobileMedia = window.matchMedia("only screen and (max-width: 700px)");
const touchScreenMedia = window.matchMedia("(pointer: coarse)");
const mobileUniqueObservers = new Map();
const touchUniqueObservers = new Map();

mobileMedia.addEventListener('change', (e) => {
    const isMobile = e.matches;
    for (const key of mobileUniqueObservers.keys()) {
        key(isMobile);
    }
});

touchScreenMedia.addEventListener('change', (e) => {
    const isTouch = e.matches;
    for (const key of touchUniqueObservers.keys()) {
        key(isTouch);
    }
});

export const device = ({
    isMobile: () => mobileMedia.matches,
    isTouch: () => touchScreenMedia.matches,
    addDeviceChangeListener: (callback) => {
        mobileUniqueObservers.set(callback, true);
    },
    removeDeviceChangeListener: (callback) => {
        mobileUniqueObservers.delete(callback);
    },
    addMouseChangeListener: (callback) => {
        touchUniqueObservers.set(callback, true);
    },
    removeMouseChangeListener: (callback) => {
        touchUniqueObservers.delete(callback);
    }
});

