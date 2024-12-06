import json
import yaml
from pathlib import Path
from jsonschema import validate, ValidationError
from purehtml import extract, ConfigFactory


def run():
    """Main function to walk through specs directory and process files."""
    repo_root = Path(__file__).resolve().parent.parent
    specs_dir = repo_root / "specs"

    try:
        for file_path in specs_dir.rglob("*"):
            if file_path.is_file():  # Process only files
                process_file(specs_dir, file_path)

    except Exception as e:
        print(f"Exception: {str(e)}")


def process_file(base_dir: Path, file_path: Path):
    """Process each file in the specs' directory."""
    relative_path = file_path.name.replace(base_dir.name, "")

    print(f"\nProcessing: {relative_path}")

    is_valid = validate_file(file_path)

    if not is_valid:
        print(
            f"File does not seem to be a valid test specification. Skipping {relative_path}"
        )
        return

    try:
        content = read_file(file_path)
        specs = parse_yaml(content)

        process_specs(specs, relative_path)

        print(f"Done: {relative_path}")

    except Exception as e:
        print(f"Test failed: {relative_path}: {str(e)}")


def read_file(file_path: Path) -> str:
    """Read the content of a YAML file."""
    with file_path.open("r", encoding="utf-8") as file:
        return file.read()


def parse_yaml(content: str) -> list:
    """Parse YAML content to retrieve the 'specs'."""
    yaml_map = yaml.safe_load(content)
    return yaml_map.get("specs", [])


def process_specs(specs: list, file_path: str):
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
    if str(answer) == str(expected_object):
        print(f"  ✔️ {spec.get('description')}")
    else:
        print(f"  ❌ {spec.get('description')}")
        report_incorrect_values(answer, expected_object)


def report_incorrect_values(answer, expected_object):
    """Print the incorrect values for debugging."""

    print(f"    Extracted: {answer}")
    print(f"    Expected: {expected_object}")

    raise Exception("Extracted value did not match the expected")


def validate_file(yaml_file_path: Path) -> bool:
    """Validate a YAML file against the schema."""
    repo_root = Path(__file__).resolve().parent.parent
    schema_path = repo_root / "spec.schema.yaml"

    schema_object = load_schema(schema_path)
    yaml_content = load_yaml(yaml_file_path)

    try:
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
