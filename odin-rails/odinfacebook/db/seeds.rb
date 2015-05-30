# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

def create_data

	create_users
	create_requests
	create_posts
end

def create_users
	User.create!(name: "User1", email: "user1@example.com", password: "password")
	User.create!(name: "User2", email: "user2@example.com", password: "password")
	10.times do
		User.create(name: Faker::Name.name, email: Faker::Internet.email, password: 'password')
	end
end

def create_requests
	User.all[1..-1].each do |user|
		user.request(User.find(1))
	end
	User.all.each do |user|
		r = rand(User.all.length)
		r.times do 
			f = rand(User.all.length) + 1
			friend = User.find(f)
			if user.can_request(friend)
				user.request(friend)
			end
		end
	end
end

def accept_requests
end

def create_posts
	User.all.each do |user|
		r = rand(5) + 2
		r.times do 
			p = user.posts.create(content: Faker::Lorem.paragraph(2))
			p.update(created_at: Faker::Date.between(10.days.ago, 10.days.from_now))
		end
	end
end


User.destroy_all
User.reset_pk_sequence
Post.reset_pk_sequence
Friendship.reset_pk_sequence
create_data