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
	create_attendances
	create_invites
	accept_invites
end

def create_users
	puts "CREATING USERS"
	User.create(name: "user1", email: "user1@example.com")
	puts "created user user1"
	20.times do |n|
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
												date: Faker::Time.between(10.days.ago, Faker::Time.forward(10)))
		puts "created event #{name}"
	end
end

def create_attendances
	puts "CREATING ATTENDANCES"
	Event.past.each do |event|
		event.attendances.create(attendee: User.find(1))
		n = rand(User.all.length) + 3
		n.times do
			u = rand(User.all.length) + 1
			user = User.find(u)
			if user.can_attend?(event)
				event.attendances.create(attendee: user)
				puts "#{user.name} attending #{event.name}"
			end
		end
	end
end

def create_invites
	puts "CREATING INVITATIONS"
		Event.future.each do |event|
			User.find(1).invite_to(event)
			n = rand(User.all.length) + 10
			n.times do
				u = rand(User.all.length) + 1
				user = User.find(u)
				if user.can_be_invited_to?(event)
					user.invite_to(event)
					puts "#{user.name} was invited to #{event.name}"
				end
			end
		end
end

def accept_invites
	puts "ACCEPTING INVITES"
	Invite.all.each do |invite|
		n = rand(2)
		if n > 0
			invite.accept!
			invite.invitee.attend(invite.invited_event)
			puts "#{invite.invitee.name} accepted the invitation to #{invite.invited_event.name}"
		end
	end
end

User.destroy_all
Event.destroy_all
User.reset_pk_sequence
Event.reset_pk_sequence
Attendance.destroy_all
Attendance.reset_pk_sequence
Invite.destroy_all
Invite.reset_pk_sequence
create_data