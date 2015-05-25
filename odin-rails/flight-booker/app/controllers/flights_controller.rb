class FlightsController < ApplicationController

	def index
		@to_airports = Airport.all.map{ |x| [x.location, x.code] }
		@from_airports = Airport.all.map{ |x| [x.location, x.code] }
		@dates = Flight.start_dates
		@passengers = [*1..4].map{|x| [x, x.to_s]}

		if params[:search]
			@to = params[:to_code]
			@from = params[:from_code]
			@date = Flight.date_from_dmy(params[:date])
			@flights = Flight.search(params)
			@num_passengers = params[:num_passengers]
		end
	end
end
