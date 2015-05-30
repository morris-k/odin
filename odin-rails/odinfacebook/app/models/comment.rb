class Comment < ActiveRecord::Base
  belongs_to :subject, polymorphic: true
  belongs_to :user

  has_many :likes, as: :subject
  has_many :liking_users, through: :likes,
  												source: :user
end
