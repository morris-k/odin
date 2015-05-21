class Invite::Accept

	def self.call(invitation, invitee)
		invitation.accept!(invitee)
		invitation.event.attendances.create!(attendee: invitee)
	end

end
