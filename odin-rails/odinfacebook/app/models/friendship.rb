class Friendship < ActiveRecord::Base
	scope :pending, -> { where(status: 'pending' )}
	scope :accepted, -> { where(status: 'accepted') }

	after_update :create_counterpart
	after_destroy :destroy_counterpart

	belongs_to :user
	belongs_to :friend, class_name: "User"

	has_one :counterpart, class_name: "Friendship",
												foreign_key: :counterpart_id

	def create_counterpart
		if self.counterpart_id.nil?
			f = Friendship.create(user_id: self.friend_id, friend_id: self.user_id, counterpart_id: self.id, status: "accepted")
			self.update(counterpart_id: f.id)
		end
	end

	def destroy_counterpart
		if !self.counterpart.nil?
			self.counterpart.destroy
		end
	end

end
