# Internal Package Structure

This directory contains internal implementation details of the PureHTML library.
These packages are not part of the public API but provide organizational structure.

## Directory Structure

```
internal/
├── core/           # Core interfaces and types
├── config/         # Configuration types and factories
├── backend/        # HTML parsing backends
├── transformer/    # Value transformers
└── README.md       # This file
```

## Packages

### core/
Core interfaces and types:
- Backend interface
- Document interface
- Node interface
- Transformer interface
- Type definitions (STRING, NUMBER, BOOLEAN, OBJECT, ARRAY)
- Error types

**Files:** `core.go`

### config/
Configuration management:
- PrimitiveValueConfig
- ObjectConfig
- ArrayConfig
- ConstantConfig
- UnionConfig
- ConfigFactory
- YAML parsing

**Files:** `config.go`, `config_factory.go`

### backend/
HTML parsing backends:
- Backend implementations
- GoQuery backend (default)
- Document and Node implementations

**Files:** `backend_goquery.go`

### transformer/
Value transformers:
- Base transformer implementations
- All 11 transformer types
- Transformer registry

**Files:** `transformers.go`

## Notes

All files in the root package directory (`../*.go`) are part of the public API.
Internal packages provide implementation organization without restricting public access
(as all types are re-exported through the root package).

For API documentation, see `../README.md`.
For test documentation, see `../TESTS_SUMMARY.md`.
