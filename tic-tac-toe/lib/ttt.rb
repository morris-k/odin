module TicTacToe
	require './board.rb'
	require './player.rb'
	require './game.rb'

	g = TicTacToe::Game.new
	g.play
end