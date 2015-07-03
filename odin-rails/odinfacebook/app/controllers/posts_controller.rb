class PostsController < ApplicationController

	def new
		@post = Post.new
	end

	def create
		@post = current_user.posts.build(post_params)
		if @post.save
			respond_to do |format|
				format.html { redirect_to root_path }
				format.js
			end
		end
	end

	def show
		@post = Post.find(params[:id])
	end

	def index
		@post = Post.new
		@posts = current_user.feed(params[:page])
		respond_to do |format|
			format.html
			format.js
		end
	end

	def destroy
		@post = Post.find(params[:id])
		@post.destroy
		respond_to do |format|
			format.html { redirect_to root_path }
			format.js
		end
	end

	private
		def post_params
			params.require(:post).permit(:content)
		end
end
