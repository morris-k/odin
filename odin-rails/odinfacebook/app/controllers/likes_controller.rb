class LikesController < ApplicationController

	def create
		@post = Post.find(params[:post_id])
		current_user.like(@post)
		respond_to do |format|
			format.html { redirect_to root_path}
			format.js
		end
	end

	def destroy
		@post = Post.find(params[:post_id])
		current_user.unlike(@post)
		respond_to do |format|
			format.html { redirect_to root_path}
			format.js
		end
	end
end
