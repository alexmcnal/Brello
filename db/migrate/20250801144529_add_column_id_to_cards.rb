class AddColumnIdToCards < ActiveRecord::Migration[8.0]
  def change
    add_reference :cards, :column, null: false, foreign_key: true
  end
end
