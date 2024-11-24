package com.purescraps.purehtml;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.dataformat.yaml.YAMLMapper;
import org.everit.json.schema.*;
import org.everit.json.schema.loader.SchemaLoader;
import org.json.JSONObject;

import java.io.IOException;

public class Validator {

    public static void validate(String yamlString) {
        try {
            //String yamlString = "---\nname: John Doe\nage: 30\nactive: true";

            YAMLMapper yamlMapper = new YAMLMapper();
            JsonNode yamlJson = yamlMapper.readTree(yamlString);

            // JSON Schema
            String jsonSchemaString = """
                      {
                      "$schema": "http://json-schema.org/draft-07/schema",
                      "type": "object",
                      "$id": "config-schema.json",
                      "oneOf": [
                        {
                          "$comment": "WithSelector",
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
                                  "pattern": "^[\\\\w-]+(\\\\(([\\\\w-]+|(([\\\\w-]+\\\\s*,\\\\s*)*[\\\\w-]+))?\\\\))?$"
                                },
                                {
                                  "type": "array",
                                  "items": {
                                    "type": "string",
                                    "pattern": "^[\\\\w-]+(\\\\(([\\\\w-]+|(([\\\\w-]+\\\\s*,\\\\s*)*[\\\\w-]+))?\\\\))?$"
                                  },
                                  "minItems": 1
                                }
                              ]
                            }
                          },
                          "additionalProperties": false,
                          "allOf": [
                            {
                              "$comment": "when the \\"properties\\" present, \\"type\\" can only be \\"object\\" or not defined at all",
                              "if": { "required": ["properties"] },
                              "then": { "properties": { "type": { "const": "object" } } }
                            },
                            {
                              "$comment": "when the \\"type\\" is \\"object\\", then the \\"properties\\" MUST be defined.",
                              "if": {
                                "properties": { "type": { "const": "object" } },
                                "required": ["type"]
                              },
                              "then": { "required": ["properties"] }
                            },
                            {
                              "$comment": "objects cannot have transform",
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
                              "$comment": "when the \\"items\\" present, \\"type\\" can only be \\"array\\" or not defined at all",
                              "if": { "required": ["items"] },
                              "then": { "properties": { "type": { "const": "array" } } }
                            },
                            {
                              "$comment": "when the \\"type\\" is \\"array\\", then the \\"items\\" MUST be defined.",
                              "if": {
                                "properties": { "type": { "const": "array" } },
                                "required": ["type"]
                              },
                              "then": { "required": ["items"] }
                            }
                          ]
                        },
                        {
                          "$comment": "Union",
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
                          "$comment": "Constant",
                          "type": "object",
                          "properties": { "selector": { "type": "string" }, "constant": {} },
                          "required": ["constant"],
                          "additionalProperties": false
                        }
                      ]
                    }
                    """;

            //JSON Schema into a JSONObject
            JSONObject jsonSchema = new JSONObject(jsonSchemaString);

            // 5. Create a Schema object from the JSON Schema
            Schema schema = SchemaLoader.load(jsonSchema);

            // 6. Validate the YAML data (converted to JSON) against the schema
            JSONObject yamlJsonObject = convertJsonNodeToJSONObject(yamlJson);
            schema.validate(yamlJsonObject); // Validate

            System.out.println("YAML is valid against the JSON Schema.");

        } catch (IOException e) {
            System.out.println(e.getMessage());
        } catch (ValidationException e) {
            System.err.println("YAML is invalid: " + e.getMessage());
        }
    }
    private static JSONObject convertJsonNodeToJSONObject(JsonNode jsonNode) {
        if (jsonNode.isObject()) {
            // If it's already an object, just convert it directly
            return new JSONObject(jsonNode.toString());
        } else if (jsonNode.isArray()) {
            // If it's an array, handle it as a JSONArray
            return new JSONObject().put("array", new org.json.JSONArray(jsonNode.toString()));
        } else {
            // For scalar values, wrap them as part of a new object
            return new JSONObject().put("value", jsonNode.asText());
        }
    }
}
