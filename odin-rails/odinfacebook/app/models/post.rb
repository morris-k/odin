class Post < ActiveRecord::Base
	default_scope -> {order(created_at: :desc)}

	belongs_to :user

	has_many :likes, as: :subject
	has_many :liking_users, through: :likes,
													source: :user

	has_many :comments, as: :subject, dependent: :destroy
end
