# Changelog

All notable changes to the PureHTML Ruby gem will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2026-11-20

### Added
- Support for `nokolexbor` backend (`PureHTML::NokolexborBackend`) for high-performance HTML5 parsing.
- Flexible backend configuration supporting symbols (`:nokogiri`, `:nokolexbor`), classes, or instances via `PureHTML.backend=` and `PureHTML.extract(..., backend: ...)`.
- Automatic detection of pre-parsed `Nokolexbor::Node` / `Nokolexbor::Document` and `Nokogiri::XML::Node` objects passed to `PureHTML.extract`.
- Dual-backend test suite running all PureHTML specification tests against both Nokogiri and Nokolexbor.
- Multi-backend benchmarking in `bench/bench.rb`.

### Changed
- Added `nokolexbor` development dependency and relaxed `rake` development dependency constraint to `>= 12.0`.

## [0.1.1] - 2026-11-19

### Changed
- Constrained gem dependencies (`nokogiri`, `rake`, `minitest`) to silence open-ended dependency warnings.
- Cleaned up duplicate `documentation_uri` in gemspec metadata.
- Added repository metadata URIs (`changelog_uri`, `source_code_uri`, `bug_tracker_uri`).

## [0.1.0] - 2026-11-18

### Added
- Initial Ruby implementation of PureHTML specification.
- Built on top of Nokogiri for fast HTML/XML parsing.
- Support for declarative YAML configuration schemas (`PureHTML::ConfigFactory.from_yaml`).
- Support for primitives, nested objects, arrays, unions, constants, and default values.
- Built-in transformers (`trim`, `number`, `boolean`, `attr`, `html`, `json`, `jsonpath`, `split`, `join`, `replace`, `capitalize`, `upper`, `lower`, etc.).
- Comprehensive test suite matching the PureHTML multi-language test specifications.

[Unreleased]: https://github.com/purescraps/purehtml/compare/ruby-v0.2.0...HEAD
[0.2.0]: https://github.com/purescraps/purehtml/compare/ruby-v0.1.1...ruby-v0.2.0
[0.1.1]: https://github.com/purescraps/purehtml/compare/ruby-v0.1.0...ruby-v0.1.1
[0.1.0]: https://github.com/purescraps/purehtml/releases/tag/ruby-v0.1.0
