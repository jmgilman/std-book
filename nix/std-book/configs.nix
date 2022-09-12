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
  mdformat = std.std.lib.mkNixago
    {
      configData = {
        wrap = 80;
      };
      output = ".mdformat.toml";
      format = "toml";
      commands = [{ package = nixpkgs.python310Packages.mdformat; }];
    };
}
