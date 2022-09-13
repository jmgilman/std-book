# Our First Cell Block

The flake, by itself, is not sufficient for a working example. We've told `std`
that our cells have `runnable` blocks, yet we've neither created the cell nor
defined any blocks.

To resolve this, we'll create a new file: `./nix/example/apps.nix`.

- `./nix/`: Defined in our `cellsFrom` argument in the `flake.nix`
- `./example/`: The name of our cell.
- `apps.nix`: The name of our cell block.

Hopefully, the `std` structure is starting to become natural now. Here are the
contents of our file:

```nix
# A common `std` idiom is to place all buildables for a cell in a `apps.nix`
# cell block. This is not required, and you can name this cell block anything
# that makes sense for your project.
#
# This cell block is used to define how our example application is built.
# Ultimately, this means it produces a nix derivation that, when evalulated,
# produces our binary.

# The function arguments shown here are universal to all cell blocks. We are
# provided with the inputs from our flake and a `cell` attribute which refers
# to the parent cell this block falls under. Note that the inputs are
# "desystematized" and are not in the same format as the `inputs` attribute in
# the flake. This is a key benefit afforded by `std`.
{ inputs
, cell
}:
let
  # The `inputs` attribute allows us to access all of our flake inputs.
  inherit (inputs) nixpkgs std;

  # This is a common idiom for combining lib with builtins.
  l = nixpkgs.lib // builtins;
in
{
  # We can think of this attribute set as what would normally be contained under
  # `outputs.packages` in our flake.nix. In this case, we're defining a default
  # package which contains a derivation for building our binary.
  default = with inputs.nixpkgs; rustPlatform.buildRustPackage {
    pname = "example";
    version = "0.1.0";

    # `std` includes some useful helper functions, one of which is `incl` which
    # handles filtering out unwanteed files from our package src. The benefit
    # here is it reduces unecessary builds by limiting the input files of our
    # derivation to only those that are needed to build it.
    src = std.incl (inputs.self) [
      (inputs.self + /Cargo.toml)
      (inputs.self + /Cargo.lock)
      (inputs.self + /src)
    ];
    cargoLock = {
      lockFile = inputs.self + "/Cargo.lock";
    };

    meta = {
      description = "An example Rust binary which greets the user";
    };
  };
}
```

## Standardized Arguments

One of the major benefits of `std` can be seen in the first few lines of Nix
code. As is fairly typical with Nix, the file serves as one large function;
however, the significance of the argument structure can be easily overlooked,
though. This structure can be viewed as the _standardized_ form of all cell
blocks. From these two arguments, it's possible to derive _all_ values required
to perform our required logic.

Again, this cannot be overstated: we define the arguments the same way each time
and are guaranteed access to all of the tools and data required to perform our
logic. Historically, passing around information in Nix has been a major pain
point. The further down the rabbit hole we go, the more difficult it is to bring
the required information to perform the tasks at the bottom. We can visualize
the benefit `std` brings here with a small table:

| type      | `inputs`             | `cell`           | `inputs.cells`             |
| --------- | -------------------- | ---------------- | -------------------------- |
| packages  | `inputs.nixpkgs`     | `cell.runnables` | `inputs.cells.*.runnable`  |
| functions | `inputs.nixpkgs.lib` | `cell.functions` | `inputs.cells.*.functions` |
| ...       | `inputs.*`           | `cell.*`         | `inputs.cells.*.*`         |

With this structure, we can access all of our flake inputs (including
`nixpkgs`), all local cell blocks, and even cell blocks from sibling cells. No
matter how large our project grows, the same pattern for traversing it will be
maintained.

## Standardized Package Definitions

The remainder of the file should look familiar to those attuned to Nix. It's
nothing more than an attribute set where the name is a package name and the
value is a derivation. This section, of course, benefits from our standardized
arguments because we can easily access everything we need to build a proper
derivation for our Rust binary.

In addition to the above, `std` also ships with some useful helper functions for
performing standard Nix operations. In our example, we utilize `std.include` to
filter out the source files for our project. Since derivations are hashed based
on their inputs, limiting inputs is the best practice to maximize cache usage
and avoid the unnecessary rebuilding of our binary.
