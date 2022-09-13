# The `std` TUI

There's one final thing we've gained from our work so far. The `std` framework
ships with a binary that adds a terminal user interface (TUI) to our project.
The quickest way to experiment with it is to enter a `nix-shell` with the
package installed:

```text
nix shell github:divnix/std
```

With the `std` binary now available, we can open the TUI with:

```text
std
```

For our example repository, we're met with:

![The std TUI](../images/tui.png)

What we're seeing here is a graphical view of our project. In this case, we have
a single binary located at `//example/apps/default` which can be run. How does
`std` know this? Recall that we informed `std` that we had `runnables` located
in `apps.nix`. When `std` analyzes our repository, it automatically found the
`runnable` for our example Rust project and is showing us what we can do with it
(i.e., run it).

This may seem trivial, but that's only because our repository is so small. The
usefulness of the TUI grows in proportion to the size of our project. As we add
more and more pieces to it, the TUI begins to become an entry point for
contributors to explore our repository.

In addition to the TUI, the `std` binary has a CLI counterpart that will show
the structure of the repository:

```text
$ std list
//example/apps/default:run    --    An example Rust binary which greets the user:  exec this target
```

If we wanted to run our binary, we'd use:

```text
std //example/apps/default:run
```
