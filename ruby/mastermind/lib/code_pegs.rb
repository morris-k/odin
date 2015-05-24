module Mastermind
	require_relative 'peg.rb'
	class CodePegs

		@@colors = [:red, :blue, :green, :yellow, :magenta, :cyan]

		def initialize
		end

		def CodePegs.colors
			@@colors
		end

		def CodePegs.create_code_pegs
			pegs = []
			4.times do 
				pegs << Peg.new("\u25CF", @@colors.shuffle[0])
			end
			pegs
		end

		def CodePegs.create_row(cols)
			pegs = []
				cols.each do |color|
					pegs << Peg.regular(color)
				end
			pegs
		end

	end
end
# cp = Mastermind::CodePegs
# puts cp.create_row([:blue, :red, :green, :yellow]).length