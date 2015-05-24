module Mastermind
	require_relative 'player.rb'
	require_relative 'board.rb'
	require_relative 'code_maker.rb'
	require_relative 'extensions/array_methods.rb'
	require_relative 'extensions/string_methods.rb'
	class Game
	include StringHelpers

		attr_reader :board, :player, :codemaker
		attr_accessor :guesses

		def initialize
			@player = Player.new
			@codemaker = CodeMaker.new
			@board = Board.new
		end 

		def greet
			puts "Mastermind!!"
			puts
			play
		end

		def still_playing
			@guesses > 0
		end

		def player_guessing?(guesser)
			guesser == "player"
		end

		def set_code(guesser)
			if player_guessing?(guesser)
				player_code
			else
			end
		end

		def player_code
			add_code_to_board(code_pegs)
		end

		def add_code_to_board(pegs)
			@board.set_code_pegs(pegs)
		end

		def player_guessing
			code_pegs = @codemaker.set_code_pegs
			add_code_to_board(code_pegs)
			while still_playing
				results = player_guessing_round
				if results.count(:black) == 4
					player_wins
					break
				else
					@guesses -= 1
					if @guesses == 0
						player_loses
						break
					end
				end
			end
		end

		def player_guessing_round
			@board.display_without_code
			puts "#{@guesses} #{pluralize(@guesses, 'guess')} left"
			guess_row = @player.guess
			results = @codemaker.results(guess_row)
			@board.update(guess_row, results)
			results
		end


		def play(guesser = "player")
			guess_num = @player.ask_for_guess_number
			@guesses = guess_num
			@board.set_number_of_rows(guess_num)
			if player_guessing?(guesser)
				player_guessing
			end
		end

		def player_wins
			@board.display_with_code
			puts "You won!"
		end

		def player_loses
			@board.display_with_code
			puts "You lose...HA"
		end

	end
end
