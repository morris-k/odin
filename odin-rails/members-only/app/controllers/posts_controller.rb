class PostsController < ApplicationController
	before_action :signed_in?

	def new
		@post = Post.new
	end

	def create
		@post = current_user.posts.build(post_params)
		if @post.save
			redirect_to root_path
		else
			render 'new'
		end
	end

	def index
		@posts = Post.all
	end


	private
		def post_params
			params.require(:post).permit(:title, :body, :user_id)
		end
end
