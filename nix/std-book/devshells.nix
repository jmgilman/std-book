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
      cell.configs.cocogitto
      cell.configs.conform
      cell.configs.lefthook
      cell.configs.mdbook
      cell.configs.prettier
      cell.configs.treefmt
    ];
    packages = [
      nixpkgs.gh
      nixpkgs.jq
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
        command = "treefmt src";
        help = "Formats the book's markdown files";
        category = "Development";
      }
    ];
  };
}
