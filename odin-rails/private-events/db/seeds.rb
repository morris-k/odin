# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

def create_data
	create_users
	create_events
end

def create_users
	puts "CREATING USERS"
	User.create(name: "user1", email: "user1@example.com")
	puts "created user user1"
	10.times do |n|
		fn = Faker::Name.first_name
		ln = Faker::Name.last_name
		User.create(name: "#{fn} #{ln}", email: "user#{n+2}@example.com")
		puts "created user #{fn} #{ln}"
	end
end

def create_events
	puts "CREATING EVENTS"
	User.all.each do |user|
		name = Faker::Company.catch_phrase.split(" ").map{|x| x.capitalize}.join(" ")
		user.events.create(name: name,
												description: Faker::Hacker.say_something_smart,
												date: Faker::Time.forward(10))
		puts "created event #{name}"
	end
end

User.destroy_all
Event.destroy_all
User.reset_pk_sequence
Event.reset_pk_sequence
create_data