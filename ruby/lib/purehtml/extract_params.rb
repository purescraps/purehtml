# frozen_string_literal: true

module PureHTML
  class ExtractParams
    attr_reader :doc, :el, :url, :property, :val, :element_already_matched

    def initialize(doc:, el:, url: "", property: "", val: nil, element_already_matched: false)
      @doc = doc
      @el = el
      @url = url
      @property = property
      @val = val
      @element_already_matched = element_already_matched
    end

    def dup_with(doc: nil, el: nil, url: nil, property: nil, val: nil, element_already_matched: nil)
      ExtractParams.new(
        doc: doc || @doc,
        el: el.nil? ? @el : el,
        url: url || @url,
        property: property || @property,
        val: val.nil? ? @val : val,
        element_already_matched: element_already_matched.nil? ? @element_already_matched : element_already_matched
      )
    end
  end
end
