/**
 * Represents a Polymorphic Type Constructor
 * 
 * Example:
 * 
 *   C<T> is represented as App<t,T> where t is a unique tag representing the type C
 * 
 * See the following for more details: {http://cgi.di.uoa.gr/~biboudis/streamalg.pdf#section.4}
 */
interface App<C,T>{}

export default App