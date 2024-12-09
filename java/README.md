# PureHTML Java implementation

We use maven for dependency management.

1. Install the dependencies: `mvn install`

### Development

Make sure you have `maven` installed in your environment.

Install the dependencies:

```sh
mvn install
```

Package the jars:

```sh
mvn clean package
```

Run the tests:

```sh
java -jar target/jar/RunSpecs.jar
```

Those tests use the common test specifications of the PureHTML library. Test specifications can be found in `https://github.com/purescraps/purehtml/tree/master/specs`
