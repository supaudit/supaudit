{
  description = "supaditor nix flake";

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
      supportedSystems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];

      forAllSystems = nixpkgs.lib.genAttrs supportedSystems;
      nixpkgsFor = forAllSystems (system: import nixpkgs { inherit system; });
    in
    {
      formatter = forAllSystems (
        system:
        let
          pkgs = nixpkgsFor.${system};
        in
        pkgs.nixfmt-rfc-style
      );

      checks = forAllSystems (
        system:
        let
          pkgs = nixpkgsFor.${system};
        in
        {
          pre-commit-check = pre-commit-hooks.lib.${system}.run {
            src = builtins.path { path = ./.; };
            default_stages = [
              "manual"
              "push"
            ];
            hooks = {
              commitizen.enable = true;
              nixpkgs-fmt.enable = true;
            };
          };
        }
      );

      devShells = forAllSystems (
        system:
        let
          pkgs = nixpkgsFor.${system};
        in
        {
          default = pkgs.mkShell {
            shellHook = ''
              ${self.checks.${system}.pre-commit-check.shellHook}
              figlet "supaudit"
            '';

            nativeBuildInputs = self.checks.${system}.pre-commit-check.enabledPackages ++ [
              pkgs.pnpm
              pkgs.nodejs
              pkgs.just
              pkgs.supabase-cli
              pkgs.figlet
            ];

            buildInputs = [
              pkgs.deno
            ];
          };
        }
      );
    };
}
