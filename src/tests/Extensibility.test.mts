import { Algebra } from "../Algebra.mjs";
import { Merge } from "../Merge.mjs";

describe('Extensibility', () => {
    interface IntExpAlg<T> extends Algebra {
        Lit(value: number): T
        Add(left: T, right: T): T
    }

    abstract class IntExpData { }
    class Lit extends IntExpData {
        constructor(readonly value: number) { super() }
    }
    class Add extends IntExpData {
        constructor(readonly left: IntExpData, readonly right: IntExpData) { super() }
    }

    class IntExpDataFactory implements IntExpAlg<IntExpData> {
        Lit(value: number): Lit { return new Lit(value) }
        Add(left: IntExpData, right: IntExpData): Add { return new Add(left, right) }
    }

    interface IPrintable { print(): string }
    class IntPrintable implements IntExpAlg<IPrintable> {
        Lit(value: number) {
            return { print() { return `${value}` } }
        }
        Add(left: IPrintable, right: IPrintable) {
            return { print() { return `${left.print()} + ${right.print()}` } }
        }
    }

    interface IEvaluable { evaluate(): number }
    class IntEvaluable implements IntExpAlg<IEvaluable> {
        Lit(value: number) {
            return { evaluate() { return value } }
        }
        Add(left: IEvaluable, right: IEvaluable) {
            return { evaluate() { return left.evaluate() + right.evaluate() } }
        }
    }

    const IntExpFactory = Merge(IntExpDataFactory, IntPrintable, IntEvaluable)

    test('IntExp Merge', () => {
        const { Lit, Add } = new IntExpFactory()
        // 1 + (2 + 3)
        const exp = Add(Lit(1), Add(Lit(2), Lit(3)))

        expect(exp.print()).toBe('1 + 2 + 3')
        expect(exp.evaluate()).toBe(6)
    })

    // Extend with a new data type
    interface IntBoolExpAlg<T> extends IntExpAlg<T> {
        Bool(value: boolean): T
        IIf(pred: T, ifTrue: T, ifFalse: T): T
    }

    abstract class IntBoolExpData extends IntExpData { }
    class Bool extends IntBoolExpData {
        constructor(readonly value: boolean) { super() }
    }
    class IIf extends IntBoolExpData {
        constructor(
            readonly pred: IntBoolExpData,
            readonly ifTrue: IntBoolExpData,
            readonly ifFalse: IntBoolExpData
        ) { super() }
    }

    class IntBoolExpDataFactory extends IntExpDataFactory implements IntBoolExpAlg<IntBoolExpData> {
        Bool(value: boolean): Bool { return new Bool(value) }
        IIf(pred: IntBoolExpData, ifTrue: IntBoolExpData, ifFalse: IntBoolExpData): IIf {
            return new IIf(pred, ifTrue, ifFalse)
        }
    }

    class IntBoolPrintable extends IntPrintable implements IntBoolExpAlg<IPrintable> {
        Bool(value: boolean): IPrintable {
            return { print() { return `${value}` } }
        }
        IIf(pred: IPrintable, ifTrue: IPrintable, ifFalse: IPrintable): IPrintable {
            return { print() { return `${pred.print()} ? ${ifTrue.print()} : ${ifFalse.print()}` } }
        }
    }

    class IntBoolEvaluable extends IntEvaluable implements IntBoolExpAlg<IEvaluable> {
        Bool(value: boolean): IEvaluable {
            return { evaluate() { return value ? 1 : 0 } }
        }
        IIf(pred: IEvaluable, ifTrue: IEvaluable, ifFalse: IEvaluable): IEvaluable {
            return { evaluate() { return pred.evaluate() ? ifTrue.evaluate() : ifFalse.evaluate() } }
        }
    }

    const IntBoolExpFactory = Merge(IntBoolExpDataFactory, IntBoolPrintable, IntBoolEvaluable)

    test('IntBoolExp Merge', () => {
        const { Lit, Add, Bool, IIf } = new IntBoolExpFactory()

        // true ? 1 + 2 : 3
        const eAdd = IIf(Bool(true), Add(Lit(1), Lit(2)), Lit(3)),
            // false ? 1 + 2 : 3
            eLit = IIf(Bool(false), Add(Lit(1), Lit(2)), Lit(3))

        expect(eAdd.print()).toBe('true ? 1 + 2 : 3')
        expect(eAdd.evaluate()).toBe(3)
        expect(eLit.print()).toBe('false ? 1 + 2 : 3')
        expect(eLit.evaluate()).toBe(3)
    })

    interface StmtExpAlg<T> extends IntExpAlg<T> {
        Assign(scope: Map<string, any>, name: string, value: T): T
        Expr(value: T): T
        Seq(first: T, second: T): T
        Var(scope: Map<string, T>, name: string): T
    }

    abstract class StmtExpData extends IntExpData { }
    class Assign extends StmtExpData {
        constructor(
            readonly scope: Map<string, StmtExpData>,
            readonly name: string,
            readonly value: StmtExpData
        ) { super() }
    }
    class Expr extends StmtExpData {
        constructor(readonly value: StmtExpData) { super() }
    }
    class Seq extends StmtExpData {
        constructor(readonly first: StmtExpData, readonly second: StmtExpData) { super() }
    }
    class Var extends StmtExpData {
        constructor(readonly scope: Map<string, StmtExpData>, readonly name: string) { super() }
    }

    class StmtExpDataFactory extends IntBoolExpDataFactory implements StmtExpAlg<StmtExpData> {
        Assign(scope: Map<string, StmtExpData>, name: string, value: StmtExpData): Assign {
            return new Assign(scope, name, value)
        }
        Expr(value: StmtExpData): Expr { return new Expr(value) }
        Seq(first: StmtExpData, second: StmtExpData): Seq {
            return new Seq(first, second)
        }
        Var(scope: Map<string, StmtExpData>, name: string): Var {
            return new Var(scope, name)
        }
    }

    class StmtExpPrintable extends IntBoolPrintable implements StmtExpAlg<IPrintable> {
        Assign(scope: Map<string, IPrintable>, name: string, value: IPrintable): IPrintable {
            return { print() { return `${name} = ${value.print()}` } }
        }
        Expr(value: IPrintable): IPrintable { return value }
        Seq(first: IPrintable, second: IPrintable): IPrintable {
            return { print() { return `${first.print()}; ${second.print()}` } }
        }
        Var(scope: Map<string, IPrintable>, name: string): IPrintable {
            return { print() { return `${name}` } }
        }
    }

    class StmtExpEvaluable extends IntBoolEvaluable implements StmtExpAlg<IEvaluable> {
        Assign(scope: Map<string, IEvaluable>, name: string, value: IEvaluable): IEvaluable {
            return { evaluate() { return scope.set(name, value.evaluate()) } }
        }
        Expr(value: IEvaluable): IEvaluable { return value }
        Seq(first: IEvaluable, second: IEvaluable): IEvaluable {
            return { evaluate() { return second.evaluate() } }
        }
        Var(scope: Map<string, IEvaluable>, name: string): IEvaluable {
            return { evaluate() { return scope.get(name) } }
        }
    }

    const StmtExpFactory = Merge(StmtExpDataFactory, StmtExpPrintable, StmtExpEvaluable)


    test('StmtExp Merge', () => {
        const { Lit, Add, Bool, IIf, Assign, Expr, Seq, Var } = new StmtExpFactory()

        const scope = new Map<string, StmtExpData>()

        // x = 1 + 2; x
        const exp = Seq(
            Assign(scope, 'x', Add(Lit(1), Lit(2))),
            Var(scope, 'x')
        )

        expect(exp.print()).toBe('x = 1 + 2; x')
        expect(exp.evaluate()).toBe(3)
    })

})

