class LikesController < ApplicationController

	before_action :set_subject_type

	def create
		@subject = @klass.find(params[:subject_id])
		current_user.like(@subject)
		respond_to do |format|
			format.html { redirect_to root_path}
			format.js
		end
	end

	def destroy
		@subject = @klass.find(params[:subject_id])
		current_user.unlike(@subject)
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
end
