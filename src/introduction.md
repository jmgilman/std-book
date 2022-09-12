# Introduction

The [`std`][std] (short for standard) framework is an opinionated [Nix]
[flakes][nix-flake] framework that aims to solve the problem of complexity that
often arises in large Nix-based projects. It's opinionated because it prescribes
a standard, flake-based structure for repositories using Nix. As with most
frameworks with this characteristic, it eliminates the question of **how** Nix
code should be organized, ultimately serving as a boon for productivity.

In this chapter, we will briefly introduce the framework as a whole. As a
reminder, this book will be starting off with an [example Rust project][prj-src]
and then slowly integrating the `std` framework into it. It's recommended you
clone the repository locally and follow along with the book for the best
learning experience.

The Rust project is intentionally barebones as it's not the primary focus of the
book. As a quick overview, the project produces a single binary that takes one
argument and uses it to print a string in the format of, `Hello, <arg>!`. It
contains a single unit test that confirms the above logic works as expected.

## Why std?

`std` aims to provide a rigid framework for organizing Nix code in a repository.
Why is this even necessary? The primary reason is that, because Nix can more or
less do anything, it follows that by nature, it tends to become progressively
less organized the more lines of it you add to your repository. While flakes
helped to bring some organization to the entry point of a Nix environment, it
also disrupted it in other ways (i.e., what to do with `system`). In the case of
a monorepo, this nature can quickly become crippling and can result in all sorts
of unique "frameworks" being developed by each team to address it.

For these reasons, `std` was developed to help reign in large Nix codebases.
However, it's not only for large projects. As we'll see in this article, it can
be used in projects of any size and naturally grows along with them. Indeed,
this is the preferred approach because it tackles the complexity before it has a
chance to grow too unwieldy.

## How std is Organized

The `std` framework is broken up into three organizational levels:

- **Repository**: This might seem like a given, but the repository serves as the
  highest level of organization within std. One could consider it an organism
  made up of one or more cells.
- **Cell**: The largest organizational unit, a cell typically encompasses a
  single component of a repository. In a monorepo, there could be one cell per
  service/binary in the repository. An entire cell could be dedicated to the
  automation within a repository for smaller projects.
- **Cell block**: A cell block is a subcomponent of a cell and serves to further
  subdivide a cell into smaller components. In particular, cell blocks are
  typed, meaning each falls within a category that defines the functionality the
  cell block provides. The meaning of this will become more apparent later on.

It's worth noting that cell blocks were previously referred to as organelles,
and cell block types were referred to as clades. These have recently changed to
ease adoption.

While the presence of cells and cell blocks helps to define an organizational
framework, at the same time, the ambiguity as to how cells should be organized
provides a necessary degree of flexibility. In this book, we'll give a sample
cell structure for our project, but the method proposed here is by no means the
best one for every project.

[nix]: https://nixos.org
[nix-flake]: https://nixos.wiki/wiki/Flakes
[prj-src]: https://github.com/jmgilman/std-book/tree/master/rust
[std]: https://github.com/divnix/std
