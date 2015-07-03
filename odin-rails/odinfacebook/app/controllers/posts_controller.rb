class PostsController < ApplicationController

	def new
	end

	def show
		@post = Post.find(params[:id])
	end

	def index
		@posts = current_user.feed(params[:page])
		respond_to do |format|
			format.html
			format.js
		end
	end
end
