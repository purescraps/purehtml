from purehtml.tests.Specs import run

# For testing, will be removed later.

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

run()
#config = ConfigFactory.from_yaml(yaml_string)
#answer = PureHTML.extract_from_yaml(config,html_string, yaml_string)
#print(answer)
#html = "<html><body><div class='test'>Hello</div></body></html>"
#soup = BeautifulSoup(html, "html.parser")
#nodes = soup.select(".test")
#print(nodes[0].text)

# Building the ExtractParams
#builder = ExtractParamsBuilder()
#extract_params = (
#    builder.set_document(soup)
#    .set_node(nodes)
#    .set_url("http://example.com")
#    .set_element_already_matched(False)
#    .set_element(nodes[0] if nodes else None)
#    .build()
#)

# Accessing data from ExtractParams
#print(extract_params.document())  # Prints the BeautifulSoup document
#print(extract_params.node())      # Prints the selected nodes
#print(extract_params.url())       # Prints "http://example.com"
#print(extract_params.get_element_already_matched())  # Prints False
#print(extract_params.element())   # Prints the first selected node (if available)