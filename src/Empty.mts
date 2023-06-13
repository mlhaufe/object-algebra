import { Algebra } from "./Algebra.mjs"
import { Constructor } from "./Constructor.mjs"
import { fnEmpty } from "./fnEmpty.mjs"

/**
 * Converts an algebra to an empty algebra.
 */
export function Empty(Alg: Constructor<Algebra>) {
    return class {
        static {
            const descs = Object.getOwnPropertyDescriptors(Alg.prototype)
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