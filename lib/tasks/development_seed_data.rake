namespace :development do
  namespace :db do
    desc "Seed everything"
    task seed: [ :create_default_user, :cards ]

    desc "Create a default user"
    task create_default_user: :environment do
      User.where(email: "user@brello.com"      ).first_or_create!(password: "password1234")
    end

    desc "Seed the database with development data"
    task cards: :environment do
      10.times do |i|
        Card.where(
          title: "Card #{i + 1}",
          description: "This is the description for card #{i + 1}"
        ).first_or_create!
      end
    end
  end
end