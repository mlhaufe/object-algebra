import { Algebra } from '../Algebra.mjs'
import { Merge } from '../Merge.mjs'

describe('Point', () => {
    interface PointAlg<T> extends Algebra {
        Point2(x: number, y: number): T
        Point3(x: number, y: number, z: number): T
    }

    class PointData { }
    class Point2 extends PointData {
        constructor(readonly x: number, readonly y: number) { super() }
    }
    class Point3 extends PointData {
        constructor(readonly x: number, readonly y: number, readonly z: number) { super() }
    }

    class PointDataFactory implements PointAlg<PointData> {
        Point2(x: number, y: number) {
            return new Point2(x, y)
        }
        Point3(x: number, y: number, z: number) {
            return new Point3(x, y, z)
        }
    }

    interface IPrintable { print(): string }
    class Printable implements PointAlg<IPrintable> {
        Point2(x: number, y: number): IPrintable {
            return {
                print() { return `(${x}, ${y})` }
            }
        }
        Point3(x: number, y: number, z: number): IPrintable {
            return {
                print() { return `(${x}, ${y}, ${z})` }
            }
        }
    }

    interface IAddable { add(other: PointData & IAddable): this }
    class Addable implements PointAlg<IAddable & PointData> {
        Point2(x: number, y: number): IAddable & Point2 {
            const family = this
            return {
                add(other: Point2 & IAddable) { return family.Point2(x + other.x, y + other.y) }
            } as any
        }
        Point3(x: number, y: number, z: number): IAddable & Point3 {
            const family = this
            return {
                add(other: Point3 & IAddable) { return family.Point3(x + other.x, y + other.y, z + other.z) }
            } as any
        }
    }

    test('Merge', () => {
        class PointFactory extends Merge(PointDataFactory, Printable, Addable) { }

        const { Point2, Point3 } = new PointFactory()

        const p1 = Point2(1, 2)
        expect(p1.x).toBe(1)
        expect(p1.y).toBe(2)
        expect(p1.print()).toBe('(1, 2)')

        const p2 = Point2(3, 4)
        expect(p2.x).toBe(3)
        expect(p2.y).toBe(4)
        expect(p2.print()).toBe('(3, 4)')

        const p3 = p1.add(p2)
        expect(p3.x).toBe(4)
        expect(p3.y).toBe(6)
        expect(p3.print()).toBe('(4, 6)')

        const p4 = Point3(1, 2, 3)
        expect(p4.x).toBe(1)
        expect(p4.y).toBe(2)
        expect(p4.z).toBe(3)
        expect(p4.print()).toBe('(1, 2, 3)')

        const p5 = Point3(4, 5, 6)
        expect(p5.x).toBe(4)
        expect(p5.y).toBe(5)
        expect(p5.z).toBe(6)
        expect(p5.print()).toBe('(4, 5, 6)')

        const p6 = p4.add(p5)
        expect(p6.x).toBe(5)
        expect(p6.y).toBe(7)
        expect(p6.z).toBe(9)
        expect(p6.print()).toBe('(5, 7, 9)')
    })
})