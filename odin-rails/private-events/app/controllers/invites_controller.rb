class InvitesController < ApplicationController

	def new
	end

	def accept
		@invite = Invite.find(params[:id])
		if @invite.accept!
			current_user.attend(@invite.invited_event)
			respond_to do |format|
				format.html { redirect_to profile_path(current_user) }
				format.js
			end
		end
	end

	def decline
		@invite = Invite.find(params[:id])
		if @invite.destroy
			respond_to do |format|
				format.html { redirect_to profile_path(current_user) }
				format.js
			end
		else
			respond_to do |format|
				format.html { redirect_to profile_path(current_user) }
				format.js { alert('something went wrong')}
			end
		end
	end


	private
		def invite_params
			params.require(:invite).permit(:invited_event, :invitee, :inviter)
		end
end
