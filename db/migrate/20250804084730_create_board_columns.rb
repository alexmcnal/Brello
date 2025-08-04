class CreateBoardColumns < ActiveRecord::Migration[8.0]
  def change
    create_table :board_columns do |t|
      t.references :board, null: false, foreign_key: true
      t.references :column, null: false, foreign_key: true

      t.timestamps
    end
  end
end
