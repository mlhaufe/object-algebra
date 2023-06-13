import { Algebra } from "../Algebra.mjs"
import { Merge } from "../Merge.mjs"

describe('PeanoAlg', () => {
    interface PeanoAlg<T> extends Algebra {
        Zero(): T
        Succ(pred: T): T
    }

    class PeanoData { }
    class Zero extends PeanoData { }
    class Succ extends PeanoData {
        constructor(readonly pred: PeanoData) { super() }
    }

    class PeanoFactory implements PeanoAlg<PeanoData> {
        Zero() { return new Zero() }
        Succ(pred: PeanoData) { return new Succ(pred) }
    }

    interface IToNumber { toNumber(): number }
    class ToNumber implements PeanoAlg<IToNumber> {
        Zero() {
            return { toNumber() { return 0 } }
        }
        Succ(pred: IToNumber) {
            return {
                toNumber() { return 1 + pred.toNumber() }
            }
        }
    }

    interface IAddable { add(other: IAddable): this }
    class Addable implements PeanoAlg<IAddable> {
        Zero(): IAddable {
            return {
                add(other) { return other }
            }
        }
        Succ(pred: IAddable): IAddable {
            const family = this
            return {
                add(other) {
                    return family.Succ(pred.add(other))
                }
            }
        }
    }

    test('Peano', () => {
        const Peano = Merge(PeanoFactory, ToNumber, Addable)

        const peano = new Peano()

        const Z = peano.Zero()
        const one = peano.Succ(Z)
        const two = peano.Succ(one)
        const three = peano.Succ(two)

        expect(Z.toNumber()).toBe(0)
        expect(one.toNumber()).toBe(1)
        expect(two.toNumber()).toBe(2)
        expect(three.toNumber()).toBe(3)

        expect(Z.add(Z).toNumber()).toBe(0)
        expect(Z.add(one).toNumber()).toBe(1)
        expect(Z.add(two).toNumber()).toBe(2)
        expect(Z.add(three).toNumber()).toBe(3)

        expect(one.add(Z).toNumber()).toBe(1)
        expect(one.add(one).toNumber()).toBe(2)
        expect(one.add(two).toNumber()).toBe(3)
        expect(one.add(three).toNumber()).toBe(4)
    })
})