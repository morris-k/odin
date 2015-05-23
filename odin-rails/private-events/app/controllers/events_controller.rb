class EventsController < ApplicationController
  def new
  	@event = Event.new
    @invitable = User.all.select{|u| u != current_user }.map{|x| [x.id, x.name]}
    @invitable.each do |i|
      @event.invites.build
    end
  end

  def create
  	@event = current_user.events.build(event_params)
  	if @event.save
  		redirect_to @event
  	else
  		render 'new'
  	end
  end

  def show
  	@event = Event.find(params[:id])
    @invitees = @event.pending_invitees
  end

  def index
  	@upcoming_events = Event.future
    @previous_events = Event.past
  end

  private
  	def event_params
  		params.require(:event).permit(:name, :description, :date, :invitee_ids => [])
  	end
end
