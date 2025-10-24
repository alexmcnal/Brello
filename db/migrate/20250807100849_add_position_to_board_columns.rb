class AddPositionToBoardColumns < ActiveRecord::Migration[8.0]
  def change
    add_column :board_columns, :position, :integer
  end
end
