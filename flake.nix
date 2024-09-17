{
  description = "A very basic flake";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

    pre-commit-hooks = {
      url = "github:cachix/pre-commit-hooks.nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };
  outputs =
    { self
    , nixpkgs
    , pre-commit-hooks
    ,
    }:
    let
      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];

      forAllSystems =
        f:
        nixpkgs.lib.genAttrs systems (
          system:
          f rec {
            inherit system;
            pkgs = nixpkgs.legacyPackages.${system};
            commonPackages = builtins.attrValues {
              inherit (pkgs) nodejs pnpm;
            };
          }
        );
    in
    {
      checks = forAllSystems (
        { system, pkgs, ... }:
        {
          pre-commit-check = pre-commit-hooks.lib.${system}.run {
            src = builtins.path { path = ./.; };
            default_stages = [
              "manual"
              "push"
            ];
            hooks = {
              actionlint.enable = true;
              commitizen.enable = true;
              nixpkgs-fmt.enable = true;
              biome = {
                enable = true;
                package = pkgs.biome;
                name = "biome";
                entry = "biome check --no-errors-on-unmatched";
                types_or = [
                  "javascript"
                  "jsx"
                  "ts"
                  "tsx"
                  "json"
                ];
                stages = [ "pre-push" ];
              };
            };
          };
        }
      );

      formatter = forAllSystems (
        { system
        , pkgs
        , commonPackages
        , ...
        }:
        pkgs.nixfmt-rfc-style
      );

      devShells = forAllSystems (
        { system
        , pkgs
        , commonPackages
        , ...
        }:
        {
          default = pkgs.mkShell {
            inherit (self.checks.${system}.pre-commit-check) shellHook;
            packages = commonPackages ++ self.checks.${system}.pre-commit-check.enabledPackages;
          };
        }
      );

    };
}
