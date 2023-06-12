export function getAllPropertyDescriptors(obj: object, descriptors = Object.create(null)): Record<string, PropertyDescriptor> {
    if (obj === null) {
        return descriptors;
    }

    const proto = Object.getPrototypeOf(obj);
    const protoDescriptors = Object.getOwnPropertyDescriptors(obj);

    Object.assign(descriptors, protoDescriptors);

    return getAllPropertyDescriptors(proto, descriptors);
}
