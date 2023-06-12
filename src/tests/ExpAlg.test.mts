import { Algebra } from "../Algebra.mjs"
import { Merge } from "../Merge.mjs"

describe("ExpAlg", () => {
    interface ExpAlg<T> extends Algebra {
        Lit(value: number): T
        Add(left: T, right: T): T
    }

    abstract class ExpData { }
    class Lit extends ExpData {
        constructor(readonly value: number) { super() }
    }
    class Add extends ExpData {
        constructor(readonly left: ExpData, readonly right: ExpData) { super() }
    }

    class ExpDataFactory implements ExpAlg<ExpData> {
        Lit(value: number): Lit {
            return new Lit(value)
        }
        Add(left: ExpData, right: ExpData): Add {
            return new Add(left, right)
        }
    }

    interface IPrintable { print(): string }
    class Printable implements ExpAlg<IPrintable> {
        Lit(value: number) {
            return {
                print() { return `${value}` }
            }
        }
        Add(left: IPrintable, right: IPrintable) {
            return {
                print() { return `${left.print()} + ${right.print()}` }
            }
        }
    }

    interface IEvaluable { evaluate(): number }
    class Evaluable implements ExpAlg<IEvaluable> {
        Lit(value: number) {
            return {
                evaluate() { return value }
            }
        }
        Add(left: IEvaluable, right: IEvaluable) {
            return {
                evaluate() { return left.evaluate() + right.evaluate() }
            }
        }
    }

    type IExp = ExpData & IPrintable & IEvaluable

    const ExpFactory = Merge(ExpDataFactory, Printable, Evaluable)

    test('Exp Merge', () => {
        const expFactory = new ExpFactory()

        const two = expFactory.Lit(2)
        expect(two.value).toBe(2)
        expect(two.print).toBeInstanceOf(Function)
        expect(two.print()).toBe("2")
        expect(two.evaluate).toBeInstanceOf(Function)
        expect(two.evaluate()).toBe(2)

        const three = expFactory.Add(expFactory.Lit(1), expFactory.Lit(2)),
            l = three.left as IExp & Lit,
            r = three.right as IExp & Lit
        expect(l.value).toBe(1)
        expect(l.print).toBeInstanceOf(Function)
        expect(l.print()).toBe("1")
        expect(l.evaluate).toBeInstanceOf(Function)
        expect(l.evaluate()).toBe(1)
        expect(r.value).toBe(2)
        expect(r.print).toBeInstanceOf(Function)
        expect(r.print()).toBe("2")
        expect(r.evaluate).toBeInstanceOf(Function)
        expect(r.evaluate()).toBe(2)
        expect(three.print).toBeInstanceOf(Function)
        expect(three.print()).toBe("1 + 2")
        expect(three.evaluate).toBeInstanceOf(Function)
        expect(three.evaluate()).toBe(3)
    })

    interface MulExpAlg<T> extends ExpAlg<T> {
        Mul(left: T, right: T): T
    }

    abstract class MulExpData extends ExpData { }
    class Mul extends MulExpData {
        constructor(readonly left: ExpData, readonly right: ExpData) { super() }
    }

    class MulExpDataFactory extends ExpDataFactory implements MulExpAlg<ExpData> {
        Mul(left: ExpData, right: ExpData) {
            return new Mul(left, right)
        }
    }

    class MulPrintable extends Printable implements MulExpAlg<IPrintable> {
        Mul(left: IPrintable, right: IPrintable) {
            return {
                print() { return `${left.print()} * ${right.print()}` }
            }
        }
    }

    class MulEvaluable extends Evaluable implements MulExpAlg<IEvaluable> {
        Mul(left: IEvaluable, right: IEvaluable) {
            return {
                evaluate() { return left.evaluate() * right.evaluate() }
            }
        }
    }

    class MulExpFactory extends Merge(MulExpDataFactory, MulPrintable, MulEvaluable) { }

    type IMulExp = MulExpData & IPrintable & IEvaluable

    test('MulExp Merge', () => {
        const mulExpFactory = new MulExpFactory()

        const two = mulExpFactory.Lit(2)
        expect(two.value).toBe(2)
        expect(two.print).toBeInstanceOf(Function)
        expect(two.print()).toBe("2")
        expect(two.evaluate).toBeInstanceOf(Function)
        expect(two.evaluate()).toBe(2)

        const three = mulExpFactory.Add(mulExpFactory.Lit(1), mulExpFactory.Lit(2)),
            l = three.left as IMulExp & Lit,
            r = three.right as IMulExp & Lit
        expect(l.value).toBe(1)
        expect(l.print).toBeInstanceOf(Function)
        expect(l.print()).toBe("1")
        expect(l.evaluate).toBeInstanceOf(Function)
        expect(l.evaluate()).toBe(1)
        expect(r.value).toBe(2)
        expect(r.print).toBeInstanceOf(Function)
        expect(r.print()).toBe("2")
        expect(r.evaluate).toBeInstanceOf(Function)
        expect(r.evaluate()).toBe(2)
        expect(three.print).toBeInstanceOf(Function)
        expect(three.print()).toBe("1 + 2")
        expect(three.evaluate).toBeInstanceOf(Function)
        expect(three.evaluate()).toBe(3)

        const six = mulExpFactory.Mul(mulExpFactory.Lit(2), mulExpFactory.Lit(3)),
            ml = six.left as IMulExp & Lit,
            mr = six.right as IMulExp & Lit
        expect(ml.value).toBe(2)
        expect(ml.print).toBeInstanceOf(Function)
        expect(ml.print()).toBe("2")
        expect(ml.evaluate).toBeInstanceOf(Function)
        expect(ml.evaluate()).toBe(2)
        expect(mr.value).toBe(3)
        expect(mr.print).toBeInstanceOf(Function)
        expect(mr.print()).toBe("3")
        expect(mr.evaluate).toBeInstanceOf(Function)
        expect(mr.evaluate()).toBe(3)
        expect(six.print).toBeInstanceOf(Function)
        expect(six.print()).toBe("2 * 3")
        expect(six.evaluate).toBeInstanceOf(Function)
        expect(six.evaluate()).toBe(6)
    })
})