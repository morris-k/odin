class SessionsController < ApplicationController

	def new
	end

	def create
		user = User.find_by(email: params[:session][:email])
		if user
			log_in user
			redirect_to root_path
		else
			flash.now[:danger] = "No user found with that name."
			render 'new'
		end
	end

	def destroy
		log_out
		redirect_to login_path
	end
end
