# Integrating direnv

The last thing we'll add to improve our newly created development environment is
integration with [direnv]. This utility provides a critical feature in improving
the experience with Nix development shells. In short, `direnv` will
automatically evaluate (once explicitly allowed on a per-file basis) any
`.envrc` files found at the root of a directory (and by nature, all parent
directories).

What these `.envrc` files do is dependent on their contents. They can be as
basic or advanced as desired. In the case of Nix, one can use [nix-direnv] to
automatically enter into a Nix development shell. This is so incredibly common
across the Nix ecosystem that you'll almost always see `.envrc` files in
Nix-infused repositories.

The `std` framework provides some additional magic on top of the standard
`direnv` experience which will not only allow us to select which of our defined
development shells we want to enter automatically but also apply file watchers
to our definitions to automatically reload our environment when the files
change. To accomplish this, we'll add the following to a `.envrc` file at the
root of our repository:

```bash
#! /bin/sh
# This file is sourced by direnv when entering the directory. The content below
# is pulled from: https://divnix.github.io/std/guides/envrc.html

source "$(
    nix eval \
        --no-update-lock-file \
        --no-write-lock-file \
        --no-warn-dirty \
        --accept-flake-config \
        .#__std.direnv_lib 2>/dev/null
)"

# Here we can select which development environment is used by `direnv`. We only
# have one in this case, and we called it default.
# See: /nix/std-example/devshells.nix).
use std nix //example/devshells:default
```

With this, and `direnv` installed/configured, we can `cd` into our repository
root and be automatically dropped into our newly minted development shell:

```text
$ direnv allow
direnv: loading ~/code/nix/std-book-example/.envrc
direnv: using std nix //example/devshells:default
direnv: Watching: nix/example/devshells.nix

🔨 Welcome to example devshell 🔨

To autocomplete 'std' in bash, zsh, oil: source <(std _carapace)
More shells: https://rsteube.github.io/carapace/carapace/gen/hiddenSubcommand.html


[Testing]

  tests - run the unit tests

[general commands]

  menu  - prints this menu
  std   - A tui for projects that conform to Standard

direnv: export +DEVSHELL_DIR +NIXPKGS_PATH +PRJ_DATA_DIR +PRJ_ROOT ~PATH ~XDG_DATA_DIRS
```

As expected, `std` is available and we can even see our example `tests` command
in the menu. Let's give it a try:

```text
$ tests
Finished test [unoptimized + debuginfo] target(s) in 0.04s
     Running unittests src/main.rs (target/debug/deps/example-965805a32576c369)

running 1 test
test test_say_hello ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
```

[direnv]: https://direnv.net
[nix-direnv]: https://github.com/nix-community/nix-direnv
