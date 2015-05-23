class Flight < ActiveRecord::Base

	belongs_to :from_airport, foreign_key: :from_id, class_name: "Airport"
	belongs_to :to_airport, foreign_key: :to_id, class_name: "Airport"

	def Flight.start_dates
		Flight.pluck(:start_time).map{|x| x.strftime("%d/%m/%Y") }.uniq.sort
	end

	def Flight.search(params)
		to_airport = params[:to_airport].to_i
		from_airport = params[:from_airport].to_i
		start_date = params[:date].to_datetime

		flights = Flight.select{ |x|
			x.to_id == to_airport &&
			x.from_id == from_airport &&
			x.start_time.between?(start_date.at_midnight, start_date + 1.day)
		}
		flights
	end
end
