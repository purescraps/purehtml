.PHONY: build

build: dist

.PHONY: clean

clean:
	rm -rf dist

dist: purehtml/**/*.py
	python3 -m build

.PHONY: publish

publish:
	python3 -m twine upload dist/*
