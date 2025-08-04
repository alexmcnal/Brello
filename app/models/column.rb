class Column < ApplicationRecord

  has_many :cards
  has_many :boards, through: :board_columns

  validates :name, presence: true
end
