import Lifter from "./Lifter"

class LiftDecorate<A> implements Lifter<A,any> {
    constructor(readonly action: (a:A) => A){ }
    lift(a: A, _: any): A { return this.action(a) }
}

export default LiftDecorate