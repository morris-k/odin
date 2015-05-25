class PassengerMailer < ApplicationMailer

	default from: "confirmation@odinair.com"

	def flight_confirmation(passenger)
		@passenger = passenger
		@flight = passenger.booking.flight
		mail(to: @passenger.email, subject: "Your Flight Booking")
	end

end
