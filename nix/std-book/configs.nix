{ inputs
, cell
}:
let
  inherit (inputs) nixpkgs std;
  l = nixpkgs.lib // builtins;
in
{
  cocogitto = std.std.lib.mkNixago {
    configData = {
      branch_whitelist = [ "master" ];
      changelog = {
        authors = [
          {
            username = "jmgilman";
            signature = "Joshua Gilman";
          }
          {
            username = "blaggacao";
            signature = "David Arnold";
          }
        ];
        path = "CHANGELOG.md";
        template = "remote";
        remote = "github.com";
        repository = "std-book";
        owner = "jmgilman";
      };
    };
    output = "cog.toml";
    format = "toml";
    commands = [{ package = nixpkgs.cocogitto; }];
  };
  conform = std.std.nixago.conform {
    configData = {
      commit = {
        header = { length = 89; };
        conventional = {
          types = [
            "build"
            "chore"
            "ci"
            "docs"
            "feat"
            "fix"
            "perf"
            "refactor"
            "style"
            "test"
          ];
        };
      };
    };
  };
  lefthook = std.std.nixago.lefthook {
    configData = {
      commit-msg = {
        commands = {
          conform = {
            run = "${nixpkgs.conform}/bin/conform enforce --commit-msg-file {1}";
          };
        };
      };
      pre-commit = {
        commands = {
          treefmt = {
            run = "${nixpkgs.treefmt}/bin/treefmt {staged_files}";
          };
        };
      };
    };
  };
  mdbook = std.std.nixago.mdbook {
    configData = {
      book = {
        title = "The Standard Book";
        authors = [ "Joshua Gilman" ];
        description = "The official book for the `std` framework.";
        language = "en";
      };
      output.html = {
        additional-js = [ "theme/mermaid.min.js" "theme/mermaid-init.js" ];
        git-repository-url = "https://github.com/jmgilman/std-book";
        edit-url-template = "https://github.com/jmgilman/std-book/edit/master/{path}";
      };
      preprocessor.mermaid = {
        command = "mdbook-mermaid";
      };
    };
    packages = [ nixpkgs.mdbook-mermaid ];
  };
  prettier = std.std.lib.mkNixago
    {
      configData = {
        printWidth = 80;
        proseWrap = "always";
      };
      output = ".prettierrc";
      format = "json";
      commands = [{ package = nixpkgs.nodePackages.prettier; }];
    };
  treefmt = std.std.nixago.treefmt
    {
      configData = {
        formatter = {
          nix = {
            command = "nixpkgs-fmt";
            includes = [ "*.nix" ];
          };
          prettier = {
            command = "prettier";
            options = [ "--write" ];
            includes = [
              "*.md"
            ];
          };
          rustfmt = {
            command = "rustfmt";
            options = [ "--edition" "2021" ];
            includes = [ "*.rs" ];
          };
        };
      };
    };
}
