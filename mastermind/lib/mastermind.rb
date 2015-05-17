module Mastermind

end

require_relative 'extensions/array_methods.rb'
require_relative 'extensions/string_methods.rb'
require_relative 'game.rb'
require_relative 'board_pegs.rb'
require_relative 'code_maker.rb'
require_relative 'board.rb'
require_relative 'player.rb'
require_relative 'peg.rb'

g = Mastermind::Game.new
g.play