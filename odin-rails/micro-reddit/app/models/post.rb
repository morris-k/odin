class Post < ActiveRecord::Base

	validates :title, presence: :true, length: { maximum: 100 }
	validates :body, presence: true

	belongs_to :author, class_name: 'User'
	has_many :comments

end
