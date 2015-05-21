class Attendance < ActiveRecord::Base

	belongs_to :attendee, class_name: 'User'
	belongs_to :attended_event, class_name: 'Event'

	before_save :no_creator_attendance

	def event
		Event.find(attended_event_id)
	end

	def user
		User.find(attendee_id)
	end

	def no_creator_attendance
		if attendee_id == event.creator_id
			return false
		end
	end
end
