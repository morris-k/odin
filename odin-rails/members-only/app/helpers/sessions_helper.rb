module SessionsHelper
	 def log_in user
  	token = User.new_token
  	cookies.permanent[:remember_token] = token
  	user.update(remember_token: User.digest(token))
  	self.current_user = user
  end

  def current_user
  	@current_user ||= User.find_by(remember_token: User.digest(cookies[:remember_token]))
  end

  def current_user= user
  	@current_user = user
  end

  def signed_in?
    !current_user.nil?
  end

  def sign_out
    cookies.delete(:remember_token)
    current_user = nil
  end
end