class BookingsController < ApplicationController

	def new
		@booking = Booking.new
		@flight = Flight.find(params[:flight_id])
		@num_passengers = params[:num_passengers].to_i
		@num_passengers.times do
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

	def show
		@booking = Booking.find(params[:id])
	end


	private
		def booking_params
			params.require(:booking).permit(:flight_id, passengers_attributes: [:name, :email])
		end
end
