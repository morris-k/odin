class Event < ActiveRecord::Base

	belongs_to :creator, class_name: 'User'

	has_many :attendances, foreign_key: :attended_event_id
	has_many :attendees, through: :attendances

	def formatted_date
		self.date.strftime("%B %d, %Y at %I:%m %p")
	end

	def formatted_time
	end
end
