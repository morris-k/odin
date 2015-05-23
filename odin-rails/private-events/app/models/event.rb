class Event < ActiveRecord::Base
	default_scope ->  { order(date: :desc) }
	scope :past, -> { where(["date < ?", Time.now]) }
	scope :future, -> { where(["date >= ?", Time.now])}

	belongs_to :creator, class_name: 'User'

	has_many :invites, foreign_key: :invited_event_id
	has_many :invitees, through: :invites

	has_many :attendances, foreign_key: :attended_event_id
	has_many :attendees, through: :attendances

	def formatted_date
		self.date.strftime("%B %d, %Y at %I:%m %p")
	end

	def is_past
		Event.past.include? self
	end

	def is_upcoming
		Event.future.include? self
	end

	def pending_invitees
		invitees.select{|i| invites.select{|x| x.status == "pending" }.map{|x| x.invitee_id }.include? i.id}
	end


end
