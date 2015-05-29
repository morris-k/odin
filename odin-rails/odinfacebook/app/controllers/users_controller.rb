class UsersController < ApplicationController

	def show
		@user = User.find(params[:id])
		@friends = @user.friends
	end
end
