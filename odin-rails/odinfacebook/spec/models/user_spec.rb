require 'rails_helper'

RSpec.describe User, type: :model do
  it "has a name" do
  	user = create(:user)
  	expect(user.name).to_not be_nil
  end

  describe "#request" do
  	it "creates a pending friendship" do
  		user = create(:user)
  		friend = create(:user)
  		user.request(friend)
  		expect(user.pending_friendships.length).to eq(1)
  	end
  end

  describe "#accept" do
  	before(:each) do
  		@user = create(:user)
  		@friend = create(:user)
  		@friend.request(@user)
  		@friendship = @user.pending_requests.first
  	end

  	it "changes the friendship status" do
  		@user.accept(@friendship)
  		expect(@friendship.status).to eq("accepted")
  	end

  	it "adds a friend" do
  		@user.accept(@friendship)
  		expect(@user.friends.first).to eq(@friend)
  	end
  end

  describe "#reject" do 
  	it "deletes the request" do
  		user = create(:user)
  		friend = create(:user)
  		friend.request(user)
  		friendship = user.pending_requests.first
  		user.reject(friendship)
  		expect(user.pending_requests.length).to eq(0)
  	end
  end

  describe "#remove_friend" do 
  	before(:each) do
  		@user = create(:user)
  		@friend = create(:user)
  		@friend.request(@user)
  		@friendship = @user.pending_requests.first
  		@user.accept(@friendship)
  	end

  	it 'removes the friend' do 
  		expect(@user.accepted_friendships.length).to eq(1)
  		@user.remove_friend(@friend)
  		expect(@user.friends.length).to eq(0)
  	end

  	it 'deletes both friendships' do
  		expect(Friendship.count).to eq(2)
  		@user.remove_friend(@friend)
  		expect(Friendship.count).to eq(0)
  	end
  end



end
