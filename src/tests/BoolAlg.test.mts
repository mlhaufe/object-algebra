import { Algebra } from "../Algebra.mjs"
import { Merge } from "../Merge.mjs"

describe('BoolAlg', () => {
    interface BoolAlg<T> extends Algebra {
        True(): T
        False(): T
    }

    abstract class BoolData { }
    class True extends BoolData { }
    class False extends BoolData { }

    const TRUE = new True(),
        FALSE = new False()

    class BoolFactory implements BoolAlg<BoolData> {
        True() { return TRUE }
        False() { return FALSE }
    }

    interface IAndable { and(other: IAndable): this }
    class Andable implements BoolAlg<IAndable> {
        True(): IAndable {
            return { and(other) { return other } }
        }
        False(): IAndable {
            return { and(other) { return this } }
        }
    }

    interface IOrable { or(other: IOrable): this }
    class Orable implements BoolAlg<IOrable> {
        True(): IOrable {
            return { or(other) { return this } }
        }
        False(): IOrable {
            return { or(other) { return other } }
        }
    }

    interface INotable { not(): this }
    class Notable implements BoolAlg<INotable> {
        True(): INotable {
            const family = this
            return { not() { return family.False() } }
        }
        False(): INotable {
            const family = this
            return { not() { return family.True() } }
        }
    }

    interface IPrintable { print(): string }
    class Printable implements BoolAlg<IPrintable> {
        True(): IPrintable {
            return { print() { return 'true' } }
        }
        False(): IPrintable {
            return { print() { return 'false' } }
        }
    }

    test('Bool', () => {
        const Bool = Merge(BoolFactory, Andable, Orable, Notable, Printable)

        const bool = new Bool()

        const T = bool.True()
        const F = bool.False()

        expect(T.and(T).print()).toBe('true')
        expect(T.and(F).print()).toBe('false')
        expect(F.and(T).print()).toBe('false')
        expect(F.and(F).print()).toBe('false')

        expect(T.or(T).print()).toBe('true')
        expect(T.or(F).print()).toBe('true')
        expect(F.or(T).print()).toBe('true')
        expect(F.or(F).print()).toBe('false')

        expect(T.not().print()).toBe('false')
        expect(F.not().print()).toBe('true')
    })
})