class Project < ApplicationRecord
  has_many :boards
  has_many :columns
  
  validates :name, presence: true
end
