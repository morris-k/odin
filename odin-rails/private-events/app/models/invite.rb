class Invite < ActiveRecord::Base

	belongs_to :invitee, class_name: 'User'
	belongs_to :invited_event, class_name: 'Event'
	belongs_to :inviter, class_name: 'User'

	def accept!
		update!(status: "accepted")
	end

	def decline!
		update!(status: "declined")
	end

	def event_name
		invited_event.name
	end

	

end
