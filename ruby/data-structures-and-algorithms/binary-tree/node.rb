class Node

	attr_reader :value

	def initialize(value)
		@value = value
	end

	def parent=(node)
		@parent = node
	end

	def parent
		@parent.nil? ? nil : @parent
	end

	def left_child
		@left_child.nil? ? nil : @left_child
	end

	def left_child=(node)
		@left_child = node
	end

	def right_child
		@right_child.nil? ? nil : @right_child
	end

	def right_child=(node)
		@right_child = node
	end

	def to_s
		@value
	end

end