module FlightsHelper

	def formatted_duration(flight)
		dur = flight.duration
		hours = (dur - (dur % 60)) / 60
		dur -= (hours * 60)
		minutes = dur
		"#{pluralize(hours, 'hours')} #{pluralize(minutes, 'minutes')}"
	end
end
