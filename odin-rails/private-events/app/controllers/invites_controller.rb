class InvitesController < ApplicationController

	def new
	end

	def accept
		invite = Invite.find(params[:id])
		invite.accept!
		current_user.attend(invite.invited_event)
		redirect_to profile_path(current_user)
	end

	def destroy
		invite = Invite.find(params[:id])
		if invite.decline!
			redirect_to root_path
		else
			flash[:danger] = "something went wrong"
			redirect_to root_path
		end
	end


	private
		def invite_params
			params.require(:invite).permit(:invited_event, :invitee, :inviter)
		end
end
