import Algebra from "../src/Algebra"
import Functor from "./Functor"
import App from "../src/hkt/App"

abstract class OptionAlgebra<F> extends Algebra<F> {
    abstract None<T>(): App<F,T>
    abstract Some<T>(value: T): App<F,T>
    
}

interface Option<T>{}
interface Some<T> extends Option<T>{value: T}
interface None<T> extends Option<T>{}

class OptionFactory<T> extends OptionAlgebra<Option<T>> {
    Some(value: T): Some<T> { return {value} }
    None(): None<T> { return {} }
}