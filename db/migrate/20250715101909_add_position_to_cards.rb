class AddPositionToCards < ActiveRecord::Migration[8.0]
  def change
    add_column :cards, :position, :integer
  end
end
