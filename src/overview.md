# Overview

Welcome to the [`std`][std] book! This book is intended to serve as a companion
to the [`std` documentation][std-docs]. The primary difference between the two
is that this book serves as a walk-through of configuring a `std` environment
using an example Rust project. At the end of this book, you'll have a completely
`std`ized project utilizing all of the main benefits offered by the `std`
framework.

## How this book is organized

This book is broken up into several chapters. Each chapter tackles a component
of `std`, building on the work done in the previous chapters. As such, the book
is intended to be read from start to finish; however, each chapter is written in
a way that can still be useful as a quick reference.

Since `std` is a [Nix] framework intended to be used to organize code
repositories, it makes sense to work through applying it to an example project.
In this book, we're using a very basic Rust project, for which the source code
can be [found here][prj-src].

Throughout the book, we'll be building out a `std` environment which uses the
above example project. The final source code for the completed example project
can be [found here][src].

[nix]: https://nixos.org
[prj-src]: https://github.com/jmgilman/std-book/tree/master/rust
[src]: https://github.com/jmgilman/std-book-example
[std]: https://github.com/divnix/std
[std-docs]: https://divnix.github.io/std/
