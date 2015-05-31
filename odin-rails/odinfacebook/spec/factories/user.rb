FactoryGirl.define do
  sequence :email do |n|
    "person#{n}@example.com"
  end
  sequence :name do 
  	Faker::Name.name
  end
end

FactoryGirl.define do
	factory :user, aliases: [:friend] do
		name
		email
		password "password"
	end
end