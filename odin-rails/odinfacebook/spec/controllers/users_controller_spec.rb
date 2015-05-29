require 'rails_helper'

RSpec.describe UsersController, type: :controller do
	before(:each) do
		sign_in FactoryGirl.create(:user)
	end

	it "should have a current user" do
		expect(subject.current_user).to_not be_nil
	end
end
