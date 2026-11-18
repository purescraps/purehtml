# frozen_string_literal: true

require_relative "../transformer"
require_relative "../errors"

module PureHTML
  module Transformers
    class KeySegment
      attr_reader :key

      def initialize(key)
        @key = key
      end
    end

    class IndexSegment
      attr_reader :index

      def initialize(index)
        @index = index
      end
    end

    class JsonpathTransformer < Transformer
      def self.transformer_name
        "jsonpath"
      end

      def transform(params)
        val = params.val
        return nil if val.nil?

        if @args.empty?
          raise InvalidParseInputError.new('jsonpath: requires a path, e.g. jsonpath("$.a.b")', property: params.property, value: val)
        end

        segments = parse_path(@args[0])
        evaluate_path(val, segments)
      end

      private

      def parse_path(path)
        raise "jsonpath: invalid path #{path.inspect}: must start with \"$\"" unless path.start_with?("$")

        segments = []
        i = 1
        n = path.length

        while i < n
          ch = path[i]
          if ch == "."
            i += 1
            start = i
            while i < n && path[i] =~ /[a-zA-Z0-9_]/
              i += 1
            end
            raise "jsonpath: invalid path #{path.inspect}: expected a name after \".\"" if i == start

            segments << KeySegment.new(path[start...i])
          elsif ch == "["
            i += 1
            raise "jsonpath: invalid path #{path.inspect}: unterminated \"[\"" if i >= n

            if path[i] == "\"" || path[i] == "'"
              quote = path[i]
              i += 1
              chars = []
              while i < n && path[i] != quote
                if path[i] == "\\" && i + 1 < n && (path[i + 1] == quote || path[i + 1] == "\\")
                  chars << path[i + 1]
                  i += 2
                else
                  chars << path[i]
                  i += 1
                end
              end
              raise "jsonpath: invalid path #{path.inspect}: unterminated quoted key" if i >= n

              i += 1 # skip closing quote
              segments << KeySegment.new(chars.join)
            elsif path[i] == "-" || path[i] =~ /\d/
              start = i
              i += 1 if path[i] == "-"
              digits_start = i
              while i < n && path[i] =~ /\d/
                i += 1
              end
              raise "jsonpath: invalid path #{path.inspect}: expected an index inside \"[]\"" if i == digits_start

              segments << IndexSegment.new(path[start...i].to_i)
            else
              raise "jsonpath: invalid path #{path.inspect}: expected an index or quoted key inside \"[]\""
            end

            raise "jsonpath: invalid path #{path.inspect}: expected \"]\"" if i >= n || path[i] != "]"

            i += 1
          else
            raise "jsonpath: invalid path #{path.inspect}: unexpected character #{ch.inspect} at position #{i}"
          end
        end

        segments
      end

      def evaluate_path(root, segments)
        current = root

        segments.each do |segment|
          return nil if current.nil?

          if segment.is_a?(IndexSegment)
            return nil unless current.is_a?(Array)

            index = segment.index
            index += current.length if index < 0
            return nil if index < 0 || index >= current.length

            current = current[index]
          else
            return nil unless current.is_a?(Hash)

            key = segment.key
            if current.key?(key)
              current = current[key]
            elsif current.key?(key.to_sym)
              current = current[key.to_sym]
            else
              return nil
            end
          end
        end

        current
      end
    end
  end
end
