# Object Algebra

[![Build](https://github.com/mlhaufe/object-algebra/workflows/Build/badge.svg?branch=master)](https://github.com/mlhaufe/object-algebra/actions?query=workflow%3ABuild%2FRelease)
[![npm version](https://badge.fury.io/js/%40mlhaufe%2Fobject-algebra.svg)](https://www.npmjs.com/package/@mlhaufe/object-algebra)
[![Downloads](https://img.shields.io/npm/dm/@mlhaufe/object-algebra.svg)](https://www.npmjs.com/package/@mlhaufe/object-algebra)

Implementation of Object Algebras to enable [Feature-Oriented Programming (FOP)](https://en.wikipedia.org/wiki/Feature-oriented_programming).

## Installation

The latest version:

```powershell
npm install @mlhaufe/object-algebra
```

A specific version:

```powershell
npm install @mlhaufe/object-algebra@x.x.x
```

For direct use in a browser (no build step):

```html
<script type="importmap">
{
  "imports": {
    "@mlhaufe/object-algebra": "https://unpkg.com/@mlhaufe/object-algebra/index.mjs",
  }
}
</script>
<script type="module">
  import {Merge} from '@mlhaufe/object-algebra';

  console.log(typeof Merge); // 'function'
</script>
```

## Usage

Declare the Algebra:

```ts
interface PointAlg<T> extends Algebra {
    Point2(x: number, y: number): T
    Point3(x: number, y: number, z: number): T
}
```

Define Data:

```js
class PointData { }
class Point2 extends PointData {
    constructor(readonly x: number, readonly y: number) { super() }
}
class Point3 extends PointData {
    constructor(readonly x: number, readonly y: number, readonly z: number) { super() }
}
```

Define Factory for the data:

```js
class PointDataFactory implements PointAlg<PointData> {
    Point2(x: number, y: number) {
        return new Point2(x, y)
    }
    Point3(x: number, y: number, z: number) {
        return new Point3(x, y, z)
    }
}
```

Define a couple traits:

```js
interface IPrintable { print(): string }
class Printable implements PointAlg<IPrintable> {
    Point2(x: number, y: number): IPrintable {
        return {
            print() { return `(${x}, ${y})` }
        }
    }
    Point3(x: number, y: number, z: number): IPrintable {
        return {
            print() { return `(${x}, ${y}, ${z})` }
        }
    }
}

interface IAddable { add(other: PointData & IAddable): this }
class Addable implements PointAlg<IAddable & PointData> {
    Point2(x: number, y: number): IAddable & Point2 {
        const family = this
        return {
            add(other: Point2 & IAddable) { return family.Point2(x + other.x, y + other.y) }
        } as any
    }
    Point3(x: number, y: number, z: number): IAddable & Point3 {
        const family = this
        return {
            add(other: Point3 & IAddable) { return family.Point3(x + other.x, y + other.y, z + other.z) }
        } as any
    }
}
```

Compose the features into a single class:

```js
import {Merge} from '@mlhaufe/object-algebra';

class PointFactory extends Merge(PointDataFactory, Printable, Addable) { }

// Alternatively:
// const PointFactory = Merge(PointDataFactory, Printable, Addable)

const { Point2, Point3 } = new PointFactory()

const p1 = Point2(1, 2)
const p2 = Point2(3, 4)

console.log(p1.print()) // (1, 2)
console.log(p2.print()) // (3, 4)

console.log(p1.add(p2).print()) // '(4, 6)'
```

More examples are available in the [tests](./src/tests/) directory.

## Future Work

TypeScript does not support Higher Kinded Types ([#1213](<https://github.com/microsoft/TypeScript/issues/1213>)).
This means that the `Merge` function will not track or merge the generics types of the composed classes.
This is generally a problem for container types like `List`. You can see an example of in
[ListAlg.test.mts](./src/tests/ListAlg.test.mts) directory.

TypeScript also does not support associated types ([#17588](https://github.com/microsoft/TypeScript/issues/17588))
so an emulation of HKTs are also not possible via that feature (As [described](https://dl.acm.org/doi/pdf/10.1145/28697.28738) by Bertrand Meyer). Index types are close, but seem to be forgotten by the compiler.

There is [another approach](https://gcanti.github.io/fp-ts/modules/HKT.ts.html) to HKTs that does leverage indexed types to some limited success, but it adds an additional syntactic burden to the user which I find unacceptable.

## References and Further Reading

- [From Object Algebras to Finally Tagless Interpreters](https://oleksandrmanzyuk.wordpress.com/2014/06/18/from-object-algebras-to-finally-tagless-interpreters-2/)
- [Extensibility for the Masses. Practical Extensibility with Object Algebras](https://www.cs.utexas.edu/~wcook/Drafts/2012/ecoop2012.pdf)
- [Feature-Oriented Programming with Object Algebras](https://www.cs.utexas.edu/~wcook/Drafts/2012/FOPwOA.pdf)
