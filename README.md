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

Define Data:

```js
class ExpData { }
class Lit extends ExpData {
    constructor(value) {
        super()
        this.value = value
    }
}
class Add extends ExpData {
    constructor(left, right) {
        super()
        this.left = left
        this.right = right
    }
}
```

Define Factory for the data:

```js
class ExpFactory {
    Lit(value) {
        return new Lit(value)
    }
    Add(left, right) {
        return new Add(left, right)
    }
}
```

Define a couple traits:

```js
class Printable {
    Lit(value) {
        return {
            print() { return `${value}` }
        }
    }
    Add(left, right) {
        return {
            print() { return `${left.print()} + ${right.print()}` }
        }
    }
}

class Evaluable {
    Lit(value) {
        return {
            evaluate() { return value }
        }
    }
    Add(left, right) {
        return {
            evaluate() { return left.evaluate() + right.evaluate() }
        }
    }
}
```

Compose the features into a single class:

```js
import {Merge} from '@mlhaufe/object-algebra';

class Exp extends Merge(ExpFactory, Printable, Evaluable) { }

const exp = new Exp()

const expr = exp.Add(exp.Lit(1), exp.Lit(2))

console.log(expr.print()) // 1 + 2
console.log(expr.evaluate()) // 3
```

More examples are available in the [tests](./src/tests/) directory.

## References and Further Reading

- [From Object Algebras to Finally Tagless Interpreters](https://oleksandrmanzyuk.wordpress.com/2014/06/18/from-object-algebras-to-finally-tagless-interpreters-2/)
- [Extensibility for the Masses. Practical Extensibility with Object Algebras](https://www.cs.utexas.edu/~wcook/Drafts/2012/ecoop2012.pdf)
- [Feature-Oriented Programming with Object Algebras](https://www.cs.utexas.edu/~wcook/Drafts/2012/FOPwOA.pdf)
