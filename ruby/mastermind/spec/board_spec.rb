require 'board'

describe 'Board' do
	before(:each) do
		@board = Mastermind::Board.new
	end

	describe "#set_number_of_rows" do

		it "sets the given number of rows" do
			@board.set_number_of_rows
			expect(@board.number_of_rows).to eq(12)
		end
	end	

	
end