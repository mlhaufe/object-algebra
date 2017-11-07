import Algebra from "../src/Algebra"
import Id from "../src/hkt/Id"

abstract class BoolAlgebra<T> extends Algebra<T> {
    abstract False(): T
    abstract True(): T
}

class BoolFactory extends BoolAlgebra<Id<boolean>> {
    False() { return new Id(false) }
    True() { return new Id(true) }
}
const boolFactory = new BoolFactory()
boolFactory.False().value //boolean
boolFactory.True().value //boolean

BoolAlgebra.empty(boolFactory)
boolFactory.empty()//.False() //FIXME: should be any type