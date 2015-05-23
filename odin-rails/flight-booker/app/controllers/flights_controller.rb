class FlightsController < ApplicationController

	def index
		@flights = Flight.all
		@to_airports = Airport.all.map{ |x| [x.location, x.id] }
		@from_airports = Airport.all.map{ |x| [x.location, x.id] }
		@dates = Flight.start_dates
		@passengers = [*1..4].map{|x| [x, x.to_s]}

		if params[:search]
			@flights = Flight.search(params)
			@num_passengers = params[:num_passengers]
		end
	end
end
