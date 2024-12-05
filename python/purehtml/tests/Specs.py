import json
import yaml
from pathlib import Path
from jsonschema import validate, ValidationError

from purehtml.PureHTML import PureHTML
from purehtml.configs.ConfigFactory import ConfigFactory


def run():

    # Directory containing the YAML specs
    specs_dir = Path("../specs")
    try:
        for file_path in specs_dir.rglob("*"):

            if file_path.is_file():  # Process only files
                try:
                    # If validation is successful, continue processing
                    if validate_file(file_path):
                        with file_path.open("r", encoding="utf-8") as file:
                            content = file.read()

                        yaml_map = yaml.safe_load(content)
                        specs = yaml_map.get("specs", [])

                        for spec in specs:
                            html = spec.get("input", "")
                            configuration = spec.get("configuration", {})
                            # Create the config object
                            config = ConfigFactory.from_dict(configuration)

                            # Extract the answer using PureHTML
                            answer = PureHTML.extract(config, html, configuration)

                            # Get the expected values
                            expected = spec.get("expected", [])
                            expected_object = str(json.loads(json.dumps(expected)))
                            if answer == "[]":
                                answer = "None"
                            if str(answer) != str(expected_object):
                                print(f"Incorrect values at: {file_path}")
                                print(f"Description: {spec.get('description')}")
                                print(f"Extracted Values: {answer}")
                                print(f"Expected Values : {expected_object}")
                            else:
                                # Uncomment the line below to skip successful outputs
                                print(f"Success: {file_path}")
                                #print(f"Extracted Values: {answer}")
                                #print(f"Expected Values : {expected_object}")

                except Exception as e:
                    print(f"Error reading file: {file_path} - {str(e)}")

    except Exception as e:
        print(f"Error walking file tree: {str(e)}")


def validate_file(yaml_file_path: Path) -> bool:
    """
    Validate a YAML file against the schema.
    :param yaml_file_path: Path to the YAML file.
    :return: True if valid, False otherwise.
    """
    schema_path = Path("../spec.schema.yaml")

    try:
        # Load the schema
        with schema_path.open("r", encoding="utf-8") as schema_file:
            schema_object = yaml.safe_load(schema_file)

        # Convert schema to JSON
        schema_json = json.loads(json.dumps(schema_object))

        # Load the YAML content
        with yaml_file_path.open("r", encoding="utf-8") as yaml_file:
            yaml_content = yaml.safe_load(yaml_file)

        # Validate the YAML content against the schema
        validate(instance=yaml_content, schema=schema_json)
        return True

    except FileNotFoundError as e:
        print(e)
        return False

    except ValidationError as e:
        print(f"Validation Error: {e.message} - File: {yaml_file_path}")
        return False

    except Exception as e:
        print(f"File: {yaml_file_path} - {str(e)}")
        return False


