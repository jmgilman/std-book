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
    nixago = [
      cell.configs.mdbook
      cell.configs.mdformat
    ];
    packages = [
      nixpkgs.mdbook
    ];
    commands = [
      {
        name = "serve";
        command = "mdbook serve";
        help = "Serves the docs at http://localhost:3000";
        category = "Development";
      }
      {
        name = "fmt";
        command = "mdformat src";
        help = "Formats the book's markdown files";
        category = "Development";
      }
    ];
  };
}
