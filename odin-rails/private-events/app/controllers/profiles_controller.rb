class ProfilesController < ApplicationController

	def show
		@user = current_user
		@invites = @user.pending_invitations
	end
end
