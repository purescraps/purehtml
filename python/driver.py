from purehtml import ConfigFactory
from purehtml import extract_from_str

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
print(extract_from_str(config, html_string, yaml_string))
print(expected_output)
