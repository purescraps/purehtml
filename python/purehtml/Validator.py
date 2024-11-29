import json
import yaml
from jsonschema import validate, ValidationError

class Validator:

    @staticmethod
    def validate(yaml_string):
        try:
            # The JSON schema with proper escaping
            json_schema_string = r"""
                {
                  "$schema": "http://json-schema.org/draft-07/schema",
                  "type": "object",
                  "$id": "config-schema.json",
                  "oneOf": [
                    {
                      "properties": {
                        "selector": {
                          "oneOf": [
                            { "type": "string", "minLength": 1 },
                            {
                              "type": "array",
                              "items": {
                                "oneOf": [
                                  { "type": "string" },
                                  {
                                    "type": "object",
                                    "properties": {
                                      "selector": { "type": "string" },
                                      "sampleHTMLs": {
                                        "type": "array",
                                        "items": { "type": "string" }
                                      }
                                    }
                                  }
                                ]
                              },
                              "minItems": 1
                            },
                            {
                              "type": "object",
                              "properties": {
                                "selector": { "type": "string" },
                                "sampleHTMLs": {
                                  "type": "array",
                                  "items": { "type": "string" }
                                }
                              }
                            }
                          ]
                        },
                        "type": {
                          "type": "string",
                          "enum": ["string", "object", "array", "union"]
                        },
                        "items": { "$ref": "config-schema.json" },
                        "properties": {
                          "type": "object",
                          "additionalProperties": { "$ref": "config-schema.json" }
                        },
                        "transform": {
                          "oneOf": [
                            {
                              "type": "string",
                              "pattern": "^[\\w-]+(\\([\\w-]+|([\\w-]+\\s*,\\s*)*[\\w-]+\\))?$"
                            },
                            {
                              "type": "array",
                              "items": {
                                "type": "string",
                                "pattern": "^[\\w-]+(\\([\\w-]+|([\\w-]+\\s*,\\s*)*[\\w-]+\\))?$"
                              },
                              "minItems": 1
                            }
                          ]
                        }
                      },
                      "additionalProperties": false,
                      "allOf": [
                        {
                          "if": { "required": ["properties"] },
                          "then": { "properties": { "type": { "const": "object" } } }
                        },
                        {
                          "if": {
                            "properties": { "type": { "const": "object" } },
                            "required": ["type"]
                          },
                          "then": { "required": ["properties"] }
                        },
                        {
                          "if": {
                            "anyOf": [
                              {
                                "properties": { "type": { "const": "object" } },
                                "required": ["type"]
                              },
                              { "required": ["properties"] }
                            ]
                          },
                          "then": {
                            "allOf": [
                              { "required": ["properties"] },
                              { "not": { "required": ["transform"] } }
                            ]
                          }
                        },
                        {
                          "if": { "required": ["items"] },
                          "then": { "properties": { "type": { "const": "array" } } }
                        },
                        {
                          "if": {
                            "properties": { "type": { "const": "array" } },
                            "required": ["type"]
                          },
                          "then": { "required": ["items"] }
                        }
                      ]
                    },
                    {
                      "type": "object",
                      "properties": {
                        "union": {
                          "type": "array",
                          "items": { "$ref": "config-schema.json" },
                          "minItems": 1
                        }
                      },
                      "required": ["union"],
                      "additionalProperties": false
                    },
                    {
                      "type": "object",
                      "properties": { "selector": { "type": "string" }, "constant": {} },
                      "required": ["constant"],
                      "additionalProperties": false
                    }
                  ]
                }
                """

            # Parse YAML string
            yaml_node = yaml.safe_load(yaml_string)

            # Convert YAML to JSON string
            json_string = json.dumps(yaml_node)

            # Load the JSON schema
            json_schema = json.loads(json_schema_string)

            # Validate the YAML (now in JSON format) against the schema
            validate(instance=json.loads(json_string), schema=json_schema)

            print("Validation successful!")

        except yaml.YAMLError as e:
            print(f"YAML Parsing Error: {e}")
        except ValidationError as e:
            print(f"YAML is invalid: {e.message}")
            print(f"Validation Errors: {e.context}")
        except Exception as e:
            print(f"Unexpected Error: {e}")
