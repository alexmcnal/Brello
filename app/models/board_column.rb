class BoardColumn < ApplicationRecord
  belongs_to :board
  belongs_to :column
end
