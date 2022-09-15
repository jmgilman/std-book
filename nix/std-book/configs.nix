{ inputs
, cell
}:
let
  inherit (inputs) nixpkgs std;
  l = nixpkgs.lib // builtins;
in
{
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
        };
      };
    };
}
