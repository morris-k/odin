
module StringHelpers
	require 'active_support/inflector'

	def pluralize(number, text)
		number == 1 ? text : text.pluralize
	end
end