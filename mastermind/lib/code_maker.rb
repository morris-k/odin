module Mastermind
	require_relative 'code_pegs.rb'
	require_relative 'board_pegs.rb'
	class CodeMaker

		@@result_dict = { matching: :black, partial: :white, none: nil}

		attr_accessor :code_pegs

		def initialize
		end

		def set_code_pegs(options = {})
			if options[:colors]
				@code_pegs = CodePegs.create_row(options[:colors])
			else
				@code_pegs = CodePegs.create_code_pegs
			end
		end

		def matching
			@matching ||= 0
		end

		def matching=(n)
			@matching += n
		end

		def partial 
			@partial ||= 0
		end

		def check_guess(guess_row)
			m = matching_pegs(guess_row).compact
			matching = m[0]
			if matching == 4
				partial = 0
				none = 0
			else
				p = partial_pegs(m[1], m[2]) 
				partial = p[0]
				none = 4 - (partial + matching)
			end
			return { matching: matching, partial: partial, none: none}
		end

		def matching_pegs(guess_row)
			code_row = @code_pegs.map{|x| x.color }
			matching = 0
			unmatched_guess = []
			unmatched_code = []
			guess_row.each_index do |i|
				if guess_row[i] == code_row[i]
					matching += 1
				else
					unmatched_guess << guess_row[i]
					unmatched_code << code_row[i]
				end
			end
			[matching, unmatched_guess, unmatched_code]
		end

		def partial_pegs(unmatched_guess, unmatched_code)
			partial = 0
			unmatched_guess.each do |guess|
				ind = unmatched_code.index(guess) 
				if ind.nil?
					next
				else 
					partial += 1
					unmatched_code.delete_at(ind)
				end
			end
			[partial, unmatched_guess, unmatched_code]
		end

		def results(guess_row)
			hash = check_guess(guess_row)
			results = []
			hash.each do |k, v|
				v.times do 
					results << @@result_dict[k] unless k == :none
				end
			end
			results
		end

	end
end

# cm = Mastermind::CodeMaker.new
# cm.set_code_pegs([:blue, :green, :yellow, :red])
# puts cm.code_pegs
# s = " "
# all_matching = cm.code_pegs.map{|x| x.color }
# some_matching = all_matching[0..2] << :green
# puts all_matching
# puts some_matching

# cm.check_guess(some_matching)