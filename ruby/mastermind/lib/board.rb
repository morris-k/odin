require 'paint'
module Mastermind
	require_relative 'board_pegs.rb'
	class Board
		attr_accessor :decoder, :code_pegs, :guess_pegs
		attr_reader :number_of_rows
		def initialize
			@decoder = []
			@code_pegs = []
			@guess_pegs = []
			@number_of_rows = set_number_of_rows
		end

		def paint_peg(peg)
			Paint[peg.uc, peg.color]
		end

		def hidden_row
			BoardPegs.hidden_row
		end


		def update(guess_row, results)
			peg_row = BoardPegs.create_row(guess_row.concat(results))
			guess_pegs << peg_row
		end

		def formatted_guess_pegs
			rows = []
			@number_of_rows.times do |i|
				@guess_pegs[i].nil? ? rows << BoardPegs.blank_row : rows << @guess_pegs[i]
			end
			rows
		end

		def set_number_of_rows(guesses=12)
			@number_of_rows = guesses
		end

		def set_code_pegs(pegs)
			@code_pegs = pegs
		end

		def display_without_code
			decoder << hidden_row
			display
		end

		def display_with_code
			decoder << code_pegs
			display
		end

		def reset
			@decoder = []
		end

		def display
			decoder.concat(formatted_guess_pegs.reverse)
			decoder.each do |row|
				puts "      " + row.map{|x| paint_peg(x) }.join("  ")
			end
			reset
		end
	end
end