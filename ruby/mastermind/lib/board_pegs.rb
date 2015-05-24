module Mastermind
	require_relative 'peg.rb'
	class BoardPegs

		@@options = [:match, :partial, :blank]

		def initialize
		end

		def BoardPegs.create_row(cols)
			pegs = []
				cols.each do |color|
					pegs << Peg.regular(color)
				end
			pegs
		end

		def BoardPegs.blank_row
			row = []
			4.times do 
				row << Peg.blank
			end
			row
		end


		def BoardPegs.hidden_row
			row = []
			4.times do 
				row << Peg.hidden
			end
			row
		end

	end
end