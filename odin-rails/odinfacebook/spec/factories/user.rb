FactoryGirl.define do
  sequence :email do |n|
    "person#{n}@example.com"
  end
end

FactoryGirl.define do
	factory :user, aliases: [:friend] do
		name Faker::Name.name
		email
		password "password"
	end
end