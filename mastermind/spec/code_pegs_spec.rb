require 'code_pegs'

describe "CodePegs" do
	before(:all) do 
		@code_pegs = Mastermind::CodePegs
	end

	describe 'colors' do 
		it 'has 6 colors' do
			@peg_set = @code_pegs.create_code_pegs 
			expect(@code_pegs.colors.length).to eq(6)
		end
	end

	describe 'create_pegs' do
		it 'creates an array of pegs' do
			@peg_set = @code_pegs.create_code_pegs 
			expect(@peg_set).to be_an_instance_of(Array)
		end

		it 'has four pegs' do 
			@peg_set = @code_pegs.create_code_pegs 
			expect(@peg_set.length).to eq(4)
		end
	end

	describe '#create_row' do
		it 'returns 4 pegs from given colors' do
			p = [:blue, :red, :green, :yellow]
			@peg_set = @code_pegs.create_row(p)
			expect(@peg_set.length).to eq(4)
			expect(@peg_set.map{|x| x.color}).to eq(p)
		end
	end

end