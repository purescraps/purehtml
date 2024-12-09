package org.purescraps.purehtml;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import org.everit.json.schema.Schema;
import org.everit.json.schema.ValidationException;
import org.everit.json.schema.loader.SchemaLoader;
import org.json.JSONObject;

import java.io.IOException;

public class Validator {

    public static boolean validate(String yamlString) {
        try {
            String jsonSchemaString = """
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
                    """;

            ObjectMapper yamlReader = new ObjectMapper(new YAMLFactory());
            ObjectMapper jsonWriter = new ObjectMapper();
            JsonNode yamlNode = yamlReader.readTree(yamlString);
            String jsonString = jsonWriter.writeValueAsString(yamlNode);
            // Parse JSON Schema
            JSONObject jsonSchema = new JSONObject(jsonSchemaString);
            Schema schema = SchemaLoader.load(jsonSchema);
            JSONObject jsonData = new JSONObject(jsonString);
            schema.validate(jsonData);
            return true;

        } catch (IOException e) {
            System.out.println(e.getMessage());
            return false;
        } catch (ValidationException e) {
            System.err.println("YAML is invalid: " + e.getAllMessages());
            return false;
        }
    }
}
