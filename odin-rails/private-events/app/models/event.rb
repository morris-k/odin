class Event < ActiveRecord::Base

	belongs_to :creator, class_name: 'User'

	def formatted_date
		self.date.strftime("%B %d, %Y at %I:%m %p")
	end

	def formatted_time
	end
end
