# Adding the Devshell Block

As we begin iterating on our project, we'll come across this common theme: to
add new functionality to our project, simply add new cell blocks. In the case of
`devshell`, this remains true: to begin, we'll add a new block to our
`flake.nix`:

```nix
{
  inputs.std.url = "github:divnix/std";
  inputs.nixpkgs.url = "nixpkgs";
  inputs.rust-overlay.url = "github:oxalica/rust-overlay";

  outputs = { std, ... } @ inputs:
    std.growOn
      {
        inherit inputs;
        cellsFrom = ./nix;
        cellBlocks = [
          (std.blockTypes.runnables "apps")

          # The `devshell` type will allow us to have "development shells"
          # available. These are managed by `numtide/devshell`.
          # See: https://github.com/numtide/devshell
          (std.blockTypes.devshells "devshells")

          # The `function` type is a generic block type that allows us to define
          # some common Nix code that can be used in other cells. In this case,
          # we're defining a toolchain cell block that will contain derivations
          # for the Rust toolchain.
          (std.blockTypes.functions "toolchain")
        ];
      }
      {
        packages = std.harvest inputs.self [ "example" "apps" ];

        # We want to export our development shells so that the following works
        # as expected:
        #
        # > nix develop
        #
        # Or, we can put the following in a .envrc:
        #
        # use flake
        devShells = std.harvest inputs.self [ "example" "devshells" ];
      };
}
```

The first thing to notice is we've added a new input for the [rust-overlay]
flake. This flake provides an `overlay` attribute that we can overlay on top of
`nixpkgs` to enable fetching specific versions of the [Rust
toolchain][rust-toolchain]. We'll use this below in our `toolchain` cell block
to make fetching the latest version of the toolchain trivial.

We've added two new cell blocks above: one of the `devshells` type and the other
of the `functions` type. Our development shells will be defined in
`/nix/example/devshells.nix` and our toolchain will be defined in
`/nix/example/toolchain.nix`. The `devshells` type should be self-explanatory at
this point: this is where we will define the development shells available in our
project. The `functions` type is a bit unique and serves as a general type for
storing cell-specific Nix expressions. In this case, we're creating a
_toolchain_ cell block that will contain a Nix expression that evaluates to the
latest version of the Rust toolchain.

In addition to adding the above two cell blocks, we've also expanded the second
argument to our `growOn` function so that the development shells we define are
available under the `devShells` flake output. This provides compatibility with
the Nix CLI and anyone using `nix flake show` to inspect the repository.

## Defining our Devshell

We're going to define a single development shell in
`/nix/example/devshells.nix`:

```nix
# Just like we place buildables in `apps.nix`, it's standard to place our
# development shells in a `devshells.nix` cell block.
#
# This cell block is used to define the development shells that are available to
# consumers of our repository. If you're not familiar with the idea of a
# development shell, it's essentially a self-contained environment that can be
# configured to provide all the tools and dependencies needed to work on our
# project. It solves the vital problem of, "works on my machine."
{ inputs
, cell
}:
let
  inherit (inputs) nixpkgs std;
  l = nixpkgs.lib // builtins;
in
# Here we map an attribute set to the `std.std.lib.mkShell` function.
  # This is a small wrapper around the numtide/devshell `mkShell` function and
  # provides integration with `nixago`, which we'll see in a later part. The
  # result of this map is a attribute set where the value is a proper
  # development shell derivation.
l.mapAttrs (_: std.std.lib.mkShell) {
  # This is our only development shell, so we name it "default". The
  # numtide/devshell `mkShell` function uses modules, so the `{ ... }` here is
  # simply boilerplate.
  default = { ... }: {
    # The structure of this attribute set is defined here:
    # https://github.com/numtide/devshell/tree/master/modules
    #
    # Familiarity with the devshell system is likely valuable here, but it's
    # intuitive enough to understand without it.

    # This is the name of our development shell. When a user enters the shell,
    # a MOTD style heading is printed to stdout with this name.
    name = "example devshell";

    # Since we're using modules here, we can import other modules into our
    # final configuration. In this case, we import the `std` default development
    # shell profile which will, among other things, automatically include the
    # `std` TUI in our environment.
    imports = [ std.std.devshellProfiles.default ];

    # This is a list of packages that will be available in our development
    # environment. In this case, we're pulling in the rust toolchain from our
    # `toolchains` cell block.
    #
    # Notice the magic here. We can extrapolate the rust toolchain to a separate
    # cell block and then access it from `cell.toolchain`. This is a direct
    # benefit from standardizing our project!
    packages = [
      cell.toolchain.rust.stable.latest.default
    ];

    # This is a list of "commands" that will be available inside our development
    # environment. One of the features of numtide/devshell is that it provides
    # a `menu` command that will list all of the commands we define below. This
    # allows consumers to easily understand what development tasks are available
    # to them from the CLI. For example, running `tests` in side of our shell
    # will in turn call `cargo test` for us.
    commands = [
      {
        name = "tests";
        command = "cargo test";
        help = "run the unit tests";
        category = "Testing";
      }
    ];
  };
}
```

There appears to be a lot going on here, but it's fairly straightforward to
follow. First of all, we have our typical cell block structure at the top of the
file with the `inputs` and `cell` arguments. We do some simple setup in the
`let` statement and then we perform a map, utilizing `std.std.lib.mkShell` as
the function. The [mkShell] function offered by `std` is a wrapper around the
[mkShell][mkshell-2] function provided by `devshell`. The primary benefit of
using the wrapper will be revealed in a future chapter, but for now, it's simple
enough to understand that it does the work of making the development shell
derivation that is consumed by Nix.

The `mkShell` function accepts a single parameter, a [module
function][module-function]. In this case, we don't need access to any of the
standard module arguments, so we can compress them with ellipses.

The available options for the module are [defined here][devshell-module]. The
most common options are discussed below:

- `name`: The name of the development shell. Appears in the MOTD.
- `packages`: A list of Nix packages that should be made available in the
  development shell.
- `commands`: A list of custom commands that should be made available in the
  development shell. The suboptions can be [found here][command-options].

In the example above, we define a single development shell (`default`), give it
a name, add the Rust toolchain from our `toolchain` cell block (discussed
below), and provide a single custom command which runs our unit tests using
`cargo`.

It's worth noticing the utility of this expression:

```nix
{
    # ...
    packages = [
      cell.toolchain.rust.stable.latest.default
    ];
    # ...
}
```

As mentioned in chapter 1, the `cell` argument allows us to access all the cell
blocks available within our local cell. In this case, we utilize it to access
the `toolchain` cell block to bring our Rust toolchain expression into the scope
of the development shell. This is a neat trick that `std` allows us to do!

The remaining `imports` attribute is a Nix module [feature][module-imports] that
allows importing additional modules into our final configuration. Here we import
a development shell profile from the `std` library which provides us with the
following:

- Includes the `std` binary into our development environment for us
- Provides a customized MOTD specific to `std`

This isn't strictly necessary, and can certainly be omitted.

## Defining our Toolchain

The last piece we're missing is defining our toolchain cell block. We'll do this
in `/nix/example/toolchain.nix`:

```nix
# This cell block is less idiomatic and is geared towards customizing our
# standardized environment by making an overlayed version of the rust toolchain
# available to our cell. This is the benefit of having some flexibility with how
# we organize our cells and cell blocks.
{ inputs
, cell
}:
{
  # `std` does not support global overlays, so we use `nixpkgs.extend` to make
  # a local overlay.
  # See: https://github.com/divnix/std/issues/117
  rust = (inputs.nixpkgs.extend inputs.rust-overlay.overlays.default).rust-bin;
}
```

A theme should start appearing now with the structure of cell blocks. In this
case, we're given a little freedom with the structure of what it produces. The
goal is to create an expression that evaluates to the latest stable version of
the Rust toolchain using the `rust-overlay` flake we imported in our
`flake.nix`.

As the comments make note of, `std` discourages applying overlays globally and
instead recommends defining a local instance of `nixpkgs` and using the `extend`
function to apply overlays. This is exactly what we do here, with the result
being we can access the Rust toolchain via `rust.stable.latest.default`.

[command-options]:
  https://github.com/numtide/devshell/blob/master/modules/commands.nix
[devshell-module]: https://github.com/numtide/devshell/tree/master/modules
[mkshell]: https://github.com/divnix/std/blob/main/cells/std/lib/default.nix#L10
[mkshell-2]: https://github.com/numtide/devshell/blob/master/default.nix#L71
[module-function]: https://nixos.wiki/wiki/NixOS_modules#Function
[module-imports]: https://nixos.wiki/wiki/NixOS_modules#Imports
[rust-overlay]: https://github.com/oxalica/rust-overlay
[rust-toolchain]: https://rust-lang.github.io/rustup/concepts/toolchains.html
