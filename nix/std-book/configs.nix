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
        language = "en";
        multilingual = false;
        title = "Documentation";
      };
    };
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
