# Code style
- always use enums to avoid repeated string literals
- always aim to use the SOLID principles when writing code to ensure that the code is maintainable, scalable, and easy to understand
- on most components we need to add an ID which is a unique identifier for the component, this is important for tracking and debugging purposes. We will have to use an enum for these ID's to ensure that they are consistent across the codebase and to avoid any potential issues with hardcoded string literals. The ID should be descriptive and meaningful, and should follow a consistent naming convention to make it easy to understand what the component is and what it does.
- on the injected scripts which already have a query string ?v=* increment the version by one every time something changes in those scripts

[//]: # (TODO: Add more details about code style, e.g. naming conventions, formatting, using SOLID Principles, etc.)

# Workflow

- always run 'git fetch' and 'git pull' before starting to work on a new feature or bug fix
- always run 'git fetch' and 'git pull' after pushing your changes to ensure that your local branch is up to date with the remote branch

[//]: # (TODO: Add more details about the workflow, e.g. how to run tests, how to deploy, etc.)

# Secret management

- all secrets like CLAUDE_AI_API_TOKEN are stored in the GitHub repository secrets and accessed via environment variables in the code
- never hardcode secrets in the code or commit them to the repository
- in the git ignore file, add any files that may contain secrets or sensitive information to prevent them from being committed to the repository (files like ex: .env)