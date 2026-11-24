package main

import (
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"runtime"
	"time"

	purehtml "github.com/purescraps/purehtml/go"
)

func main() {
	iterations := flag.Int("iterations", 5000, "extractions to run")
	url := flag.String("url", "http://example.com", "base URL passed to the extractor")
	flag.Usage = func() {
		fmt.Fprintln(os.Stderr, "Usage: bench.go [--iterations N] [--url URL] [HTML YAML]")
		flag.PrintDefaults()
	}
	flag.Parse()

	files := flag.Args()
	if len(files) == 0 {
		dir := "."
		if _, filename, _, ok := runtime.Caller(0); ok {
			dir = filepath.Dir(filename)
		}
		files = []string{
			filepath.Join(dir, "files/sample-1.html"),
			filepath.Join(dir, "files/sample-1.yaml"),
		}
	}
	if *iterations < 1 || len(files) != 2 {
		flag.Usage()
		os.Exit(2)
	}

	if err := benchmark(files[0], files[1], *url, *iterations); err != nil {
		fmt.Fprintf(os.Stderr, "%s + %s: %v\n", files[0], files[1], err)
		os.Exit(1)
	}
}

func benchmark(htmlPath, yamlPath, url string, iterations int) error {
	htmlBytes, err := os.ReadFile(htmlPath)
	if err != nil {
		return err
	}

	yamlBytes, err := os.ReadFile(yamlPath)
	if err != nil {
		return err
	}

	config, err := purehtml.NewConfigFactory().FromYAML(string(yamlBytes))
	if err != nil {
		return err
	}

	backend := purehtml.DefaultBackend
	doc, err := backend.Load(htmlBytes)
	if err != nil {
		return err
	}

	fmt.Printf("Running benchmark for %d iterations: %s + %s\n", iterations, htmlPath, yamlPath)

	res, err := purehtml.ExtractDoc(backend, doc, config, url)
	if err != nil {
		return err
	}
	fmt.Printf("extract result: %v\n", res)

	start := time.Now()
	for i := 0; i < iterations; i++ {
		if _, err = purehtml.ExtractDoc(backend, doc, config, url); err != nil {
			return err
		}
	}
	duration := time.Since(start)
	throughput := float64(iterations) / duration.Seconds()

	fmt.Printf("Throughput: %.2f extracts/second\n", throughput)
	return nil
}
