import unittest

from purehtml import ConfigFactory, is_valid_config_yaml
from purehtml.configs.configs import Config
from purehtml.configs.types.default_value_config import DefaultValueConfig


class FakeConfig(Config):
    """A minimal Config stub that always returns a fixed value, regardless of params."""

    def __init__(self, val):
        self.val = val

    def extract(self, params):
        return self.val


class DefaultValueConfigTest(unittest.TestCase):
    def test_returns_default_when_inner_result_is_none(self):
        conf = DefaultValueConfig(FakeConfig(None), "unknown")

        self.assertEqual(conf.extract(None), "unknown")

    def test_returns_inner_result_when_not_none(self):
        conf = DefaultValueConfig(FakeConfig("actual value"), "unknown")

        self.assertEqual(conf.extract(None), "actual value")

    def test_passes_through_falsy_non_none_values(self):
        self.assertEqual(DefaultValueConfig(FakeConfig(0), "unknown").extract(None), 0)
        self.assertEqual(DefaultValueConfig(FakeConfig(""), "unknown").extract(None), "")
        self.assertEqual(
            DefaultValueConfig(FakeConfig(False), "unknown").extract(None), False
        )

    def test_default_value_can_itself_be_none(self):
        # If default is explicitly None, the result stays None (no observable change).
        conf = DefaultValueConfig(FakeConfig(None), None)

        self.assertIsNone(conf.extract(None))


class ConfigFactoryDefaultWiringTest(unittest.TestCase):
    """
    Verifies that ConfigFactory wraps the generated config with DefaultValueConfig
    whenever a `default` key is present in the plain config dict, for every
    config type (primitive, object, array, union, constant).
    """

    def test_wraps_primitive_config_when_default_present(self):
        config = ConfigFactory.from_dict({"selector": ".foo", "default": "unknown"})

        self.assertIsInstance(config, DefaultValueConfig)

    def test_wraps_object_config_when_default_present(self):
        config = ConfigFactory.from_dict(
            {
                "selector": ".foo",
                "properties": {"x": {"selector": ".x"}},
                "default": {},
            }
        )

        self.assertIsInstance(config, DefaultValueConfig)

    def test_wraps_array_config_when_default_present(self):
        config = ConfigFactory.from_dict(
            {"selector": ".foo", "items": {"selector": ".tt"}, "default": []}
        )

        self.assertIsInstance(config, DefaultValueConfig)

    def test_wraps_union_config_when_default_present(self):
        config = ConfigFactory.from_dict(
            {"union": [{"selector": ".foo"}], "default": "unknown"}
        )

        self.assertIsInstance(config, DefaultValueConfig)

    def test_wraps_constant_config_when_default_present(self):
        config = ConfigFactory.from_dict(
            {"selector": ".foo", "constant": "bar", "default": "unknown"}
        )

        self.assertIsInstance(config, DefaultValueConfig)

    def test_does_not_wrap_when_default_absent(self):
        config = ConfigFactory.from_dict({"selector": ".foo"})

        self.assertNotIsInstance(config, DefaultValueConfig)

    def test_wraps_even_when_default_value_is_falsy(self):
        # `"default" in plain` semantics: presence matters, not truthiness.
        for falsy_default in (0, False, "", None, []):
            with self.subTest(falsy_default=falsy_default):
                config = ConfigFactory.from_dict(
                    {"selector": ".foo", "default": falsy_default}
                )

                self.assertIsInstance(config, DefaultValueConfig)
                self.assertEqual(config.default_value, falsy_default)


class DefaultSchemaValidationTest(unittest.TestCase):
    """
    Mirrors the TypeScript config-schema.test.ts "Default" describe block:
    `default` must validate on every config type, with any value type.
    """

    def test_allowed_on_primitive(self):
        self.assertTrue(
            is_valid_config_yaml("selector: .foo\ndefault: unknown\n")
        )

    def test_allows_any_value_type(self):
        self.assertTrue(is_valid_config_yaml("selector: .foo\ndefault: 0\n"))
        self.assertTrue(is_valid_config_yaml("selector: .foo\ndefault: false\n"))
        self.assertTrue(is_valid_config_yaml("selector: .foo\ndefault: null\n"))
        self.assertTrue(
            is_valid_config_yaml("selector: .foo\ndefault:\n  foo: bar\n")
        )
        self.assertTrue(
            is_valid_config_yaml("selector: .foo\ndefault:\n  - foo\n")
        )

    def test_allowed_on_object(self):
        self.assertTrue(
            is_valid_config_yaml(
                "selector: .foo\n"
                "type: object\n"
                "properties:\n"
                "  x:\n"
                "    selector: .x\n"
                "default: {}\n"
            )
        )

    def test_allowed_on_array(self):
        self.assertTrue(
            is_valid_config_yaml(
                "selector: .foo\nitems:\n  selector: .tt\ndefault: []\n"
            )
        )

    def test_allowed_on_union(self):
        self.assertTrue(
            is_valid_config_yaml(
                "union:\n  - selector: .foo\ndefault: unknown\n"
            )
        )

    def test_allowed_on_constant(self):
        self.assertTrue(
            is_valid_config_yaml(
                "selector: .foo\nconstant: bar\ndefault: unknown\n"
            )
        )


if __name__ == "__main__":
    unittest.main()
