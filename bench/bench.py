from bs4 import BeautifulSoup
from timeit import default_timer as timer
from purehtml import ConfigFactory, extract


def read_file(path: str) -> str:
    file = open(path, "r")
    content = file.read()
    file.close()

    return content


iterations = 5000
config = ConfigFactory.from_yaml(read_file("files/sample-1.yaml"))
html = read_file("files/sample-1.html")
doc = BeautifulSoup(html, "html5lib")

print(f"Running benchmark for {iterations} iterations.")

print(f"extract result: {extract(config, doc, "http://example.com")}")

start = timer()
for i in range(0, iterations):
    extract(config, doc, "http://example.com")
duration = timer() - start

throughput = iterations / duration

print(f"Throughput: {throughput:.2f} extracts/second")
