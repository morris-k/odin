class BookingsController < ApplicationController

	def new
		@booking = Booking.new
		@flight = Flight.find(params[:flight_id])
		params[:num_passengers].to_i.times do
			@booking.passengers.build
		end
	end

	def create
		@booking = Booking.new(booking_params)
		if @booking.save
			redirect_to @booking
		else
			render :new
		end
	end


	private
		def booking_params
			params.require(:booking).permit(:flight_id, passenger_attributes: [:name, :email])
		end
end
