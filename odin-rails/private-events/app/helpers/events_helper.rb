module EventsHelper
	def event_times
		text = []
		times = []
		hours = [12, *1.upto(11)]
		minutes = ["00", 15, 30, 45].map {|x| x.to_s }
		ampm = ["AM", "PM"]
		ampm.each do |ap|
			hours.map do |hour|
				4.times do |i|
					text << "#{hour}:#{minutes[i]} #{ap}"
					times << Time.now + hour.hours + minutes[i].to_i.minutes
				end
			end
		end
		times
	end

	def event_form_times
		form_times = []
		i = 0
		event_times.each do |x|
			form_times << [Time.now , x]
			i += 15
		end
		form_times
	end
end
