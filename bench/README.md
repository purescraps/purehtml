# PureHTML implementation benchmarks

You can run benchmarks using `make` from either the repository root or the `bench/` directory:

```bash
make bench           # Run all benchmarks
make bench-go        # Run Go benchmark
make bench-ruby      # Run Ruby benchmark (alias: bench-rb)
make bench-ts        # Run TypeScript benchmark (alias: bench-typescript)
make bench-python    # Run Python benchmark (alias: bench-py)
make bench-java      # Run Java benchmark (auto-builds dependencies if needed)
```

## Benchmarking your own pages

By default the bundled `files/sample-1.html` + `files/sample-1.yaml` pair is used.
Pass any HTML document and PureHTML YAML config to benchmark them in every language:

```bash
make bench HTML=page.html CONFIG=page.yaml

# Single language, fewer iterations, custom base URL
make bench-go HTML=page.html CONFIG=page.yaml ITERATIONS=500 URL=https://example.com/page
```

| Variable | Description |
| :--- | :--- |
| `HTML`, `CONFIG` | The HTML document and YAML config. Must be set together. Paths may contain spaces. |
| `ITERATIONS` | Extractions to run (default `5000`). Lower it for large pages. |
| `URL` | Base URL passed to the extractor (default `http://example.com`). |

Relative paths are resolved against the directory `make` runs in (the repository root or `bench/`).

`make bench` stops at the first language that fails. Use `make -k bench` to keep going.

## Saving results

Add `SAVE=1` to record the results for the documentation site:

```bash
make bench SAVE=1                       # all languages
make bench-go SAVE=1 ITERATIONS=1000    # one language, merged into the existing file
make bench SAVE=1 SAVE_FILE=/tmp/b.json # write somewhere else
```

The results are written to `docs/src/data/benchmarks.json` with:

- `results`: throughput (extracts/second) and the runtime version for each language. Ruby has one entry per backend (`ruby-nokogiri`, `ruby-nokolexbor`).
- `environment`: OS, CPU model, core counts and memory of the machine.
- `inputs`: iteration count, base URL, and the name, size and SHA-256 of the HTML and YAML files.
- `git`: the commit the code was benchmarked at, and whether tracked files had uncommitted changes.

Results from an earlier run are kept only when the inputs and commit are unchanged. Otherwise the file is replaced, so numbers from different inputs or code are never mixed. Logs are kept in `bench/.results/` (git-ignored).

Note that `make bench --save` does not work: make rejects `--save` as an unknown option, so use `SAVE=1`.

## Running Manually

Every script accepts the same arguments:

```
bench.<ext> [--iterations N] [--url URL] [HTML YAML]
```

For example: `go run bench.go --iterations 500 page.html page.yaml`

### Go

1. Run benchmark: `go run bench.go`

### Java

1. Compile and copy dependencies (from `java/`):
   ```bash
   mvn compile dependency:copy-dependencies -DincludeScope=runtime -DskipTests
   ```
2. Run benchmark:
   ```bash
   java -cp "../java/target/classes:../java/target/dependency/*" bench.java
   ```

### Python

1. Create a virtual environment: `python3 -m venv .venv`
2. Activate the virtual environment: `source .venv/bin/activate`
3. Install the dependencies: `pip3 install -r requirements.txt`
4. Run benchmark: `python3 bench.py`

### Ruby

1. Run benchmark: `ruby bench.rb`

### TypeScript

1. Run benchmark: `bun bench.ts`
