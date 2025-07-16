class Card < ApplicationRecord
  STATUSES = [ "todo", "in_progress", "done" ]

  acts_as_list scope: [:status]

  has_many :actions

  def self.by_status
    cards_by_status = all.order(:status, :position).group_by(&:status)

    cards_by_ordered_status = {}

    # Add an empty array for all the statuses that have no cards
    STATUSES.each do |status|
      cards_by_ordered_status[status] = cards_by_status[status] || []
    end

    cards_by_ordered_status
  end
end
