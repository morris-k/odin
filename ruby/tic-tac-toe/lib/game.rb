module TicTacToe
	class Game
		attr_accessor :board, :players, :current_player
		def initialize
			@board = TicTacToe::Board.new
			@players = [TicTacToe::Player.new("Player 1", "X"), TicTacToe::Player.new("Player 2", "O")]
			@current_player = @players.shift
		end

		def ask
			puts "what square?"
		end

		def switch_players
			@players.push(@current_player)
			@current_player = @players.shift
		end

		def replay
			@board = TicTacToe::Board.new
			@players = [TicTacToe::Player.new("Player 1", "X"), TicTacToe::Player.new("Player 2", "O")]
			@current_player = @players.shift
			play
		end

		def game_over
			puts "Play again? (y/n)"
			loop do
				a = gets.chomp.downcase
				if a == 'y'
					return replay
				elsif a == 'n'
					puts 'Bye!'
					break
				else
					puts 'please enter y or n'
				end
			end

		end

		def play
			@board.print
			loop do
				ask
				input = gets.chomp
				if input == "quit"
					break;
				end
				update = @board.update_square(input, @current_player.token)
				puts update[1]
				@board.print
				if update[0]
					check = @board.check_win(@current_player.token)
					if check[0]
						switch_players
					else
						if check[1] == 'win'
							puts "#{@current_player.to_s} wins!"
						else
							puts "It's a draw"
						end
						game_over
						break
					end
				end
			end
		end
	end
end