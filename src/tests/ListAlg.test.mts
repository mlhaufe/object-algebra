import { Merge } from "../Merge.mjs"

describe('ListAlg', () => {
    class ListData { }
    class Nil extends ListData { }
    class Cons extends ListData {
        constructor(head, tail) {
            super()
            this.head = head
            this.tail = tail
        }
    }

    class ListFactory {
        Nil() {
            return new Nil()
        }
        Cons(head, tail) {
            return new Cons(head, tail)
        }
    }

    class Lengthable {
        Nil() {
            return {
                length() { return 0 }
            }
        }
        Cons(head, tail) {
            return {
                length() { return 1 + tail.length() }
            }
        }
    }

    class Concatable {
        Nil() {
            return {
                concat(other) { return other }
            }
        }
        Cons(head, tail) {
            const family = this
            return {
                concat(other) { return family.Cons(head, tail.concat(other)) }
            }
        }
    }

    test('Merge', () => {
        class List extends Merge(ListFactory, Lengthable, Concatable) { }

        const list = /** @type {any} */ (new List())

        const xs = list.Cons(1, list.Cons(2, list.Cons(3, list.Nil())))

        expect(xs.length()).toBe(3)

        const ys = list.Cons(4, list.Cons(5, list.Cons(6, list.Nil())))
        const zs = xs.concat(ys)

        expect(zs.length()).toBe(6)
    })
})