class ProfilesController < ApplicationController

	def show
		@user = current_user
		@invites = @user.pending_invitations
		
	end


	private
		def link_params
			params.require(:profile).permit(:tab)
		end
end
