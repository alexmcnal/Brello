namespace :development do
  namespace :db do
    desc "Seed the database with development data"
    task seed: :environment do
      10.times do |i|
        Card.create!(
          title: "Card #{i + 1}",
          description: "This is the description for card #{i + 1}"
        )
      end
    end
  end
end