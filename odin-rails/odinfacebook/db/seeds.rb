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
	accept_requests
	create_posts
end

def create_users
	User.create!(name: "User1", email: "user1@example.com", password: "password")
	User.create!(name: "User2", email: "user2@example.com", password: "password")
	20.times do
		User.create(name: Faker::Name.name, email: Faker::Internet.email, password: 'password')
	end
end

def create_requests
	User.all.each do |user|
		r = rand(User.all.length)
		r.times do 
			f = rand(User.all.length) + 1
			friend = User.find(f)
			if user.can_request(friend)
				user.request(friend)
				puts "#{user.name} requested #{friend.name}"
			end
		end
	end
end

def accept_requests
	User.all.each do |user|
		if user.pending_requests.any?
			r = rand(user.pending_requests.length) + 1
			r.times do |x|
				user.accept(user.pending_requests[x])
				puts "#{user.name} accepted request"
			end
		end
	end
end

def create_posts
	puts "CREATING POSTS"
	User.all.each do |user|
		r = rand(5) + 2
		fl = user.friends.count
		r.times do 
			p = user.posts.create(content: Faker::Lorem.paragraph(2))
			p.update(created_at: Faker::Date.between(10.days.ago, Time.now) - rand(20).hours - rand(59).minutes)
			puts "created post for #{user.name}"
			if fl > 0
				(rand(fl) + 1).times do |n|
					f = rand(fl) + 1
					u = user.friends[f]
					if u
						if rand(2) == 1 
							c = p.comments.create(body: Faker::Lorem.sentence, user_id: u.id)
							c.update(created_at: p.created_at + (n*10).minutes)
							puts "			created comment by #{u.name}"
						else 
							u.like(p)
							puts "			created like by #{u.name}"
						end
					end
				end
			end
		end
	end
end


User.destroy_all
User.reset_pk_sequence
Post.reset_pk_sequence
Friendship.reset_pk_sequence
Like.reset_pk_sequence
Comment.reset_pk_sequence
create_data