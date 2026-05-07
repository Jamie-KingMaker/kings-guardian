# Code style
- always use enums to avoid repeated string literals
- always aim to use the SOLID principles when writing code to ensure that the code is maintainable, scalable, and easy to understand

[//]: # (TODO: Add more details about code style, e.g. naming conventions, formatting, using SOLID Principles, etc.)

# Workflow

- always run 'git fetch' and 'git pull' before starting to work on a new feature or bug fix
- always run 'git fetch' and 'git pull' after pushing your changes to ensure that your local branch is up to date with the remote branch

[//]: # (TODO: Add more details about the workflow, e.g. how to run tests, how to deploy, etc.)

# Secret management

- all secrets like CLAUDE_AI_API_TOKEN are stored in the GitHub repository secrets and accessed via environment variables in the code
- never hardcode secrets in the code or commit them to the repository
- in the git ignore file, add any files that may contain secrets or sensitive information to prevent them from being committed to the repository (files like ex: .env)