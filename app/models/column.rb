class Column < ApplicationRecord

  has_many :cards
  has_many :board_columns
  has_many :boards, through: :board_columns
  belongs_to :project

  validates :name, presence: true
end
