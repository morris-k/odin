require 'rails_helper'

feature 'Visitor signs up' do
  scenario 'with valid email and password' do
    sign_up_with 'valid@example.com', 'password'

    expect(page).to have_content('Sign Out')
  end

  def sign_up_with(email, password)
    visit new_user_registration_path
    fill_in 'Name', with: 'A Name'
    fill_in 'Email', with: 'auser@example.com'
    fill_in 'Password', with: 'password'
    fill_in 'Password confirmation', with: 'password'
    click_button 'Sign up'
  end
end