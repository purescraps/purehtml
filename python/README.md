# PureHTML

PureHTML is a parsing specification for extracting JSON from HTML.

- [Documentation](https://purescraps.github.io/purehtml/)

**Installation**:

To install **PureHTML**, you can use `pip` with following command:

```bash
  pip install purehtml
```

## Usage

```python
from purehtml import ConfigFactory, extract

yaml_string = """
selector: span
type: array
items: {}
"""
html_string = """
<div>
  <span>a</span>
  <span>b</span>
  <span>c</span>
</div>
"""
expected_output = "['a', 'b', 'c']"

config = ConfigFactory.fromYAML(yaml_string)

print(f"Extracted output : {extract(config, html_string, 'http://example.com')}")
print(f"Expected  output : {expected_output}")

```

## Development

For testing, we use test specifications defined in `<purehtml root>/specs`.
You may run `python3 run_tests.py` to check if the python implementation
is working correctly or has some incompatibilities.

## License

[MIT](https://choosealicense.com/licenses/mit/)
