import App from "./hkt/App"
import Id from "./hkt/Id"
import Lifter from "./Lifter"
import LiftDecorate from "./LiftDecorate"

function _fnEmpty(){ return Object.create(null) }

abstract class Algebra<F> implements App<'Algebra',F> {
    static prj<A>(app: App<'Algebra',A>): Algebra<A> { return <Algebra<A>>app };

    [Variant: string]: <T>(...args: any[]) => App<F,T>

    merge<A,B>(lifter: Lifter<A,B>, a: App<F,A>, b: App<F,B>): App<F, A & B> {
        var merged = Object.create(null)
        Object.keys(this)
        .forEach(key => {
            if(key == 'merge' || key == 'empty' || key == 'decorate') {
                merged[key] == this[key]
            } else {
                Object.defineProperty(merged,key,{
                    enumerable:true,
                    value:function(){
                        return lifter.lift(
                            (<{[V:string]:Function}>a)[key].apply(a,arguments),
                            (<{[V:string]:Function}>b)[key].apply(b,arguments)
                        )
                    }
                })
            }
        });
        //TODO
        return merged
    }
    empty(): App<F,any> {
        var emptyAlg = Object.create(null)
        Object.keys(this)
            .forEach(key => {
                if(key == 'merge' || key == 'empty' || key == 'decorate') {
                    emptyAlg[key] == this[key]
                } else {
                    Object.defineProperty(emptyAlg,key,{enumerable:true,value:_fnEmpty})
                }
            });
        return emptyAlg
    }
    decorate<A>(parent: App<F,A>, action: (a:A) => A): App<F, A> {
        return this.merge(new LiftDecorate(action),parent,this.empty())
    }
}

////////////////////

abstract class BoolAlgebra<V> extends Algebra<V> {
    abstract False(): V
    abstract True(): V
}

class BoolFactory extends BoolAlgebra<boolean> {
    False(): boolean { return false }
    True(): boolean { return true }
}
const boolFactory = new BoolFactory()

boolFactory.empty()

interface IPrintable{ print(): string }
class IPrintable extends BoolAlgebra<IPrintable> {
    False(): IPrintable { return {print: () => 'false' } }
    True(): IPrintable { return {print: () => 'true' } }
}

export default Algebra