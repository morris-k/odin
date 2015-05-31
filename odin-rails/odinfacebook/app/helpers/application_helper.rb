module ApplicationHelper

	def show_user_likes(liking_users)
		links = liking_users.map{ |x| user_link(x)}
		if liking_users.length == 1
			return links[0] + " likes this post"
		elsif liking_users.length < 5
			all = links[0..-2].join(", ") + " and " + links[-1]
			return all + ' like this post';
		else 
			first = links[0..2].join(", ")
			return first + " and " + pluralize(liking_users[3..-1].length.to_s, "other") + " like this post"
		end
	end

	def user_link(user)
		return link_to(user.name, user)
	end

	def full_title(page_title = "")
		base = "Odinfacebook"
		if page_title.empty?
			base
		else
			page_title
		end
	end
end
