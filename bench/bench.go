package main

import (
	"fmt"
	"os"
	"path/filepath"
	"runtime"
	"time"

	purehtml "github.com/purescraps/purehtml/go"
)

func main() {
	iterations := 5000

	_, filename, _, ok := runtime.Caller(0)
	dir := "."
	if ok {
		dir = filepath.Dir(filename)
	}

	yamlBytes, err := os.ReadFile(filepath.Join(dir, "files/sample-1.yaml"))
	if err != nil {
		panic(err)
	}

	htmlBytes, err := os.ReadFile(filepath.Join(dir, "files/sample-1.html"))
	if err != nil {
		panic(err)
	}

	factory := purehtml.NewConfigFactory()
	config, err := factory.FromYAML(string(yamlBytes))
	if err != nil {
		panic(err)
	}

	backend := purehtml.DefaultBackend
	doc, err := backend.Load(htmlBytes)
	if err != nil {
		panic(err)
	}

	fmt.Printf("Running benchmark for %d iterations.\n", iterations)

	res, err := purehtml.ExtractDoc(backend, doc, config, "http://example.com")
	if err != nil {
		panic(err)
	}
	fmt.Printf("extract result: %v\n", res)

	start := time.Now()
	for i := 0; i < iterations; i++ {
		_, err = purehtml.ExtractDoc(backend, doc, config, "http://example.com")
		if err != nil {
			panic(err)
		}
	}
	duration := time.Since(start)
	throughput := float64(iterations) / duration.Seconds()

	fmt.Printf("Throughput: %.2f extracts/second\n", throughput)
}
