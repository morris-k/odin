require 'paint'

module Mastermind
	require_relative 'extensions/array_methods.rb'
	require_relative 'code_pegs.rb'
	class Player
 
		def initialize
		end

		def colors 
			["red", "blue", "green", "yellow", "magenta", "cyan"]
		end

		def painted(color)
			Paint["\u2588", color.to_sym]
		end

		def ask_for_peg(i)
			puts "Pick a color for peg #{i}:"
		end

		def show_peg_options
			puts colors.map{|x| "#{colors.index(x) + 1} = #{painted(x)}" }.join(", ")
		end

		def ask_for_pegs(invalid_message)
			pegs = []
			i = 1
			show_peg_options
			while i < 5 do 
				ask_for_peg(i)
				input = gets.chomp
				if validate_input(input)
					pegs << convert_input_type(input).to_sym
					i += 1
					puts pegs.map{|x| painted(x)}.join(" ")
				else
					puts invalid_message
				end
			end
			pegs
		end

		def ask_for_guess_number
			guesses = 0
			loop do 
				puts "How many guesses do you want? (4 - 12)"
				num = gets.chomp.to_i
				guesses = num
				if num.between?(4, 12)
					return guesses
				end
				puts 'Pick a better number...'
			end
		end

		def make_code_pegs
			ask_for_pegs("I'll never guess that...")
		end

		def guess
			ask_for_pegs("That's definitely not on the board...")
		end

		def validate_input(input)
			is_a_valid_color(input) || is_num_in_range(input.to_i)
		end

		def is_num_in_range(input)
			input.between?(1, 6)
		end

		def color_from_index(i)
			colors[i - 1]
		end

		def is_a_valid_color(input)
			colors.include?(input)
		end

		def convert_input_type(input)
			(input =~ /\d/).nil? ? input : color_from_index(input.to_i)
		end

	end
end

