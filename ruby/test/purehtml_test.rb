# frozen_string_literal: true

require_relative "test_helper"

class PureHTMLTest < Minitest::Test
  def test_version
    refute_nil PureHTML::VERSION
  end

  def test_extract_basic_string
    html = "<div><span class='title'>Hello World</span></div>"
    yaml = "selector: .title\ntransform: trim"
    config = PureHTML::ConfigFactory.from_yaml(yaml)
    result = PureHTML.extract(config, html)
    assert_equal "Hello World", result
  end

  def test_extract_from_file_and_hash
    html = "<div><span class='qty'>100</span></div>"
    config = PureHTML::ConfigFactory.from_hash({
      "selector" => ".qty",
      "type" => "number"
    })
    result = PureHTML.extract(config, html)
    assert_equal 100, result
  end

  def test_constant_config
    html = "<div><span>experiment</span></div>"
    config = PureHTML::ConfigFactory.from_hash({
      "constant" => "fixed_val"
    })
    result = PureHTML.extract(config, html)
    assert_equal "fixed_val", result

    config_with_matching = PureHTML::ConfigFactory.from_hash({
      "selector" => "span",
      "constant" => { "custom" => "object" }
    })
    assert_equal({ "custom" => "object" }, PureHTML.extract(config_with_matching, html))

    config_with_non_matching = PureHTML::ConfigFactory.from_hash({
      "selector" => "p",
      "constant" => { "custom" => "object" }
    })
    assert_nil PureHTML.extract(config_with_non_matching, html)
  end

  def test_url_query_param_transformer
    html = <<~HTML
      <div id="main">
        <a id="link1" href="https://google.com/search?q=Ruby&clientId=abc">Search Ruby</a>
        <a id="link2" href="https://duckduckgo.com/search?q=Ruby&from=searchBar">Search DDG</a>
        <a id="link3" href="https://example.com/some/page">Plain</a>
      </div>
    HTML

    # All query params
    yaml_all = <<~YAML
      selector: '#main a'
      items:
        transform: [attr(href), urlQueryParam]
    YAML
    conf_all = PureHTML::ConfigFactory.from_yaml(yaml_all)
    result_all = PureHTML.extract(conf_all, html)
    expected_all = [
      { "clientId" => "abc", "q" => "Ruby" },
      { "from" => "searchBar", "q" => "Ruby" },
      {}
    ]
    assert_equal expected_all, result_all

    # Single query param
    yaml_single = <<~YAML
      selector: '#main a'
      items:
        transform: [attr(href), urlQueryParam(q)]
    YAML
    conf_single = PureHTML::ConfigFactory.from_yaml(yaml_single)
    result_single = PureHTML.extract(conf_single, html)
    expected_single = ["Ruby", "Ruby", nil]
    assert_equal expected_single, result_single
  end

  def test_attr_transformer_empty_and_multiple
    html = '<div id="test" data-a="1" data-b="2"></div>'

    # Single attr
    conf1 = PureHTML::ConfigFactory.from_hash({ "selector" => "#test", "transform" => "attr(id)" })
    assert_equal "test", PureHTML.extract(conf1, html)

    # Missing attr
    conf2 = PureHTML::ConfigFactory.from_hash({ "selector" => "#test", "transform" => "attr(missing)" })
    assert_nil PureHTML.extract(conf2, html)

    # All attrs via attr()
    conf3 = PureHTML::ConfigFactory.from_hash({ "selector" => "#test", "transform" => "attr()" })
    expected_attrs = { "id" => "test", "data-a" => "1", "data-b" => "2" }
    assert_equal expected_attrs, PureHTML.extract(conf3, html)

    # Multiple specified attrs
    conf4 = PureHTML::ConfigFactory.from_hash({ "selector" => "#test", "transform" => "attr(data-a, data-b, non_existing)" })
    expected_multi = { "data-a" => "1", "data-b" => "2", "non_existing" => nil }
    assert_equal expected_multi, PureHTML.extract(conf4, html)
  end

  def test_array_with_nested_objects
    html = <<~HTML
      <ul>
        <li><span class="name">Apple</span><span class="price">1.50</span></li>
        <li><span class="name">Banana</span><span class="price">0.75</span></li>
      </ul>
    HTML

    yaml = <<~YAML
      selector: ul li
      type: array
      items:
        properties:
          name:
            selector: .name
            transform: trim
          price:
            selector: .price
            type: number
    YAML

    config = PureHTML::ConfigFactory.from_yaml(yaml)
    result = PureHTML.extract(config, html)
    expected = [
      { "name" => "Apple", "price" => 1.5 },
      { "name" => "Banana", "price" => 0.75 }
    ]
    assert_equal expected, result
  end
end
