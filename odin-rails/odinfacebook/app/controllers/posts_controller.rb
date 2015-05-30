class PostsController < ApplicationController

	def new
	end

	def show
		@post = Post.find(params[:id])
	end

	def index
		@posts = current_user.feed
	end
end
