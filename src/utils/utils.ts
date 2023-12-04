export function cloneElement(val: any) {
    return JSON.parse(JSON.stringify(val));
}

export function cloneInstance<T extends {}>(instance: T): T {
    const copy = new (instance.constructor as { new (): T })();
    Object.assign(copy, instance);
    return copy;
}

export function getCanvasWidth(): number {
    const canvasMaxWidth = 650;
    const breakpoint = 1260;
    const isDesktop = window.innerWidth > breakpoint;

    if (isDesktop) {
        return Math.min(window.innerHeight * 0.8, canvasMaxWidth);
    } else {
        const isVertical = window.innerWidth < window.innerHeight;
        return isVertical ?
            Math.min(window.innerWidth * 0.8, window.innerHeight * 0.5, canvasMaxWidth) :
            Math.min(window.innerWidth * 0.5, window.innerHeight * 0.8, canvasMaxWidth);
    }
}