class Project < ApplicationRecord
  has_many :boards
  
  validates :name, presence: true
end
