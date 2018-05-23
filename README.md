# Multimethods in JavaScript

This is a project I created while learning about Clojure. Multimethods seem
pretty cool and I wanted implement them in JavaScript to learn more about them
& understand them better, i.e. Just For Fun.

## Features

### Basic

* [x] register (attach) methods
* [x] dispatch to methods

### More general stuff

* [ ] de-register (detach) methods
* [ ] default method
* [ ] replace methods (_hold on this 'til later; not currently clear it's a
  problem to just allow methods to be overwritten_)

### Dispatch heirarchy

* [ ] "derive" method ("is a" type hierarchy of dispatch types)
* [ ] method to pass a dispatch hierarchy in/replace one (for sharing)

### _Multiple dispatch!!_

* [ ] basic 2-item dispatch
* [ ] each item respects hierarchy

### Utility

* [x] get methods map
* [x] get dispatcher
* [ ] get dispatch hierarchy
