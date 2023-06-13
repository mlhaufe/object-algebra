import { Algebra } from "../Algebra.mjs"
import { Merge } from "../Merge.mjs"

describe('ListAlg', () => {
    // TODO: need to find a convenient way to represent Higher Kinded Types
    // See TypeScript issue <https://github.com/microsoft/TypeScript/issues/1213>
    interface ListAlg<T> extends Algebra {
        Nil(): T
        Cons(head: any, tail: T): T
    }

    abstract class ListData<T> { }
    class Nil<T> extends ListData<T> { }
    class Cons<T> extends ListData<T> {
        constructor(readonly head: any, readonly tail: ListData<T>) { super() }
    }

    class ListFactory<T> implements ListAlg<ListData<T>> {
        Nil(): Nil<T> {
            return new Nil()
        }
        Cons(head: any, tail: ListData<T>): Cons<T> {
            return new Cons(head, tail)
        }
    }

    interface ILengthable { length(): number }
    class Lengthable implements ListAlg<ILengthable> {
        Nil(): ILengthable {
            return { length() { return 0 } }
        }
        Cons(head: any, tail: ILengthable) {
            return { length() { return 1 + tail.length() } }
        }
    }

    interface IConcatable { concat(other: IConcatable): this }
    class Concatable implements ListAlg<IConcatable> {
        Nil(): IConcatable {
            return {
                concat(other) { return other }
            }
        }
        Cons(head: any, tail: IConcatable): IConcatable {
            const family = this
            return {
                concat(other) { return family.Cons(head, tail.concat(other)) }
            }
        }
    }

    test('Merge', () => {
        class List extends Merge(ListFactory, Lengthable, Concatable) { }

        const { Nil, Cons } = new List()

        const xs = Cons(1, Cons(2, Cons(3, Nil())))

        expect(xs.length()).toBe(3)

        const ys = Cons(4, Cons(5, Cons(6, Nil())))
        const zs = xs.concat(ys)

        expect(zs.length()).toBe(6)
    })
})