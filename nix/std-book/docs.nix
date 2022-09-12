{ inputs
, cell
}:
let
  inherit (inputs) nixpkgs std;
  l = nixpkgs.lib // builtins;
in
{
  default = with nixpkgs; stdenv.mkDerivation {
    pname = "std-book";
    version = "0.1.0";
    src = std.incl (inputs.self) [
      (inputs.self + /book.toml)
      (inputs.self + /src)
    ];

    buildInputs = [ mdbook ];
    buildPhase = ''
      mdbook build
    '';
    installPhase = ''
      cp -r book $out
    '';

    meta = {
      description = "The `std` book";
    };
  };
}
