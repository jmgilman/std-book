# Managing Configurations

In the last chapter, we saw how the integration that `std` has with
`numtide/devshell` allows us to easily integrate feature-rich development
environments into our repository. These allow contributors to quickly get up to
speed with the tools that are required to contribute to our repository and
provide a lot towards solving the "works on my machine" problem.

In this chapter, we're going to look at another integration that `std` has, this
time with [Nixago].

## An Introduction to Nixago

Modern repositories rely on a lot of modern tools for providing things like
linting, auditing, formatting, compiling, releasing, and the list goes on.
Sometimes one tool can tackle multiple tasks, but for the most part we often end
up needing several to cover the whole spectrum. To make matters worse, many of
these tools bring with them their own configuration with little room for
interoperability between them.

Nixago was designed to address this problem by doing two things:

1. Bringing configuration definitions back into Nix
2. Dynamically generating configuration files

### Managing Configurations with Nix

The first benefit that Nixago brings is it allows us to generate our
configuration files using pure Nix code. This allows us to do many interesting
things, especially when our entire repository is already wired up by Nix using
`std`.

For example, we can apply convenient transformations to data structures or bring
in data from other parts of the repository to inform how a specific tool should
be configured. For example, the `std` [integration][conform-integration] for
[conform] automatically informs the conventional commit policie of the cell
names to use as subjects. This is just one example of many possibilities that
can be put together using `std`'s Nixago integration.

### Dynamic Generation

The second benefit that Nixago brings is that configuration files are
dynamically generated. When a user first enters into a development shell that
has been configured with Nixago support, it will automatically run its
pre-generated shell hooks which will generate the required configuration files
and write them to the repository directory. Most times, these files are simply
symlinks that point back to the Nix store (and automatically added to
`.gitignore`). However, an option can be specified which switches these to hard
copies which can then be committed into revision control (to support CI for
example).

## Integration

The `std` framework makes it easy to integrate Nixago into our repository. It
provides a [cell block type][nixago-block] which provides direct integration
with the devshell cell block. This is required, because Nixago relies on shell
hooks to generate files, and the devshell integration will ensure the hooks are
run when we enter the environment.

In the remainder of this chapter, we'll work on setting up the Nixago
integration to configure a few common tools that will prove useful to our
development.

[conform]: https://github.com/siderolabs/conform
[conform-integration]:
  https://github.com/divnix/std/blob/main/cells/std/nixago/conform.nix
[nixago]: https://github.com/nix-community/nixago
[nixago-block]:
  https://github.com/divnix/std/blob/main/src/blocktypes/nixago.nix
