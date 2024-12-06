# PureHTML

PureHTML is a parsing specification for extracting JSON from HTML.

- [Documentation](https://purescraps.github.io/purehtml/)

**Installation**:

To install **PureHTML**, you can use `pip` with following command:

```bash
  pip install PureHTML
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

config = ConfigFactory.extract(yaml_string)
print(f"Extracted output : {extract(config, html_string)}")
print(f"Expected  output : {expected_output}")

```

## License

[MIT](https://choosealicense.com/licenses/mit/)
