class User < ActiveRecord::Base

	validates :username, presence: true, uniqueness: true, 
												length: { in: 5..20 }
	has_many :posts, foreign_key: :author_id
	has_many :comments, foreign_key: :commenter_id
end
