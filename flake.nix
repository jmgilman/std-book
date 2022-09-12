{
  inputs.std.url = "github:divnix/std";
  inputs.nixpkgs.url = "nixpkgs";
  outputs = { std, ... } @ inputs:
    std.growOn
      {
        inherit inputs;
        cellsFrom = ./nix;
        cellBlocks = [
          (std.blockTypes.runnables "docs")
          (std.blockTypes.devshells "devshells")
          (std.blockTypes.nixago "configs")
        ];
      }
      {
        packages = std.harvest inputs.self [ "std-book" "docs" ];
      };
}
