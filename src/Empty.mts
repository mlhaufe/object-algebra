import { fnEmpty } from "./fnEmpty.mjs"

/**
 * Converts an algebra to an empty algebra.
 */
export function Empty(Algebra) {
    return class {
        static {
            const descs = Object.getOwnPropertyDescriptors(Algebra.prototype)
            for (let [name] of Object.entries(descs)) {
                if (name === 'constructor') continue
                Object.defineProperty(this.prototype, name, {
                    writable: true,
                    value: fnEmpty
                })
            }
        }
    }
}