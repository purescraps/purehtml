import json
import yaml
from pathlib import Path
from jsonschema import validate, ValidationError
from purehtml import extract, ConfigFactory


def run():
    """Main function to walk through specs directory and process files."""
    repo_root = Path(__file__).resolve().parent.parent.parent
    specs_dir = repo_root / "specs"

    try:
        for file_path in specs_dir.rglob("*"):
            if file_path.is_file():  # Process only files
                process_file(file_path)

    except Exception as e:
        print(f"Exception: {str(e)}")


def process_file(file_path: Path):
    """Process each file in the specs' directory."""
    try:
        if validate_file(file_path):
            content = read_file(file_path)
            specs = parse_yaml(content)
            process_specs(specs, file_path)

    except Exception as e:
        print(f"Exception: {file_path} - {str(e)}")


def read_file(file_path: Path) -> str:
    """Read the content of a YAML file."""
    with file_path.open("r", encoding="utf-8") as file:
        return file.read()


def parse_yaml(content: str) -> list:
    """Parse YAML content to retrieve the 'specs'."""
    yaml_map = yaml.safe_load(content)
    return yaml_map.get("specs", [])


def process_specs(specs: list, file_path: Path):
    """Process each spec in the YAML file."""
    for spec in specs:
        html = spec.get("input", "")
        configuration = spec.get("configuration", {})

        # Create the config object
        config = ConfigFactory.fromYAML(configuration)

        # Extract the answer using PureHTML
        answer = extract(config, html, "http://example.com")

        expected = spec.get("expected", [])
        expected_object = str(json.loads(json.dumps(expected)))

        if answer == "[]":
            answer = "None"

        compare_values(answer, expected_object, file_path, spec)


def compare_values(answer, expected_object, file_path, spec):
    """Compare extracted answer and expected values, and report result."""
    if str(answer) != str(expected_object):
        report_incorrect_values(file_path, spec, answer, expected_object)
    else:
        print(f"Success: {file_path}")


def report_incorrect_values(file_path, spec, answer, expected_object):
    """Print the incorrect values for debugging."""
    print(f"Incorrect values at: {file_path}")
    print(f"Description: {spec.get('description')}")
    print(f"Extracted Values: {answer}")
    print(f"Expected Values: {expected_object}")
    print("")


def validate_file(yaml_file_path: Path) -> bool:
    """Validate a YAML file against the schema."""
    repo_root = Path(__file__).resolve().parent.parent.parent
    schema_path = repo_root / "spec.schema.yaml"

    try:
        schema_object = load_schema(schema_path)
        yaml_content = load_yaml(yaml_file_path)

        # Convert schema to JSON
        schema_json = json.loads(json.dumps(schema_object))

        # Validate YAML content against the schema
        validate(instance=yaml_content, schema=schema_json)
        return True

    except Exception as e:
        handle_validation_error(yaml_file_path, e)
        return False


def load_schema(schema_path: Path):
    """Load the schema file."""
    with schema_path.open("r", encoding="utf-8") as schema_file:
        return yaml.safe_load(schema_file)


def load_yaml(yaml_file_path: Path):
    """Load the YAML content from a file."""
    with yaml_file_path.open("r", encoding="utf-8") as yaml_file:
        return yaml.safe_load(yaml_file)


def handle_validation_error(yaml_file_path: Path, exception: Exception):
    """Handle validation errors and print appropriate messages."""
    if isinstance(exception, FileNotFoundError):
        print(f"File not found: {yaml_file_path}")
    elif isinstance(exception, ValidationError):
        print(f"Validation Error: {exception.message} - File: {yaml_file_path}")
    else:
        print(f"Error processing file: {yaml_file_path} - {str(exception)}")


# Run the test
run()
