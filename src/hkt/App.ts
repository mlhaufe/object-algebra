/**
 * Represents a Polymorphic Type Constructor
 * C<T> is represented as App<c,T> where c is a *unique* tag representing
 * the type C such as a string literal type
 */
interface App<C,T>{}

export default App