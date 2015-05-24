module TicTacToe

	class Player

		attr_reader :name, :token
		def initialize(name, token)
			@name = name
			@token = token
		end

		def to_s
			@name
		end
	end

end