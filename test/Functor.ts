import App from "../src/hkt/App"
//import Algebra from "../src/Algebra"

//extends Algebra<F> ?
interface Functor<F> {
    map<A,B>(f: (a: A) => B, fa: App<F,A>): App<F,B>
}

export default Functor