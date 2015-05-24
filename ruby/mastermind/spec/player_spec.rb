require 'player'

describe "Player" do
	before(:all) do
		@player = Mastermind::Player.new
		@colors = @player.colors
	end 

	describe 'validate_input' do 
		it 'calls is_a_valid_color when given a color' do
			expect(@player).to receive(:is_a_valid_color)
			@player.validate_input("magenta")
		end

		it 'calls is_num_in_range when given a number' do
			expect(@player).to receive(:is_num_in_range)
			@player.validate_input("1")
		end
	end

	describe '#make_code_pegs' do
		context 'with invalid input' do
			before(:each) do
				allow(@player).to receive(:gets).and_return("1", "2", "6", "3")
			end

			it 'continues until input is valid' do 
				expect(@player.make_code_pegs.length).to eq(4)
			end
		end

		context 'with valid input' do
			before(:each) do
				allow(@player).to receive(:gets).and_return("1", "3", "5", "2")
			end

			it 'accepts 4 valid inputs' do 
				expect(@player.make_code_pegs.length).to eq(4)
			end
		end
	end


end