module SessionsHelper

	def log_in user
		cookies.permanent[:user_id] = user.id
		self.current_user = user
	end

	def signed_in?
		!current_user.nil?
	end

	def current_user
		if cookies[:user_id]
			@current_user ||= User.find(cookies[:user_id])
		end
	end

	def current_user= user
		@current_user = user
	end

	def log_out
		cookies.delete(:user_id)
		current_user = nil
	end

end
