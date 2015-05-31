require 'rails_helper'

feature 'User adds friend' do

	scenario 'user makes request' do
		
		second_user = 1
		third_user = 2
		created_users = create_list(:user, 10)
		first_user = created_users[0]
		log_in_as(first_user)
		visit 'users'
		send_request(first_user, second_user)
		visit 'users'
		expect(page).to have_content('Add', count: 8)
		send_request(first_user, third_user)
		visit 'users'
		expect(page).to have_content('Add', count: 7)
  end

  scenario 'user accepts request' do 
  	created_users = create_list(:user, 10)
  	second_user = created_users[1]
  	first_user = created_users[0]
		login_request_logout(created_users, 0, 1)
		log_in_as(second_user)
		expect(page).to have_content('Friend Requests: 1')
		click_link('Accept')
		visit user_path(second_user)
		expect(page).to have_content(first_user.name)
  end

  def send_request(first_user, link_number)
  	page.find(".user-request:nth-of-type(#{link_number})").click_link('Add')
  end

  def login_request_logout(created_users, user, link_number)
		requesting_user = created_users[user]
		log_in_as(requesting_user)
		visit 'users'
		1.upto(link_number) do |link|
			send_request(requesting_user, link)
		end
		log_out
  end

end