class CommentsController < ApplicationController
  before_action :set_subject_type

	def create
		@subject = @klass.find(params[:comment][:subject_id])
		@comment = @subject.comments.build(comment_params)
		@comment.user = current_user
		if @comment.save
			respond_to do |format|
				format.html { redirect_to root_path}
				format.js
			end
		else
			flash[:danger] = "comment not made"
			redirect_to root_path
		end
	end

	def show
		@comment = Comment.find(params[:id])
	end

	def destroy
		@comment = Comment.find(params[:id])
		@comment.destroy
		respond_to do |format|
			format.html { redirect_to root_path}
			format.js
		end
	end

	private
		def set_subject_type
			@klass = params[:type].blank? ? Post : subject_type_class 
		end

		def subject_type_class
			subject_type.constantize
		end

		def subject_type
			params[:type]
		end

		def comment_params
			params.require(:comment).permit(:subject_id, :subject_type, :body, :user_id)
		end
end
