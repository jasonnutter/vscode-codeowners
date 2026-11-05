# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## 4.3.0 - 2026-11-04

### Changed

- Improve syntax highlighting (#39).
- Publish to the Marketplace from GitHub Actions with trusted publishing (#40).

## 4.2.0 - 2026-03-14

### Added

- Show error diagnostics for invalid CODEOWNERS patterns (#34).

## 4.1.0 - 2024-04-13

### Changed

- Use camel case for configuration. Deprecate old configuration options (#29).

## 4.0.0 - 2024-04-11

### Added

- Reload link provider when settings change (#28).
- Center editor on CODEOWNERS line when jumping to owner via status bar (#28).

### Changed

- Rename GitHub "team" setting to "username" to be consistent with existing features (#28).

## 3.4.0 - 2024-04-10

### Added

- Slack channel mapping via `github-code-owners.team-mapping.slack` setting (#26).

## 3.3.0 - 2023-11-15

### Added

- Formatting support behind the `github-code-owners.format.enabled` setting (#24). Thanks @s-weigand!
- Tests for new formatting code (#24). Thanks @s-weigand!

## 3.2.1 - 2023-11-12

### Changed

- Remove logo from README. Show features before installation instructions. (#25)

## 3.2.0 - 2023-08-16

### Added

- GitHub Enterprise support (#23). Thanks @jeffstoner!

## 3.1.0 - 2023-08-08

### Fixed

- Support `docs/CODEOWNERS` location. (#20)

## 3.0.1 - 2023-06-04

### Fixed

- Fix broken command handler. (#19)

## 3.0.0 - 2023-06-03

### Added

- syntax highlighting it differentiate between absolute patterns and nested patterns. (#17)
- added hover provider to indicate if a pattern is absolute or nested. (#17)
- add auto complete for usernames and absolute file patterns. (#17)

## 2.5.1 - 2023-04-24

### Fixed

- Fix syntax highlight for lines with a single `#`.

## 2.5.0 - 2023-03-06

### Change

- Replace black and white logo with a colorful one. (#11)

## 2.4.0 - 2023-03-06

### Changed

- Show "None" when a code owners file exists, but there are no owners for the current file. (#10)

## 2.3.0 - 2023-03-06

### Fixed

- Find `CODEOWNERS` file in `.github/` and repository root directories. (#9)
- Handle parsing code owners [files with inline comments](https://github.com/snyk/github-codeowners/commit/64dc4df353de62f0c96dae96897e283e66d5be37). (#9)

## 2.2.0 - 2023-03-02

### Added

- Usernames in CODEOWNERS files are now clickable links to the GitHub profile or team page. (#6)

### Changed

- Clicking status bar now opens line in CODEOWNERS file. (#6)
- Status bar tooltip now includes line number in CODEOWNERS file. (#6)

### Fixed

- Fixed syntax highlighting for inline comments. (#6)

## 2.1.0 - 2023-02-28

### Changed

- Update status bar tooltip to better match GitHub UI. (#4)

## 2.0.1 - 2023-02-28

### Fixed

- set minumum vscode version set to an old build so we can install the package. (#1)

## 2.0.0 - 2023-02-28

### Added

- Typescript and esbuild. (#1)

### Changed

- Use icon in status bar instead of name. (#1)
- Open GitHub on selection from code owners quick pick menu. (#1)

### Fixed

- Use `@snyk/github-codeowners` instead of `codeowners` to fix broken code owners evaluation. (#1)

## 1.1.1 - 2019-07-31

### Fixed

- Hide status bar item when no CODEOWNERS file. Thanks @bmalehorn. [#3](https://github.com/jasonnutter/vscode-codeowners/pull/3)
- Fix /root paths. Thanks @bmalehorn. ([#4](https://github.com/jasonnutter/vscode-codeowners/pull/4))

## 1.1.0 - 2019-01-19

### Added

- Syntax highlighting for `CODEOWNERS` files. Thanks [@bmalehorn](https://github.com/bmalehorn). ([#1](https://github.com/jasonnutter/vscode-codeowners/pull/1)

## 1.0.0 - 2018-12-12

- Initial release
