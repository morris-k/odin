require 'paint'
require 'set'
require 'yaml'
class Hangman


	attr_accessor :word, :guessed_letters, :playing, :guesses_remaining, :filename, :over

	def initialize(filename)
		@over = false
		@filename = filename
		if @word.nil?
			new_game
		else
			play
		end
	end

	def serialize
		yaml = YAML::dump(self)
	end

	def self.deserialize(yaml)
		YAML::load(yaml)
	end

	def get_word
		f = File.open('5desk.txt', 'r')
		words = []
		f.readlines.each do |word|
			words << word[0..-2] if word.length.between?(5, 12) && word[0] == word[0].downcase
		end
		words[rand(words.length)].upcase
	end

	def ask_for_letter
		loop do
			puts game_options
			letter = gets.chomp.upcase
			if letter == 'QUIT'
				@playing = false
				return quit
			end
			if guessed?(letter)
				puts "you already guessed that one"
			elsif !letter.between?("A", "Z")
				puts "that's not a letter..."
			else
				return letter
			end
		end
	end

	def show_word
		puts @word.split("").map{ |x| guessed?(x) ? x : "_" }.join(" ")
	end

	def show_alph
		puts "A".upto("Z").to_a.map{|l| guessed?(l) ? Paint[l, :red] : l }.join(" ")
	end

	def guessed?(letter)
		@guessed_letters.include?(letter)
	end

	def draw
		topbar =		"    ------- "
		rope =   		"    |     | "
		space =  		"          | "
		stand = 		" ========== "
		hat = 			"						 "
		head =  		"    O     | "
		body1 =   	"    |     | "
		body2 = 		"   \\|     | "
		body3 =     "   \\|/    | "
		legs1 =     "   /      | "
		legs2 = 		"   / \\    | "
		man = case @guesses_remaining 
			when 6 then [space]*4
			when 5 then [head].concat([space]*3)
			when 4 then [head, body1, body1, space]
			when 3 then [head, body2, body1, space]
			when 2 then [head, body3, body1, space]
			when 1 then [head, body3, body1, legs1]
			else [head, body3, body1, legs2]
		end
		[topbar, rope].concat(man).concat([space, stand]).each do |p|
			puts p
		end
	end

	def new_game
		@word = get_word
		@guessed_letters = []
		@playing = true
		@guesses_remaining = 6
		play
	end

	def all_guessed?
		@word.split("").uniq.to_set.subset?(@guessed_letters.to_set)
	end

	def game_options
		puts "Guess a letter, or type 'quit' to exit/save your game"
	end

	def quit
		@playing = false
		serialize
	end

	def play
		@playing = true
		while @playing
			draw
			show_alph
			show_word
			letter = ask_for_letter
			if !@playing 
				break
			end
			@guessed_letters << letter
			if !@word.include?(letter)
				@guesses_remaining -= 1
			end
			if all_guessed?
				draw
				show_alph
				show_word
				@over = true
				puts "You win!"
				break
			end
			if @guesses_remaining == 0
				puts "you lose!"
				@over = true
				puts "The word was #{@word}"
				break
			end
		end
	end

end

def open_or_new
	puts "Would you like to"
	puts "1. Play a new game"
	puts "2. Open a saved game"
	opt = gets.chomp
	if opt == "1" 
		return new_game
	elsif opt == "2"
		return open_game
	else
		puts "There are only 2 options! Please enter 1 or 2"
		return open_or_new
	end
end

def open_game
	puts "Which game do you want to play? Enter the number next to the game's date"
	games_saved.each_with_index {|g, i| puts "#{i + 1}. #{g}"}
	file_num = gets.chomp.to_i
	if !file_num.between?(1, games_saved.length)
		puts "that's not a game"
		return open_game
	else
		filename = "./games/" + games_saved[file_num - 1]
		puts filename
		f = File.new(filename, "r")
		yaml = f.read
		game = YAML::load(yaml)
		game.play
	end
	game
end

def save(game, yaml)
	filename = "./games" + game.filename
	f = File.new(filename, "w")
	f.write(yaml)
	f.close
end

def new_filename
	"/game#{games_saved.count + 1}.yaml"
end

def games_saved
	Dir.entries('games')[2..-1]
end

def new_game
	Hangman.new(new_filename)
end

def save?(game)
	puts "Do you want to save your game? (y/n)"
	loop do
		answer = gets.chomp.downcase
		if answer == 'y'
			game.playing = true
			yaml = game.serialize
			save(game, yaml)
			break
		elsif answer == 'n'
			puts 'bye!'
			break
		else
			puts "Please enter 'y' or 'n'"
		end
	end
end


def play_again(game)
	game.playing = false
	puts "play again? (y/n)"
	loop do
		answer = gets.chomp.downcase
		if answer == 'y'
			puts "your old game will be saved"
			yaml = game.serialize
			save(game, yaml)
			return open_or_new
		elsif answer == 'n'
			puts 'bye!'
			break
		else
			puts "Please enter 'y' or 'n'"
		end
	end
end

game = open_or_new
if game.playing == false
	save?(game)
end
if game.over
	play_again(game)
end

# h = Hangman.new
# h.guessed_letters = ["A"]
# puts h.serialize
# puts Hangman.deserialize(h.serialize)
