require_relative 'square.rb'

def knight_moves(position, target)
	root_square = Square.new(position)
	root_square.path << root_square.position
	squares = [root_square]
	visited = [root_square.position]
	until squares.empty?
		current_square = squares.shift
		return show_path(current_square.path) if current_square.position == target
		valid_moves(current_square.position).each do |v|
			unless visited.include?(v)
				s = Square.new(v)
				s.path.concat(current_square.path)
				s.path << s.position
				visited << s.position
				squares << s
			end
		end
	end
end

def possible_moves(position)
	x = position[0]
	y = position[1]
	[[x + 2, y + 1], 
		[x + 2, y - 1], 
		[x - 2, y - 1], 
		[x - 2, y + 1],
		[x + 1, y + 2],
		[x + 1, y - 2],
		[x - 1, y + 2],
		[x - 1, y - 2]]
end

def valid_moves(position)
	possible_moves(position).keep_if do |a|
			a[0] >= 0 &&
			a[1] >= 0 &&
			a[0] < 8 &&
			a[1] < 8
	end
end

def show_path(path)
	puts "You made it in #{path.length - 1} move#{path.length == 1 ? '' :'s'}"
	path.each do |p|
		puts "#{p}"
	end
end
knight_moves([0,0],[7,7])