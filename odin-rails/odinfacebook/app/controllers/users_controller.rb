class UsersController < ApplicationController

	def show
		@user = User.find(params[:id])
		@friends = @user.friends
	end

	def index
		@users = current_user.forIndex
	end
end
