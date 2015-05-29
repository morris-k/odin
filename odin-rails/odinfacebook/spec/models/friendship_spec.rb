require 'rails_helper'

RSpec.describe Friendship, type: :model do
  before(:each) do
  	@pending_friendship = create(:friendship)
  end

  describe "#create" do 
  	it "creates a counterpart" do 
  		expect(@pending_friendship.counterpart).to be_an_instance_of(Friendship)
  		expect(Friendship.count).to eq(2)
  	end
  end

  describe "#destroy" do
  	it "destroys the counterpart" do
  		@pending_friendship.destroy
  		expect(Friendship.count).to eq(0)
  	end
  end
end
