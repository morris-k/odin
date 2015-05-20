class Post < ActiveRecord::Base

	default_scope -> { order(created_at: :desc) }

	validates :body, presence: :true

	belongs_to :user
	validates :user, presence: true


	
end
