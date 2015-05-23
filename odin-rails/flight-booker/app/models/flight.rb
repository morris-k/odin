class Flight < ActiveRecord::Base

	belongs_to :from_airport, foreign_key: :from_id, class_name: "Airport"
	belongs_to :to_airport, foreign_key: :to_id, class_name: "Airport"

	def Flight.start_dates
		Flight.pluck(:start_time).map{|x| x.strftime("%m/%d/%Y") }.uniq.sort
	end

	def Flight.date_to_dmy(date)
		date.strftime("%m/%d/%Y")
	end

	def Flight.date_from_dmy(string_date)
		sp = string_date.split("/")
		d = sp.delete_at(1)
		sp.unshift(d).join("/")
	end

	def Flight.search(params)
		to_airport = Airport.find_by(code: params[:to_code])
		from_airport = Airport.find_by(code: params[:from_code])
		start_date = Flight.date_from_dmy(params[:date]).to_datetime

		flights = Flight.select{ |x|
			x.to_id == to_airport.id &&
			x.from_id == from_airport.id &&
			x.start_time.between?(start_date.at_midnight, start_date.at_end_of_day)
		}.sort_by{|x| x.start_time }
		flights
	end

	def arrival_time
		start_time + duration.minutes
	end
end
