import { Algebra } from "./Algebra.mjs";
import { fnEmpty } from "./fnEmpty.mjs"
import { getAllPropertyDescriptors } from "./getAllPropertyDescriptors.mjs";

export type Constructor<T> = new (...args: any[]) => T

// ZipIntersect<[A, B, C], [X, Y, Z]> = [A & X, B & Y, C & Z]
type ZipIntersect<T extends readonly any[], U extends readonly any[]> = {
    [K in keyof T]: T[K] & (K extends keyof U ? U[K] : never)
}

// MyAlgebra<T> => MyAlgebra<any>
type Empty<Alg extends Algebra> = {
    [K in keyof Alg]: Alg[K] extends (...args: any[]) => any ?
    (...args: any[]) => any : never
}

// MergeAlgebra<MyAlgebra<T>, MyAlgebra<U>> => MyAlgebra<T & U>
type MergeAlgebra<LAlg extends Algebra, RAlg extends Algebra> = {
    [K in keyof LAlg]: (K extends keyof RAlg ?
        [LAlg[K], RAlg[K]] extends [(...args: infer LArgs) => infer LOut, (...args: infer RArgs) => infer ROut] ?
        (...args: ZipIntersect<LArgs, RArgs>) => LOut & ROut
        : never : never)
};

// TODO: lift a Fold type out of this
// Something like: type MergeAlgebras<AS extends Algebra[]> = Fold<AS, Empty<AS>, MergeAlgebra<any, any>>
type MergeAlgebras<AS extends Algebra[]> = {
    0: AS[0],
    1: MergeAlgebras<AS extends [infer L extends Algebra, infer R extends Algebra, ...infer Rest extends Algebra[]] ? [MergeAlgebra<L, R>, ...Rest] : [Empty<AS[0]>]>,
}[AS extends [Algebra, Algebra, ...Algebra[]] ? 1 : 0];

// [Constructor<A>, Constructor<B>, Constructor<C>] => [A, B, C]
type UnCons<CS extends Constructor<any>[]> = {
    [K in keyof CS]: CS[K] extends Constructor<infer T> ? T : never;
};

/**
 * Merge multiple Algebras into a single Algebra
 */
export function Merge<CS extends Constructor<Algebra>[]>(...constructors: CS): Constructor<MergeAlgebras<UnCons<CS>>> {
    return class {
        static {
            for (let Con of constructors) {
                //const descs = Object.getOwnPropertyDescriptors(Con.prototype)
                const descs = getAllPropertyDescriptors(Con.prototype)
                for (let [name, desc] of Object.entries(descs)) {
                    if (name === 'constructor') continue
                    const currMethod = Object.getOwnPropertyDescriptor(this.prototype, name)?.value ?? fnEmpty,
                        descMethod = desc.value ?? fnEmpty
                    Object.defineProperty(this.prototype, name, {
                        writable: true,
                        value(...args: any[]) {
                            return Object.assign(
                                currMethod.apply(this, args),
                                descMethod.apply(this, args)
                            )
                        }
                    })
                }
            }
        }

        constructor(...args: any[]) {
            constructors.forEach((C) =>
                Object.assign(this, Reflect.construct(C, args, this.constructor))
            )
        }
    } as any
}