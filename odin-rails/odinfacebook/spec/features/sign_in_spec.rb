require 'rails_helper'

feature 'User logs in' do

	scenario 'with valid email and password' do 
		log_in

    expect(page).to have_content('Sign Out')
    expect(current_path).to eq(root_path)

    log_out
    expect(current_path).to eq(new_user_session_path)
  end

end