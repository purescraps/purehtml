# PureHTML implementation benchmarks

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
