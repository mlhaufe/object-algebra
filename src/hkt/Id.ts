import App from "./App"

/**
 * Represents type expressions without Type Constructor Polymorphism
 * 
 * Example:
 * 
 * List<number> is represented as Id<List<number>>
 */
class Id<T> implements App<'Id',T> {
    constructor(readonly value: T){}
    /**
     * Downcasts App<'Id',A> => Id<A>
     * 
     * Provided that the tags are unique per class, this is a safe downcast
     * 
     */
    static prj<A>(app: App<'Id',A>): Id<A> { return <Id<A>>app }
}

export default Id