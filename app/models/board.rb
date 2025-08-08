class Board < ApplicationRecord
  belongs_to :project
  has_many :board_columns
  has_many :columns, through: :board_columns

  validates :name, presence: true
end
