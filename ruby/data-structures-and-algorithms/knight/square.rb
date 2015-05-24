class Square

	attr_reader :position
	attr_accessor :path

	def initialize(position)
		@position = position
		@path = []
	end


end