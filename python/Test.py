from purehtml.tests.Specs import run

# For testing, will be removed later.

yaml_string = """
selector: a
type: array
items:
  # we don't pass any selector here. we already got the <a> element here.
  # we will first extract the "href" attribute, then resolve the value.
  transform: ['attr(href)', resolve]
"""
html_string = """
<div>
  <a href="/about">internal</a>
  <a href="/articles/../help">internal - relative</a>
  <a href="https://github.com/purescraps/purehtml">external</a>
</div>
"""

run()
