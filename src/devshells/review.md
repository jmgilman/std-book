# Review

Let's take stock of what we've been afforded with these changes.

- We took advantage of `std`'s integration with `numtide/devshell` and added a
  default development shell to our repository
- We created a nice MOTD for our repository, welcoming contributors and making
  them aware of `std` and our custom commands
- We added a custom command for running our tests with `cargo`
- We provided contributors with the latest version of the Rust toolchain

Finally, to wrap things with a bow, we integrated `direnv` to automagically load
us into our new development shell when we `cd` into our repository root. This is
no small feat! The best part is we stayed within `std` the whole time and yet
were still afforded all of these quality-of-life improvements.

The organizational structure provided by `std` is a huge boon to productivity,
but so are the quality-of-life improvements. Contributing to our humble example
project just became much easier with development shells, and we'll continue this
theme of improvement in the next chapter.
