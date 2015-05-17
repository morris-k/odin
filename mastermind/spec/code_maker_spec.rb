require 'code_maker'

describe "CodeMaker" do

	before(:each) do
		@codemaker = Mastermind::CodeMaker.new
	end

	context 'new Codemaker' do

		describe "#matching" do 
			it 'returns 0' do
				expect(@codemaker.matching).to eq(0)
			end
		end

	end

	describe '#set_code_pegs' do
		context 'without args' do
			it 'gets a random set' do
				@code_pegs = @codemaker.set_code_pegs
				expect(@code_pegs.length).to eq(4)
			end
			it 'can access the pegs' do
				expect(@codemaker.code_pegs).to eq(@code_pegs)
			end
		end

		context 'with args' do
			it 'gets a given set' do
				@code_pegs = @codemaker.set_code_pegs(:colors => [:red, :blue, :green, :yellow])
				expect(@code_pegs.map{|x| x.color}).to eq([:red, :blue, :green, :yellow])
			end
			it 'can access the pegs' do
				expect(@codemaker.code_pegs).to eq(@code_pegs)
			end
		end
	end

	describe "#matching_pegs" do
		context 'all pegs match' do
			it 'returns 4 and two empty arrays' do
				@codemaker.set_code_pegs(:colors => [:blue, :blue, :blue, :blue])
				expect(@codemaker.matching_pegs([:blue, :blue, :blue, :blue])).to eq([4, [], []])
			end
		end

		context '1 peg matches' do
			it 'returns 1 and two arrays of three' do
				@codemaker.set_code_pegs(:colors => [:blue, :blue, :blue, :blue])
				expect(@codemaker.matching_pegs([:blue, :green, :red, :yellow])).to eq([1, [:green, :red, :yellow], [:blue, :blue, :blue]])
			end
		end

		context '2 pegs match' do
			it 'returns 2 and two arrays of two' do
				@codemaker.set_code_pegs(:colors => [:blue, :yellow, :red, :yellow])
				expect(@codemaker.matching_pegs([:blue, :green, :red, :blue])).to eq([2, [:green, :blue], [:yellow, :yellow]])
			end
		end

		context '3 pegs match' do
			it 'returns 3 and two arrays of 1' do
				@codemaker.set_code_pegs(:colors => [:blue, :blue, :blue, :blue])
				expect(@codemaker.matching_pegs([:blue, :green, :blue, :blue])).to eq([3, [:green], [:blue]])
			end
		end

		context 'no pegs match' do
			it 'returns 0 and two arrays of 4' do
				@codemaker.set_code_pegs(:colors => [:blue, :blue, :blue, :blue])
				expect(@codemaker.matching_pegs([:green, :green, :yellow, :red])).to eq([0, [:green, :green, :yellow, :red], [:blue, :blue, :blue, :blue]])
			end
		end
	end

	describe '#partial_pegs' do
		context 'no pegs are partial' do 
			it 'returns 0 and the unchanged arrays' do
				@codemaker.set_code_pegs(:colors => [:blue, :blue])
				expect(@codemaker.matching_pegs([:green, :red])).to eq([0, [:green, :red], [:blue, :blue]])
			end
		end
	end

	describe '#check_guess' do
		context 'no matches or partials' do
			it 'returns a hash of {0, 0, 4}' do
				@codemaker.set_code_pegs(:colors => [:blue, :blue, :blue, :blue])
				expect(@codemaker.check_guess([:green, :green, :yellow, :red])).to eq({matching: 0, partial: 0, none: 4})
			end
		end

		context 'one match, no partials' do
			it 'returns a hash of {1, 0, 3}' do
				@codemaker.set_code_pegs(:colors => [:blue, :blue, :blue, :blue])
				expect(@codemaker.check_guess([:blue, :green, :yellow, :red])).to eq({matching: 1, partial: 0, none: 3})
			end
		end
		context 'two matches, one partial' do
			it 'returns a hash of {2, 1, 1}' do
				@codemaker.set_code_pegs(:colors => [:blue, :green, :yellow, :red])
				expect(@codemaker.check_guess([:blue, :yellow, :pink, :red])).to eq({matching: 2, partial: 1, none: 1})
			end
		end
		context 'no matches, four partials' do
			it 'returns a hash of {0, 4, 0}' do
				@codemaker.set_code_pegs(:colors => [:blue, :green, :yellow, :red])
				expect(@codemaker.check_guess([:green, :red, :blue, :yellow])).to eq({matching: 0, partial: 4, none: 0})
			end
		end
		context 'four matches' do
			it 'returns a hash of {4, 0, 0}' do
				@codemaker.set_code_pegs(:colors => [:blue, :green, :yellow, :red])
				expect(@codemaker.check_guess([:blue, :green, :yellow, :red])).to eq({matching: 4, partial: 0, none: 0})
			end
		end
		context 'no matches, two partials of same value' do
			it 'returns a hash of {0, 2, 2}' do
				@codemaker.set_code_pegs(:colors => [:blue, :yellow, :yellow, :red])
				expect(@codemaker.check_guess([:yellow, :green, :pink, :yellow])).to eq({matching: 0, partial: 2, none: 2})
			end
		end
	end

	describe '#results' do
		it 'maps the result hash to peg colors' do
			@codemaker.set_code_pegs(:colors => [:blue, :yellow, :yellow, :red])
			expect(@codemaker.results([:yellow, :green, :pink, :yellow])).to eq([:white, :white])
		end
	end
end