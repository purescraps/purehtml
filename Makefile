.DEFAULT_GOAL := bench

BENCH_DIR := bench

.PHONY: all bench bench-all \
	bench-go \
	bench-ruby bench-rb \
	bench-ts bench-typescript \
	bench-python bench-py \
	bench-java build-java clean-java \
	help

all: bench

bench bench-all \
bench-go \
bench-ruby bench-rb \
bench-ts bench-typescript \
bench-python bench-py \
bench-java build-java clean-java \
help:
	@$(MAKE) -C $(BENCH_DIR) $@
