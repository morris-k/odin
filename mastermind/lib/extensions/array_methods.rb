module Mastermind
	class Array
		def shuffle
			current = self.length - 1
			while current > 0
				temp = self[current]
				n = rand(current)
				self[current] = self[n]
				self[n] = temp
				current -= 1
			end
		end

		def sym_to_str
			self.map{|x| x.to_s }
		end
	end
end