class Comment < ActiveRecord::Base

	validates :body, presence: true

	belongs_to :commenter, class_name: 'User'
	validates :commenter, presence: true
	belongs_to :post
	validates :post, presence: true
end
