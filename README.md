# Supaudit

<p align="center">
    <img width="240px" alt="Supaudit Logo" src="https://github.com/user-attachments/assets/c6929999-c73d-4c5c-8b36-e89317f828e2" />
</p>

[![Build](https://github.com/supaudit/supaudit/actions/workflows/build.yml/badge.svg)](https://github.com/supaudit/supaudit/actions/workflows/build.yml)
[![Supaudit License](https://img.shields.io/github/license/supaudit/supaudit)](https://github.com/supaudit/supaudit?tab=Apache-2.0-1-ov-file)

Supaudit is an open-source platform that revolutionizes the way security teams perform audits and write reports. By combining the power of interactive notebooks and generative AI, Supaudit streamlines the entire security auditing process.

Features

- 📝 Interactive, _Jupyter-style meets Notion_ type of report editing for dynamic report creation.
- 🤖 AI-powered insights using Retrieval Augmented Generation (RAG).
- 🔗 Seamless blending of documentation and live analysis.
- 👥 Secure access management with user authentication and report ownership.
- 📊 Centralized state management for comprehensive audit information.
- 📤 Easy export of reports to Markdown format.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

> [!IMPORTANT]
> Default user credentials are:
> * **Email:** `user@supaudit.local`.
> * **Password:** `password`.

### Prerequisites

#### Using the Nix flake
- Nix (with flakes feature).

#### Using system installed packages

- Node.js LTS.
- pnpm (corepack).
- Deno.
- Supabase CLI.

### Installation

1. Create a .env file, using the [.env-template](/.env-template) file as reference.

2. Run the following instructions:

```bash
# Run Supabase
supabase start

# Serve the Edge functions
supabase functions serve

# -- On a different terminal --

# Run the Qwik City app
pnpm preview

# Access the app in http://localhost:4173
```



## Project Structure

```
supaudit/
├── src/                    // Qwik City app
└── supabase/               // Supabase project
```

## Contributing

We welcome contributions! Feel free to open an issue or pull request.

## License

Supaudit is licensed under the [Apache License 2.0](https://spdx.org/licenses/Apache-2.0.html) - see the [LICENSE](LICENSE) file for details.

## Authors

- Óscar Carrasco / [oxcabe](https://github.com/oxcabe)
- Eduardo González / [codexlynx](https://github.com/codexlynx).
