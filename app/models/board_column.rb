class BoardColumn < ApplicationRecord
  belongs_to :board
  belongs_to :column

  validates :column_id, uniqueness: { scope: :board_id, message: "has already been added to this board" }
end
