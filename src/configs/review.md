# Review

Many of the improvements we have gained in this chapter have come from the tools
we've now employed to improve our overall development experience; however, don't
miss how easy it was to automatically have these tools:

1. Dynamically configured using Nix
2. Configuration files automatically managed by Nixago.
3. Binaries automatically included in the shell environment

The integration between `std`, Nixago, and `devshell` has afforded us a great
degree of flexibility for bringing in and configuring tools that will help
improve our experience. The organizational model provided by `std` serves as the
glue that binds these all together and allows our repository to continue to add
useful tools without the risk of becoming too hard to maintain or reproduce.
