module FlightsHelper

	def formatted_duration(flight)
		dur = flight.duration
		hours = (dur - (dur % 60)) / 60
		dur -= (hours * 60)
		minutes = dur
		pluralize(hours, "hour") + ", " + pluralize(minutes, "minute")
	end

	def formatted_departure_time(flight)
		flight.start_time.strftime("%l:%M %p")
	end

	def formatted_arrival(flight)
		flight.arrival_time.strftime("%l:%M %p")
	end

	def formatted_date(date)
		date.to_datetime.strftime("%B %d, %Y")
	end

	def formatted_departure(flight)
		formatted_date(flight.start_time)
	end


end
