class FriendshipsController < ApplicationController
	def create
		@user = current_user
		friend = User.find(params[:friend_id])
		@user.request(friend)
		respond_to do |format|
			format.html { redirect_to user_path(@user) }
			format.js
		end
	end

	def update
		@user = current_user
		@friendship = Friendship.find(params[:id])
		@user.accept(@friendship)
		respond_to do |format|
			format.html { redirect_to user_path(@user) }
			format.js
		end
	end 

	def destroy
		@friendship = Friendship.find(params[:id])
		@friendship.destroy 
		respond_to do |format|
			format.html { redirect_to user_path(@user) }
			format.js
		end
	end
end
