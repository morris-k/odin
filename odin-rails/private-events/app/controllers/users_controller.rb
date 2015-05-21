class UsersController < ApplicationController
  def new
  	@user = User.new
  end

  def create
  	@user = User.new(user_params)
  	if @user.save
  		log_in @user
  		redirect_to root_path
  	else
  		render 'new'
  	end
  end

  def show
  	@user = User.find(params[:id])
    @upcoming_events = @user.upcoming_events
    @previous_events = @user.previous_events
  end

  private

  	def user_params
  		params.require(:user).permit(:name, :email)
  	end
end
