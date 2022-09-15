# The Standard Book

![logo](./src/images/logo.png)

This repository contains source code for The Standard Book. You can see the
live version of the book [here][live]. This is a living book and is subject to
change over time as the [std] project grows.

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

[live]: https://jmgilman.github.io/std-book/
[mdbook]: https://github.com/rust-lang/mdBook
[nix]: https://nixos.org
[std]: https://github.com/divnix/std
