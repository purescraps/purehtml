import argparse
import sys
from pathlib import Path
from timeit import default_timer as timer

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "python"))

from purehtml import BeautifulSoupBackend, ConfigFactory, extract

FILES_DIR = Path(__file__).resolve().parent / "files"


def read(path):
    # Arbitrary pages may contain invalid UTF-8.
    return Path(path).read_text(encoding="utf-8", errors="replace")


def benchmark(html_path, yaml_path, url, iterations):
    config = ConfigFactory.from_yaml(read(yaml_path))
    doc = BeautifulSoupBackend.load(read(html_path))

    print(f"Running benchmark for {iterations} iterations: {html_path} + {yaml_path}")
    print(f"extract result: {extract(config, doc, url)}")

    start = timer()
    for _ in range(iterations):
        extract(config, doc, url)
    duration = timer() - start

    throughput = iterations / duration

    print(f"Throughput: {throughput:.2f} extracts/second")


def main():
    parser = argparse.ArgumentParser(
        usage="bench.py [--iterations N] [--url URL] [HTML YAML]"
    )
    parser.add_argument("--iterations", type=int, default=5000)
    parser.add_argument("--url", default="http://example.com")
    parser.add_argument("files", nargs="*")
    args = parser.parse_args()

    files = args.files or [FILES_DIR / "sample-1.html", FILES_DIR / "sample-1.yaml"]
    if args.iterations < 1:
        parser.error("--iterations must be a positive integer")
    if len(files) != 2:
        parser.error("expected one HTML file and one YAML file")

    html_path, yaml_path = files
    benchmark(html_path, yaml_path, args.url, args.iterations)


if __name__ == "__main__":
    main()
