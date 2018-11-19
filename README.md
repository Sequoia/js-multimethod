# Multimethods in JavaScript

This is a project I created while learning about Clojure. Multimethods seem
pretty cool and I wanted implement them in JavaScript to learn more about them
& understand them better, i.e. Just For Fun.

## Features

### Basic

* [x] register (attach) methods
* [x] dispatch to methods

### More general stuff

* [X] ~~*de-register (detach) methods*~~ [2018-05-23]
* [X] ~~*default method*~~ [2018-05-23]

### Dispatch hierarchy

* [X] ~~*"derive" method ("is a" type hierarchy of dispatch types)*~~ [2018-06-19]
* [X] ~~*resolve a child type to a parent type for function dispatch*~~ [2018-06-19]

### _Multiple dispatch!!_

* [ ] basic 2-item dispatch
* [ ] each item respects hierarchy

### Utility

* [x] get methods map
* [x] get dispatcher
* [X] ~~*"handles" function to see if a call is handle-able (what to do if there's a default method?)*~~ [2018-06-19]

### "Phase II" 😏
* Underive
* method to pass a dispatch hierarchy in/replace one (for sharing) (_low priority_)
* get dispatch hierarchy
* replace methods (_hold on this 'til later; not currently clear it's a problem to just allow methods to be overwritten_)