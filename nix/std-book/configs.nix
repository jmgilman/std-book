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
        src = "docs";
        title = "Documentation";
      };
    };
  };
}
