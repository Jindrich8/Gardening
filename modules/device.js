const mobileMedia = window.matchMedia("only screen and (max-width: 600px)");
const uniqueObservers = new Map();

mobileMedia.addEventListener('change', (e) => {
    const isMobile = e.matches;
    for (const key of uniqueObservers.keys()) {
        key(isMobile);
    }
});

export const device = ({
    isMobile: () => mobileMedia.matches,
    addDeviceChangeListener: (callback) => {
        uniqueObservers.set(callback, true);
    },
    removeDeviceChangeListener: (callback) => {
        uniqueObservers.delete(callback);
    }
});

