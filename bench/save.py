#!/usr/bin/env python3
"""Record a benchmark run as JSON for the documentation site.

Invoked by the Makefile after each language benchmark when SAVE=1. It parses
the throughput lines from the captured log and merges them into the results
file together with the environment and the benchmark inputs.

Results from earlier runs are kept only when the inputs and the git commit
match, so numbers from different inputs or code are never published together.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import platform
import re
import shlex
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

BENCH_DIR = Path(__file__).resolve().parent
ROOT = BENCH_DIR.parent
DEFAULT_HTML = str(BENCH_DIR / "files" / "sample-2.html")
DEFAULT_CONFIG = str(BENCH_DIR / "files" / "sample-2.yml")
DEFAULT_URL = "http://example.com"

# "Running benchmark for ..." (Go, Python, TypeScript, Java) or
# "Running nokogiri benchmark for ..." (Ruby, one line per backend).
HEADER = re.compile(r"^Running (?:(\w+) )?benchmark for (\d+) iterations")
THROUGHPUT = re.compile(r"^Throughput: ([\d.]+) extracts/second")


def parse_results(log: str, lang: str) -> dict[str, tuple[float, int]]:
    """Map each result key to (throughput, iterations) from the benchmark output.

    Iteration counts differ per language and backend, so each one is read from
    the header that the benchmark printed for it.
    """
    results: dict[str, tuple[float, int]] = {}
    variant: str | None = None
    iterations: int | None = None
    for line in log.splitlines():
        header = HEADER.match(line)
        if header:
            variant = header.group(1)
            iterations = int(header.group(2))
            continue
        match = THROUGHPUT.match(line)
        if match and iterations is not None:
            key = lang if variant is None else f"{lang}-{variant}"
            results[key] = (float(match.group(1)), iterations)
            variant = None
            iterations = None
    return results


def run(*args: str) -> str | None:
    try:
        proc = subprocess.run(args, capture_output=True, text=True, timeout=15)
    except (OSError, subprocess.SubprocessError):
        return None
    if proc.returncode != 0:
        return None
    return proc.stdout.strip() or None


def first_line(text: str | None) -> str | None:
    if not text:
        return None
    for line in text.splitlines():
        if line.strip():
            return line.strip()
    return None


def to_int(value: str | None) -> int | None:
    try:
        return int(value) if value else None
    except ValueError:
        return None


def read_text(path: str) -> str | None:
    try:
        return Path(path).read_text(encoding="utf-8", errors="replace")
    except OSError:
        return None


def machine_environment() -> dict:
    system = platform.system()
    env: dict = {
        "os": {
            "name": system,
            "version": platform.release(),
            "arch": platform.machine(),
        },
        "cpu": {
            "model": None,
            "logical_cores": os.cpu_count(),
            "physical_cores": None,
        },
        "memory_bytes": None,
    }

    if system == "Darwin":
        env["os"]["name"] = run("sw_vers", "-productName") or "macOS"
        env["os"]["version"] = run("sw_vers", "-productVersion")
        env["os"]["build"] = run("sw_vers", "-buildVersion")
        env["cpu"]["model"] = run("sysctl", "-n", "machdep.cpu.brand_string")
        env["cpu"]["physical_cores"] = to_int(run("sysctl", "-n", "hw.physicalcpu"))
        env["cpu"]["logical_cores"] = to_int(run("sysctl", "-n", "hw.logicalcpu")) or env["cpu"]["logical_cores"]
        env["memory_bytes"] = to_int(run("sysctl", "-n", "hw.memsize"))
    elif system == "Linux":
        release = read_text("/etc/os-release") or ""
        pretty = re.search(r'^PRETTY_NAME="?([^"\n]+)"?', release, re.M)
        if pretty:
            env["os"]["name"] = pretty.group(1)
        cpuinfo = read_text("/proc/cpuinfo") or ""
        model = re.search(r"^model name\s*:\s*(.+)$", cpuinfo, re.M)
        if model:
            env["cpu"]["model"] = model.group(1).strip()
        meminfo = read_text("/proc/meminfo") or ""
        total = re.search(r"^MemTotal:\s+(\d+) kB", meminfo, re.M)
        if total:
            env["memory_bytes"] = int(total.group(1)) * 1024
    elif system == "Windows":
        env["cpu"]["model"] = platform.processor() or None

    return env


def file_info(path: Path) -> dict:
    data = path.read_bytes()
    return {
        "file": path.name,
        "bytes": len(data),
        "sha256": hashlib.sha256(data).hexdigest(),
    }


def resolve(value: str, base: Path) -> Path:
    path = Path(value)
    return path if path.is_absolute() else base / path


def git_state(exclude: Path | None = None) -> dict:
    commit = run("git", "-C", str(ROOT), "rev-parse", "--short", "HEAD")
    # Tracked changes only: untracked files and the output file itself do not
    # affect the benchmarked code (multiple languages update --out in one run).
    cmd = ["git", "-C", str(ROOT), "status", "--porcelain", "--untracked-files=no"]
    if exclude is not None:
        try:
            rel = exclude.resolve().relative_to(ROOT.resolve())
        except ValueError:
            rel = None
        if rel is not None:
            cmd.extend(["--", ".", f":(exclude){rel.as_posix()}"])
    status = run(*cmd)
    return {"commit": commit, "dirty": bool(status)}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--lang", required=True, help="language key, e.g. go")
    parser.add_argument("--log", required=True, type=Path, help="captured benchmark output")
    parser.add_argument("--runtime-cmd", required=True, help="command printing the runtime version")
    parser.add_argument("--out", required=True, type=Path, help="results JSON to create or update")
    args = parser.parse_args()

    results = parse_results(args.log.read_text(encoding="utf-8", errors="replace"), args.lang)
    if not results:
        print(f"save: no throughput found in {args.log}", file=sys.stderr)
        return 1

    # Same variables the Makefile exports and run.sh resolves against.
    base = Path(os.environ.get("BENCH_CWD") or os.getcwd())
    html = resolve(os.environ.get("HTML") or DEFAULT_HTML, base)
    config = resolve(os.environ.get("CONFIG") or DEFAULT_CONFIG, base)

    # Unset means each language ran its own default; the per-result count is in results.
    inputs = {
        "iterations": to_int(os.environ.get("ITERATIONS")),
        "url": os.environ.get("URL") or DEFAULT_URL,
        "html": file_info(html),
        "config": file_info(config),
    }
    git = git_state(args.out)
    runtime = first_line(run_any(args.runtime_cmd))

    existing = None
    if args.out.exists():
        existing = json.loads(args.out.read_text(encoding="utf-8"))

    existing_benchmarks: list[dict] = []
    if existing and existing.get("git", {}).get("commit") == git["commit"]:
        if isinstance(existing.get("benchmarks"), list):
            existing_benchmarks = existing["benchmarks"]
    elif existing and (existing.get("benchmarks") or existing.get("results")):
        print(f"save: commit changed, replacing previous results in {args.out}")

    kept: dict = {}
    remaining: list[dict] = []
    for entry in existing_benchmarks:
        entry_inputs = entry.get("inputs")
        if entry_inputs == inputs:
            kept = dict(entry.get("results", {}))
        elif entry_inputs and entry_inputs.get("html", {}).get("file") == inputs["html"]["file"]:
            print(f"save: inputs changed for {inputs['html']['file']}, replacing previous results")
        else:
            remaining.append(entry)

    for key, (throughput, iterations) in results.items():
        kept[key] = {"throughput_per_second": throughput, "iterations": iterations, "runtime": runtime}

    remaining.append({
        "inputs": inputs,
        "results": dict(sorted(kept.items())),
    })
    remaining.sort(key=lambda b: b.get("inputs", {}).get("html", {}).get("file", ""))

    payload = {
        "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "environment": machine_environment(),
        "git": git,
        "benchmarks": remaining,
    }

    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"save: {', '.join(results)} written to {args.out}")
    return 0


def run_any(command: str) -> str | None:
    """Run a version command, which some runtimes (Java) print to stderr."""
    try:
        proc = subprocess.run(shlex.split(command), capture_output=True, text=True, timeout=15)
    except (OSError, ValueError, subprocess.SubprocessError):
        return None
    return (proc.stdout or proc.stderr or "").strip() or None


if __name__ == "__main__":
    sys.exit(main())
