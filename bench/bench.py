import argparse
import sys
from pathlib import Path
from timeit import default_timer as timer

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "python"))

from purehtml import BeautifulSoupBackend, ConfigFactory, SelectolaxBackend, extract

FILES_DIR = Path(__file__).resolve().parent / "files"


def read(path):
    # Arbitrary pages may contain invalid UTF-8.
    return Path(path).read_text(encoding="utf-8", errors="replace")


# Default extractions per backend. BeautifulSoup is slow on heavy pages, so it
# runs fewer. --iterations overrides every backend.
BACKENDS = {"beautifulsoup": (BeautifulSoupBackend, 20)}
if SelectolaxBackend is not None:
    BACKENDS["selectolax"] = (SelectolaxBackend, 500)


def benchmark(name, backend, html_path, yaml_path, url, iterations):
    config = ConfigFactory.from_yaml(read(yaml_path))
    doc = backend.load(read(html_path))

    print(
        f"Running {name} benchmark for {iterations} iterations: {html_path} + {yaml_path}"
    )
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
    parser.add_argument("--iterations", type=int)
    parser.add_argument("--url", default="http://example.com")
    parser.add_argument("files", nargs="*")
    args = parser.parse_args()

    files = args.files or [FILES_DIR / "sample-2.html", FILES_DIR / "sample-2.yml"]
    if args.iterations is not None and args.iterations < 1:
        parser.error("--iterations must be a positive integer")
    if len(files) != 2:
        parser.error("expected one HTML file and one YAML file")

    html_path, yaml_path = files
    for name, (backend, default_iterations) in BACKENDS.items():
        benchmark(
            name,
            backend,
            html_path,
            yaml_path,
            args.url,
            args.iterations or default_iterations,
        )


if __name__ == "__main__":
    main()
