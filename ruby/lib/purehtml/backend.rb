# frozen_string_literal: true

require "nokogiri"

module PureHTML
  class Backend
    def load(html)
      raise NotImplementedError
    end
  end

  class Document
    def root
      raise NotImplementedError
    end

    def find(selector)
      raise NotImplementedError
    end
  end

  class Node
    def attr(name = nil)
      raise NotImplementedError
    end

    def find(selector)
      raise NotImplementedError
    end

    def html
      raise NotImplementedError
    end

    def is_selector?(selector)
      raise NotImplementedError
    end

    def text
      raise NotImplementedError
    end
  end

  class NokogiriBackend < Backend
    def load(html)
      NokogiriDocument.new(Nokogiri::HTML(html))
    end
  end

  class NokogiriDocument < Document
    attr_reader :nokogiri_doc

    def initialize(nokogiri_doc)
      @nokogiri_doc = nokogiri_doc
    end

    def root
      NokogiriNode.new(@nokogiri_doc, @nokogiri_doc)
    end

    def find(selector)
      @nokogiri_doc.css(selector).map { |node| NokogiriNode.new(@nokogiri_doc, node) }
    end
  end

  class NokogiriNode < Node
    attr_reader :doc, :node

    def initialize(doc, node)
      @doc = doc
      @node = node
    end

    def is_selector?(selector)
      return false if @node.nil? || @node.document?

      if @node.respond_to?(:matches?)
        begin
          return @node.matches?(selector)
        rescue StandardError
          # Fall through to doc.css check if matches? encounters an unsupported selector syntax
        end
      end

      @doc.css(selector).include?(@node)
    end

    def find(selector)
      nodes = if @node.document?
        @doc.css(selector)
      else
        @node.css(selector)
      end

      nodes.map { |n| NokogiriNode.new(@doc, n) }
    end

    def text
      return "" if @node.nil?

      @node.text
    end

    def html
      return nil if @node.nil?

      @node.inner_html
    end

    def attr(name = nil)
      return nil if @node.nil? || @node.document?

      if name
        @node[name]
      else
        @node.respond_to?(:attributes) ? @node.attributes.transform_values(&:value) : {}
      end
    end
  end
end
