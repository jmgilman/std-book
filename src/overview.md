![std logo](images/logo.png)

Welcome to the [`std`][std] book! This book is intended to serve as a companion
to the [documentation][std-docs]. The primary difference between the two is that
this book serves as a walk-through for configuring a `std` environment using an
example Rust project. At the end of this book, you'll have a completely
_`std`ized_ project utilizing all of the main benefits offered by the `std`
framework.

## How this book is organized

This book is broken up into several chapters. Each chapter tackles a big idea
from `std` while building on the work done in the previous chapters. As such,
the book is intended to be read from start to finish; however, each chapter is
written in a way that can still be useful as a quick reference.

Since `std` is a [Nix] framework and is intended to be used to organize code
repositories, it makes sense to work through applying it to an example project.
In this book, we're using a very basic Rust project, for which the source code
can be [found here][prj-src]. Before diving into the book, it's recommended that
you clone the repository locally:

```bash
git clone https://github.com/jmgilman/std-book/
cd std-book/rust  # <--- We'll be adding our nix files here
```

Throughout the book, we'll be building out an environment that uses the above
example project. The final source code for the completed example project can be
[found here][src].

## Assumptions

There are a few assumptions about the reader of this book:

1. The reader is already familiar with [Nix]. While all code snippets will be
   clearly explained, none of the explanations will be focused on language
   constructs.
2. The reader has experience working with [Nix flakes][nix-flakes].
3. The reader has general experience working within a code repository, including
   the common tasks and processes that occur within.

It's worth noting that you **do not** need experience with the [Rust
language][rust]. The usage of Rust is for example purposes only.

[nix]: https://nixos.org
[nix-flakes]: https://nixos.wiki/wiki/Flakes
[prj-src]: https://github.com/jmgilman/std-book/tree/master/rust
[rust]: https://www.rust-lang.org
[src]: https://github.com/jmgilman/std-book-example
[std]: https://github.com/divnix/std
[std-docs]: https://divnix.github.io/std/
