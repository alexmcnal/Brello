class AddStatusToCards < ActiveRecord::Migration[8.0]
  def change
    add_column :cards, :status, :string, null: false, default: 'todo'
  end
end
