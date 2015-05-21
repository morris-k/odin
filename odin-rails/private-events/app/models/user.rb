class User < ActiveRecord::Base

	has_many :events, foreign_key: :creator_id

	has_many :attendances, foreign_key: :attendee_id
	has_many :attended_events, through: :attendances

	def can_attend?(event)
		!is_creator_of(event) && !is_attending(event)
	end

	def is_creator_of(event)
		event.creator == self
	end

	def is_attending(event)
		attended_events.include? event
	end

	def upcoming_events
		attended_events.select{ |event| event.is_upcoming }
	end

	def previous_events
		attended_events.select{ |event| event.is_past }
	end
end
