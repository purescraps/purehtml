# frozen_string_literal: true

require_relative "transformers"
require_relative "errors"

module PureHTML
  class TransformerFactory
    def self.create(def_str)
      name, args = parse_definition(def_str)
      klass = Transformers.get(name)
      unless klass
        raise Error, "Transformer with name #{name.inspect} not found."
      end

      klass.new(args)
    end

    def self.parse_definition(def_str)
      open_idx = def_str.index("(")
      if open_idx.nil?
        [def_str.strip, []]
      else
        close_idx = def_str.rindex(")")
        name = def_str[0...open_idx].strip
        args_str = def_str[(open_idx + 1)...close_idx]
        [name, parse_arg_list(args_str)]
      end
    end

    def self.parse_arg_list(args_str)
      args = []
      i = 0
      n = args_str.length

      while i < n
        while i < n && args_str[i] =~ /\s/
          i += 1
        end
        break if i >= n

        ch = args_str[i]
        if ch == "\"" || ch == "'"
          quote = ch
          i += 1
          chars = []
          while i < n && args_str[i] != quote
            if args_str[i] == "\\" && i + 1 < n && (args_str[i + 1] == quote || args_str[i + 1] == "\\")
              chars << args_str[i + 1]
              i += 2
            else
              chars << args_str[i]
              i += 1
            end
          end
          i += 1 # skip closing quote
          args << chars.join
        else
          start = i
          while i < n && args_str[i] != ","
            i += 1
          end
          args << args_str[start...i].strip
        end

        while i < n && args_str[i] =~ /\s/
          i += 1
        end
        if i < n && args_str[i] == ","
          i += 1
        end
      end

      args
    end
  end
end
