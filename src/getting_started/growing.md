# Growing

It's important to take a small detour at this point and explore the
`std.grow`/`std.growOn` functions in detail. In particular, it helps to inspect
the output of our flake to better understand what it is that these `grow`
functions are generating.

If we refer back to [our flake](flake.md#our-std-flake), we will recall that we
used the `growOn` function for generating the flake output. Let's assume for a
second that we instead chose to use the `std.grow` function. If we were to
inspect our flake output at this point, we would see something similar to this:

```text
$ nix flake show
git+file:///Users/josh/code/std-book-example
├───__std: unknown
├───aarch64-darwin: unknown
├───aarch64-linux: unknown
├───x86_64-darwin: unknown
└───x86_64-linux: unknown
```

This looks strange at first; what is under `__std`? This attribute is generated
by the grow functions and is referred to as the _registry_. It houses a plethora
of information about our standardized environment, and you can inspect what's
under here by running:

```text
nix eval --json .#__std | jq
```

The output is large, so it will be omitted here, but essentially it describes
our entire environment, including what cells we have, the blocks (and their
types) of those cells, what actions we can run on the blocks, etc. The benefit
here is that it provides a layer by which external tools can utilize the
information gathered about our environment.

What about all the unknowns? There is data here, but it's important to
understand that it doesn't conform to the expected flake output schema, so
`nix flake show` just marks it as "unknown." Again, we can see the structure by
going into the Nix REPL environment:

```text
$ nix repl
Welcome to Nix 2.10.3. Type :? for help.

nix-repl> :lf .
Added 18 variables.

nix-repl> :p aarch64-darwin
{ std-example = { apps = { default = «derivation /nix/store/rb7jvsds8wxcrxzfz8cc7jpgqsxch8w1-std-example-0.1.0.drv»; }; }; }
```

In other words, we could run our binary using:

```text
$ nix run .#aarch64-darwin.std-example.apps.default world
Hello, world!
```

However, this isn't very intuitive, and this is why the `growOn` function
becomes helpful. It allows us to add a compatibility layer by transforming the
above structure into something that the Nix CLI can more easily understand. In
our case, if we run the same `nix flake show` command with the `growOn`
function, we see:

```text
$ nix flake show
git+file:///Users/josh/code/std-book-example
├───__functor: unknown
├───__std: unknown
├───aarch64-darwin: unknown
├───aarch64-linux: unknown
├───packages
│   ├───aarch64-darwin
│   │   └───default: package 'example-0.1.0'
│   ├───aarch64-linux
│   │   └───default: package 'example-0.1.0'
│   ├───x86_64-darwin
│   │   └───default: package 'example-0.1.0'
│   └───x86_64-linux
│       └───default: package 'example-0.1.0'
├───x86_64-darwin: unknown
└───x86_64-linux: unknown
```

This now allows us to run our binary using:

```text
$ nix run .#default world
Hello, world!
```
