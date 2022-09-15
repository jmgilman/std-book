# Managing Development Shells (devshells)

In the remaining chapters of this book, we're going to begin improving the
foundation we laid in the previous chapter. We've already gained a lot by
integrating `std` into our example Rust project, but there remains significant
room for improvement.

So far, we've seen that `std` has a lot to offer in terms of bringing
organization to our Nix-infused repositories. In addition to organization, `std`
also brings with it many quality-of-life improvements. We're going to
investigate the first one in this chapter: development shells.

## Works on My Machine

At the risk of beating a dead horse, this section will be a brief review of why
development shells are needed and the benefits they provide to almost any
project. Perhaps the most iconic words used to address this issue are:

> Works on my machine!

Indeed, this single line has led to a plethora of innovations to address the
lack of reproducibility that has defined the last decade of software. Many
technologies have risen to tackle the issue, but Nix stands as one of the oldest
technologies aimed specifically at tackling this problem.

The main solution Nix employs to tackle reproducible development environments is
[nix-shell]. We used this command in the last chapter to quickly enter a shell
environment that had the `std` binary available. This command has further been
refined by receiving support in the official [flake schema][flake-schema]. With
flakes, it's now possible to define an entire reproducible _development shell_
which will include all necessary tools to work on a given project. The idea is
simple: if you want to contribute to a project, load up the development shell
and start making changes. The net result is a dramatic reduction in
system-dependent problems and a smoother contribution experience for a project.

## Devshell

The wonderful individuals at [numtide] have taken the idea of development shells
and accelerated productivity even further. The [numtide/devshell] project builds
upon flake-based development shells by adding several quality-of-life features
that further improve upon a developer's experience. These can be roughly
summarized as follows:

- MOTD: A custom message of the day can be configured that appears when a user
  first enters the development shell. This can be useful for introducing users
  to a project and giving some basic instructions for getting started with
  contributions.
- Custom commands: Repository-specific commands can be configured to bring
  uniformity to contributors. For example, a `fmt` command can be defined which
  runs the formatter(s) the same way they may be run in CI.
- Menu: A repository-specific menu can be created that is accessed by running
  `menu` from the command-line. The contents of this menu are customizable and
  can include custom commands or other binaries that are available in the
  environment.
- Package management: package management is made significantly easier by
  allowing packages to be specified in several different locations. For example,
  a custom command could be dependent on a package being available in the
  environment and `devshell` will handle the dependency for you automatically.

The `std` framework provides native support for integrating `devshell` into our
standardized project. All that's required is a little bit of configuration on
our end and we'll be able to provide a rich development shell for contributors
to use with our example Rust project.

[flake-schema]: https://nixos.wiki/wiki/Flakes#Flake_schema
[nix-shell]: https://nixos.org/manual/nix/stable/command-ref/nix-shell.html
[numtide]: https://numtide.com
[numtide/devshell]: https://github.com/numtide/devshell
