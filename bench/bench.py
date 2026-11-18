import sys
from pathlib import Path
from timeit import default_timer as timer

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "python"))

from purehtml import BeautifulSoupBackend, ConfigFactory, extract

base_dir = Path(__file__).resolve().parent
yaml_content = (base_dir / "files/sample-1.yaml").read_text()
html_content = (base_dir / "files/sample-1.html").read_text()

iterations = 5000
config = ConfigFactory.from_yaml(yaml_content)
doc = BeautifulSoupBackend.load(html_content)

print(f"Running benchmark for {iterations} iterations.")
print(f"extract result: {extract(config, doc, 'http://example.com')}")

start = timer()
for _ in range(iterations):
    extract(config, doc, "http://example.com")
duration = timer() - start

throughput = iterations / duration

print(f"Throughput: {throughput:.2f} extracts/second")
