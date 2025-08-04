namespace :development do
  namespace :db do
    desc "Seed everything"
    task seed: [ :create_default_user, :cards ]

    desc "Create a default user"
    task create_default_user: :environment do
      User.where(email: "user@brello.com").first_or_create!(password: "password1234")
    end

    desc "Seed the database with development data"
    task cards: :environment do
      project = Project.where(name: "Project 1", description: "Project 1 description").first_or_create!
      board = project.boards.where(name: "Board 1", description: "Board 1 description").first_or_create!
      todo_column = project.columns.where(name: "To Do", description: "To Do").first_or_create!
      in_progress_column = project.columns.where(name: "In Progress", description: "In Progress").first_or_create!
      done_column = project.columns.where(name: "Done", description: "Done").first_or_create!

      board.board_columns.where(column: todo_column).first_or_create!
      board.board_columns.where(column: in_progress_column).first_or_create!
      board.board_columns.where(column: done_column).first_or_create!

      10.times do |i|
        Card.where(
          title: "Card #{i + 1}",
          description: "This is the description for card #{i + 1}",
          column: todo_column
        ).first_or_create!
      end
    end
  end
end
