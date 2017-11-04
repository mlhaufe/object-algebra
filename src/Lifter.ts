interface Lifter<A,B> {
    lift(a: A, b: B): A & B
}

export default Lifter