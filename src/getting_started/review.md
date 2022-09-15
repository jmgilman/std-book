# Review

Before we continue into more advanced subjects, let's stop for a moment and
review. What have we gained here? First of all, we have standardized where our
binary builds are defined for our repository: `/nix/example/apps.nix`. If we
want to add additional builds (i.e., a debug binary), we know exactly where to
put it. As a bonus, we don't even need to worry about the system fiasco that
flakes are often criticized for.

Secondly, we have standardized what most of our Nix code "looks" like. The
`{inputs, cell}` format is deceptively powerful. One of the most significant
sources of complexity in large Nix codebases stems from the question, "How do I
access everything?" In our case:

- Inputs can be accessed via `inputs`
- Anything within our local cell can be accessed via `cell`
- Other cells can be accessed via `inputs.cells`

Meaning that as long as we adhere to the organizational principles being applied
with `std`, we don't have to worry about figuring out where to put things and
how to access them.
