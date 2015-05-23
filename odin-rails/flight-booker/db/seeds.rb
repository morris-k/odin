# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

def create_data

	airport_data = [ 
						{ code: "SFO", location: "San Francisco"},
						{ code: "NYC", location: "New York City"}
	]
	create_airports(airport_data)
	create_flights
end

def create_airports(airport_data)
	airport_data.each do |airport|
		Airport.create(airport)
	end
end

def create_flights
	10.upto(15).each do |day|
		(rand(10) + 10).times do 
			from_airport = Airport.find(rand(Airport.all.count) + 1)
			to_airport = Airport.find(rand(Airport.all.count) + 1)
			while to_airport == from_airport
				to_airport = Airport.find(rand(Airport.all.count) + 1)
			end
			start_time = random_departure_time(day)
			duration = random_duration
			Flight.create(
									from_id: from_airport.id,
									to_id: to_airport.id,
									start_time: start_time,
									duration: duration)
		end
	end
end

def random_departure_time(day)
	Time.now + day.days + rand(24).hours + rand(60).minutes + rand(60).seconds
end

def random_duration
	rand(60*5) + 60
end

Airport.destroy_all
Flight.destroy_all
Airport.reset_pk_sequence
Flight.reset_pk_sequence
create_data