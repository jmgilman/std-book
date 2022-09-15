# The Standard Book

![logo](./src/images/logo.png)

This repository contains source code for The Standard Book. You can see the
live version of the book [here][live]. This is a living book and is subject to
change over time as the [std] project grows.

This book works through applying the `std` project to an example Rust project.
The source code for the example Rust project can be found in this repository
[here][rust]. The finished source code for the project is located in a separate
repository and can be found [here][final].

## Building

This book has been created with [mdbook]. Building it requires [Nix] to be
installed locally:

```text
nix build
```

The rendered book will be placed in the `./book` directory.

## Contributing

Contributions are welcome. Before contributing, please ensure Nix is installed
and enter the local development shell provided by either using `direnv` or
the Nix CLI:

```text
nix develop
```

Once the environment is activated, make your changes and then open up a PR for
review.

[final]: https://github.com/jmgilman/std-book-example
[live]: https://jmgilman.github.io/std-book/
[mdbook]: https://github.com/rust-lang/mdBook
[nix]: https://nixos.org
[rust]: https://github.com/jmgilman/std-book/tree/master/rust
[std]: https://github.com/divnix/std
