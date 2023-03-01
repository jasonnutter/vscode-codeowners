# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
