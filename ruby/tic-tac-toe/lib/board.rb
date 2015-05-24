class String
  def blank?
    self !~ /\S/
  end
end
module TicTacToe

	class Board

		attr_accessor :grid

		def initialize()
			@grid = Array.new(3) { Array.new(3, " ")}
		end

		def print
			puts "   " + %w(1 2 3).join("   ")
			letts = %w(A B C)
			@grid.each_with_index do |row, i|
				puts "#{letts[i]}  " + row.join(" | ")
				if i < 2
					puts "  ----------"
				end
			end
		end

		def free_squares
			@grid.flatten.select{|x| x.blank? }.length
		end

		def from_id(id)
			lett = id.split("")[0].downcase 
			num = id.split("")[1].to_i - 1
			return [['a', 'b', 'c'].index(lett), num]
		end

		def valid_square(ln)
			ln[0].between?(0, 2) && ln[1].between?(0, 2) ? 
				true :
				false
		end

		def col_num(id)
			from_id(id)[1]
		end

		def row_num(id)
			from_id(id)[0]
		end

		def get_square(id)
			if ['a', 'b', 'c'].include?(id[0])
				if valid_square(from_id(id))
					return @grid[row_num(id)][col_num(id)]
				end
			end
			return false
		end

		def set_square(id, token)
			@grid[row_num(id)][col_num(id)] = token
		end

		def update_square(id, token)
			square = get_square(id)
			if square
				if square.blank? 
					set_square(id, token)
					return ok('good choice')
				else
					return error('marked')
				end
			else
				return error('not a square')
			end
		end

		def respond(status, message)
			[status, message]
		end

		def error(message)
			respond(false, message)
		end

		def ok(message)
			respond(true, message)
		end

		def full?
			free_squares == 0
		end

		def check_win(token)
			rows = @grid.clone
			cols = rows.transpose
			diags = [
							[grid[0][0], grid[1][1], grid[2][2]],
							[grid[0][2], grid[1][1], grid[2][0]]
						]
			rows.concat(cols).concat(diags).each do |set|
				if set.count(token) == 3
					return error("win")
				end
			end
			if full?
				return error('draw')
			else
				return ok('')
			end
		end
	end
end
