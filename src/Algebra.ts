import App from "./hkt/App"
import Lifter from "./Lifter"
import LiftDecorate from "./LiftDecorate"

/**
 * An Object Algebra consists of a set of related methods (a Family) that return
 * an instance of the provided Generic Type parameter. 
 * 
 * By convention, Constructors are denoted with PascalCase and operations
 * are denoted with camelCase
 * 
 * The Type Constructor Polymorphism workaround is included. 
 * Instead of every method returning the generic parameter C, instead the
 * super-type is returned: App<C,T>
 */

abstract class Algebra<C> {
    static empty<C,T>(algebra: App<C,T>): App<C,any> {
        var emptyAlg = Object.create(null)
        Object.getOwnPropertyNames(Object.getPrototypeOf(algebra))
            .filter(name => name != 'constructor')
            .forEach(name => {
                Object.defineProperty(emptyAlg, name, {
                    enumerable: true,
                    value: () => Object.create(null)
                })
            })
        return emptyAlg
    }
/*
    merge<A,B>(lifter: Lifter<A,B>, a: F<A>, b: F<B>): F<A & B> {
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

        return merged
    }
    decorate<A>(parent: F<A>, action: (a:A) => A): F<A> {
        return this.merge(new LiftDecorate(action),parent,this.empty())
    } */
}

export default Algebra