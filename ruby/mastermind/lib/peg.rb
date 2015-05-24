module Mastermind
	class Peg

		attr_reader :uc, :color

		def initialize(uc, color)
			@uc = uc
			@color = color
		end

		def to_s
			color
		end

		def Peg.regular(color)
			Peg.new("\u25CF", color.to_sym)
		end

		def Peg.blank
			Peg.new("\u25CB", :black)
		end

		def Peg.hidden
			Peg.new("\u2588", :black)
		end

	end
end