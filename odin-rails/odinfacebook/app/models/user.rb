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

  has_many :posts, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_many :comments, dependent: :destroy

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

  def feed(page)
    all_ids = friend_ids << self.id
    Post.where(user_id: all_ids).page(page).per(10)
  end

  def like(subject)
    begin
      likes.create(subject: subject)
    rescue Exception => e 
      if e.is_a? ActiveRecord::RecordNotUnique
        return false
      end
    end
  end

  def unlike(subject)
    likes.find_by(subject_id: subject.id).destroy
  end

  def likes?(subject)
    subject.liking_users.include?(self)
  end

  def forIndex
    # ids = User.pluck(ids) - User
    User.select{|u| self.can_request(u) && self != u}
  end

  def mutual_friends(user) 
    User.select{ |u| u.is_friends_with(self) && u.is_friends_with(user)}
  end

end
