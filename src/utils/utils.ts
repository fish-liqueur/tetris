export function cloneElement(val: any) {
    return JSON.parse(JSON.stringify(val));
}

export function cloneInstance<T extends {}>(instance: T): T {
    const copy = new (instance.constructor as { new (): T })();
    Object.assign(copy, instance);
    return copy;
}