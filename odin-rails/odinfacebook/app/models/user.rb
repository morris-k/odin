class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

	has_many :pending_friendships, -> { Friendship.pending }, 
																class_name: "Friendship",
																dependent: :destroy
	has_many :pending_requests, -> { Friendship.pending },
																foreign_key: :friend_id,
																class_name: "Friendship",
																dependent: :destroy
	has_many :accepted_friendships, -> { Friendship.accepted },
																class_name: "Friendship",
																dependent: :destroy
	has_many :friends, through: :accepted_friendships

  def request(friend)
  	self.pending_friendships.create(friend_id: friend.id)
  end

  def accept(request)
  	request.update(status: "accepted")
  	request.counterpart.update(status: "accepted")
  end

  def reject(request)
  	request.destroy
  end

  def remove_friend(friend)
  	f = accepted_friendships.where(friend_id: friend.id).first
  	f.destroy
  end

  def is_friends_with(user)
  	self.friends.include?(user)
  end

  def has_requested(user)
  	pending_friendships.map{|x| x.friend_id }.include?(user.id)
  end

  def has_been_requested_by(user)
  	pending_requests.map{|x| x.user_id }.include?(user.id)
  end

  def can_request(user)
  	self != user &&
  	!self.is_friends_with(user) &&
  	!self.has_requested(user) &&
  	!self.has_been_requested_by(user)
  end

end
