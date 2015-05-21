module ApplicationHelper

	def user_name(user)
		user == current_user ? "you" : user.name
	end

	def user_possessive(user)
		user == current_user ? "your" : "#{user.name}'s"
	end

	def user_is(user)
		user == current_user ? "are" : "is"
	end

	def attend_tense(event, user)
		event.is_upcoming ? 
				"#{user_is(user)} attending" :
				"attended"
	end

end
