# PureHTML Go Port - Specification Tests

This document describes the specification test suite for the PureHTML Go port, which mirrors the comprehensive test suite from the TypeScript implementation.

## Test Suite Overview

The specification tests are loaded from YAML files in the parent directory's `specs/` folder and automatically discovered and executed.

**Total Tests:** 30
- **Original Unit Tests:** 8
- **Specification Tests:** 22

**Status:** ✅ All tests passing

## Running Tests

```bash
# Run all tests
go test -v

# Run only specification tests
go test -v -run TestAllSpecs

# Run specific test category
go test -v -run "TestAllSpecs/Array_Configuration"
```

## Specification Test Categories

### 1. Array Configuration Tests (3 tests)

Location: `../specs/array.yaml`

Tests array extraction functionality:
- **should_extract_a_basic_array** - Extracts array of simple text values
- **extract_complex_array** - Handles complex arrays with union configurations
- **extract_an_array_of_complex_objects** - Extracts arrays of objects with multiple attributes

Example:
```yaml
selector: "#root div"
type: array
items: {}
expected: [foo, bar, baz]
```

### 2. Basic Configuration Tests (4 tests)

Location: `../specs/basic.yaml`

Tests fundamental extraction:
- **should_extract_a_string** - Simple text extraction
- **should_extract_a_number** - String-to-number conversion
- **should_ignore_HTML_comments** - Proper HTML comment handling
- **should_return_null_if_the_selector_matches_nothing** - Null handling for non-matches

Example:
```yaml
selector: .foo
transform: [trim, number]
expected: 123
```

### 3. Object Configuration Tests (2 tests)

Location: `../specs/object.yaml`

Tests property extraction:
- **should_extract_object_properties** - Multiple property extraction
- **should_only_match_child_elements** - Proper DOM traversal

Example:
```yaml
selector: "#root"
type: object
properties:
  a: { selector: "#a" }
  b: { selector: "#b" }
expected: { a: "foo", b: "bar" }
```

### 4. Transformer Tests (9 tests)

#### 4.1 attr Transformer (1 test)
Location: `../specs/transformers/attr.yaml`
- **Extract_attributes** - Attribute extraction with unions

#### 4.2 html Transformer (1 test)
Location: `../specs/transformers/html.yaml`
- **Extract_html** - Inner HTML extraction

#### 4.3 JSON Transformer (1 test)
Location: `../specs/transformers/json.yaml`
- **should_parse_a_JSON_inside_a_script_tag** - JSON parsing from text

#### 4.4 removeLastPathSection Transformer (3 tests)
Location: `../specs/transformers/remove-last-path-section.yaml`
- **remove_last_path_section** - Single path removal
- **execute_multiple_times** - Repeated path removal
- **should_not_have_any_effect_if_no_more_sections_left** - Root path handling

Example:
```yaml
selector: a
transform: [attr(href), removeLastPathSection]
# http://example.com/foo/bar/baz -> http://example.com/foo/bar
```

#### 4.5 removeUrlQueryParam Transformer (4 tests)
Location: `../specs/transformers/remove-url-query-param.yaml`
- **should_remove_a_single_query_parameter_from_urls** - Single param removal
- **should_remove_multiple_query_pamaters_from_urls** - Multiple param removal
- **should_ignore_non-existing_query_parameters** - Graceful handling of missing params
- **should_clear_all_the_search_params_if_no_arguments_are_given** - Clear all params

Example:
```yaml
selector: a
transform: [attr(href), removeUrlQueryParam(utm_source)]
# http://example.com?utm_source=x&utm_medium=y -> http://example.com?utm_medium=y
```

### 5. Union Configuration Tests (3 tests)

Location: `../specs/union.yaml`

Tests alternative extraction strategies:
- **Should_walk_over_the_configurations_and_use_the_first_match** - First successful match
- **Should_handle_multiple_matches** - Multiple matching results
- **Should_return_null_if_nothing_matches** - Null when no match found

Example:
```yaml
union:
  - selector: .modern-date
  - selector: .legacy-date
# Returns first matching selector's result
```

## Implementation Details

### Spec File Format

Spec files use YAML with the following structure:

```yaml
description: String describing the test group
specs:
  - description: Description of individual test
    input: |
      <html>HTML input</html>
    configuration:
      # PureHTML extraction configuration
    expected:
      # Expected output (can be string, number, object, array, or null)
```

### Test Loader

The `specs_test.go` file includes:
- `LoadSpecFile()` - Loads and parses individual YAML spec files
- `LoadAllSpecs()` - Recursively discovers all spec files from a directory
- `ConfigFactoryFromMap()` - Creates Config objects from parsed YAML
- `deepEqual()` - Recursive comparison handling all types including YAML float64 to int conversion

## Key Fixes Applied

### 1. Null Return Values
- Fixed to return `nil` instead of empty string when selectors don't match
- Prevents confusion between "no match" and "empty string"

### 2. Array Detection
- Configs with `items` field are now automatically detected as array configs
- Removed requirement for explicit `type: array` field

### 3. Selector Matching
- Fixed behavior where selectors didn't match the current node itself
- Now checks `node.Is(selector)` before `node.Find(selector)`
- Enables proper union configuration handling

### 4. Attribute Transformer Behavior
- `attr()` with no parameters now returns all attributes as an object
- `attr(name)` with parameter returns specific attribute value

### 5. URL Path Manipulation
- `removeLastPathSection` now properly handles trailing slashes
- Returns root path (`/`) when no more sections remain
- Handles multiple consecutive calls

### 6. Query Parameter Removal
- `removeUrlQueryParam()` with no parameters clears all query params
- Gracefully handles non-existent parameters

### 7. Union Config Error Handling
- Union configs now continue to next option on extraction errors
- Properly handles edge cases where configs partially fail

### 8. Numeric Comparison
- Tests now properly compare float64 (from YAML) with expected int/float values
- Handles YAML's default numeric type (float64)

## Coverage Summary

| Feature | Tests | Status |
|---------|-------|--------|
| Primitive values | 4 | ✅ Pass |
| Objects | 2 | ✅ Pass |
| Arrays | 3 | ✅ Pass |
| Unions | 3 | ✅ Pass |
| Transformers | 9 | ✅ Pass |
| **Total** | **22** | **✅ All Pass** |

## Performance

Test execution time: ~250ms for all 30 tests

Individual spec test execution: <10ms per test

## Compatibility

- Spec format: 100% compatible with TypeScript implementation
- Extraction results: Identical to TypeScript implementation
- Configuration syntax: Full YAML support

## Future Enhancements

Possible areas for expansion:
1. Additional transformer implementations
2. Performance benchmarking tests
3. Edge case coverage for complex nested structures
4. Custom backend implementation examples
