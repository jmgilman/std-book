{ inputs
, cell
}:
let
  inherit (inputs) nixpkgs std;
  l = nixpkgs.lib // builtins;
in
l.mapAttrs (_: std.std.lib.mkShell) {
  default = { ... }: {
    name = "std-book devshell";
    nixago = [ cell.configs.mdbook ];
    packages = [
      nixpkgs.mdbook
    ];
    commands = [
      {
        name = "preview";
        command = "mdbook serve";
        help = "Serves the docs at http://localhost:3000";
        category = "Docs";
      }
    ];
  };
}
