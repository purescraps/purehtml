.DEFAULT_GOAL := bench

# Executables
GO ?= go
RUBY ?= ruby
BUN ?= bun
JAVA ?= java
MVN ?= mvn

# Python interpreter detection: checks local and repo venvs before falling back to system python
PYTHON ?= $(shell \
	if [ -f .venv/bin/python ]; then echo .venv/bin/python; \
	elif [ -f ../python/.venv/bin/python ]; then echo ../python/.venv/bin/python; \
	elif [ -f ../.venv/bin/python ]; then echo ../.venv/bin/python; \
	elif command -v python3 >/dev/null 2>&1; then echo python3; \
	else echo python; fi)

JAVA_CP ?= ../java/target/classes:../java/target/dependency/*

.PHONY: all bench bench-all \
	bench-go \
	bench-ruby bench-rb \
	bench-ts bench-typescript \
	bench-python bench-py \
	bench-java build-java clean-java \
	help

all: bench

bench: bench-go bench-ruby bench-ts bench-python bench-java
bench-all: bench

bench-go:
	@echo "==> Running Go benchmark..."
	$(GO) run bench.go

bench-ruby:
	@echo "==> Running Ruby benchmark..."
	$(RUBY) bench.rb

bench-rb: bench-ruby

bench-ts:
	@echo "==> Running TypeScript benchmark..."
	$(BUN) bench.ts

bench-typescript: bench-ts

bench-python:
	@echo "==> Running Python benchmark..."
	$(PYTHON) bench.py

bench-py: bench-python

build-java:
	$(MVN) -f ../java/pom.xml compile dependency:copy-dependencies -DincludeScope=runtime -DskipTests

clean-java:
	$(MVN) -f ../java/pom.xml clean

bench-java:
	@if [ ! -d "../java/target/classes" ] || [ ! -d "../java/target/dependency" ]; then \
		echo "==> Building Java dependencies..."; \
		$(MAKE) build-java; \
	fi
	@echo "==> Running Java benchmark..."
	$(JAVA) -cp "$(JAVA_CP)" bench.java

help:
	@echo "PureHTML Benchmark Suite"
	@echo ""
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@echo "  bench             Run all benchmarks"
	@echo "  bench-go          Run Go benchmark"
	@echo "  bench-ruby        Run Ruby benchmark (alias: bench-rb)"
	@echo "  bench-ts          Run TypeScript benchmark (alias: bench-typescript)"
	@echo "  bench-python      Run Python benchmark (alias: bench-py)"
	@echo "  bench-java        Run Java benchmark"
	@echo "  build-java        Build Java classes and copy dependencies"
	@echo "  clean-java        Clean Java build artifacts"
	@echo "  help              Show this help message"
