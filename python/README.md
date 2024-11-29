# PureHTML: Parsing specification for extracting JSON from HTML

### This is the Python implementation of the PureHTML specification.

**Installation**:

To install **PureHTML**, you can use `pip` with following command:

```bash
  pip install PureHTML
```

**Requirements**:

PyYAML

BeautifulSoup4

## Usage

```python
from PureHTML import PureHTML
from ConfigFactory import ConfigFactory

config = ConfigFactory.from_yaml(yaml_string)
output = PureHTML.extract_from_yaml(config, html_string, yaml_string)

