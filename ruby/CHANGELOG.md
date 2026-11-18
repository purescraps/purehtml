# Changelog

All notable changes to the PureHTML Ruby gem will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-11-18

### Added
- Initial Ruby implementation of PureHTML specification.
- Built on top of Nokogiri for fast HTML/XML parsing.
- Support for declarative YAML configuration schemas (`PureHTML::ConfigFactory.from_yaml`).
- Support for primitives, nested objects, arrays, unions, constants, and default values.
- Built-in transformers (`trim`, `number`, `boolean`, `attr`, `html`, `json`, `jsonpath`, `split`, `join`, `replace`, `capitalize`, `upper`, `lower`, etc.).
- Comprehensive test suite matching the PureHTML multi-language test specifications.
