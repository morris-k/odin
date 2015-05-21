class User < ActiveRecord::Base

	has_many :events, foreign_key: :creator_id

	has_many :invitations, class_name: 'Invite', foreign_key: :invitee_id
	has_many :invited_events, through: :invitations

	has_many :attendances, foreign_key: :attendee_id
	has_many :attended_events, through: :attendances

	has_one :profile

	after_create :create_user_profile

	def can_attend?(event)
		!is_creator_of(event) && !is_attending(event)
	end

	def is_creator_of(event)
		event.creator == self
	end

	def is_attending(event)
		attended_events.include? event
	end

	def attend(event)
		attendances.create!(attended_event: event)
	end

	def upcoming_events
		attended_events.select{ |event| event.is_upcoming }
	end

	def previous_events
		attended_events.select{ |event| event.is_past }
	end

	def invite_to(event)
		invitations.create(invited_event: event)
	end

	def can_be_invited_to?(event)
		can_attend?(event) && !invited_events.include?(event)
	end

		def create_user_profile
			create_profile
		end

		def pending_invitations
			invitations.select{|i| i.status == 'pending'}
		end
end
