class User < ActiveRecord::Base

	validates :name, presence: :true
	VALID_EMAIL_REGEX = /@/
	validates :email, format: { with: VALID_EMAIL_REGEX }, 
										uniqueness: { case_insensitive: false }

	has_secure_password

	before_create :remember

	has_many :posts

	def User.new_token
		SecureRandom.urlsafe_base64
	end

	def User.digest(token)
		Digest::SHA1.hexdigest(token.to_s)
	end

	def remember
		self.remember_token = User.digest(User.new_token)
	end

	def forget
		update_attribute(:remember_token, nil)
	end
end
