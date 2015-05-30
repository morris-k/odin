require 'rails_helper'

RSpec.describe FriendshipsController, type: :controller do
	 include Devise::TestHelpers

	before(:each) do 
		@request.env["devise.mapping"] = Devise.mappings[:user]
  	@user = create(:user)
  	@friend = create(:user)
  	sign_in @user
	end

  describe "#create" do 
  	it "creates a new friendship" do 
  		expect {
  			post :create, friend_id: @friend.id
  		}.to change(Friendship, :count).by(1)
  	end
  end

	before(:each) do 
		@friend.request(@user)
		@friendship = @user.pending_requests.first
	end
  
  describe "#update" do
  	it "creates a counterpart" do
  		expect {
  			put :update, id: @friendship.id
  		}.to change(Friendship, :count).by(1)
  	end
	end

  describe "#destroy" do
  	it "destroys the counterpart" do 
  		put :update, id: @friendship.id
  		expect {
  			delete :destroy, id: @friendship.id
  		}.to change(Friendship, :count).by(-2)
  	end
  end
end
