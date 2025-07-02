class Board < ApplicationRecord
    has_many :columns, -> { order(:position) }
end
