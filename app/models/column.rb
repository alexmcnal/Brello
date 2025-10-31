class Column < ApplicationRecord

  has_many :cards
  has_many :board_columns
  has_many :boards, through: :board_columns
  belongs_to :project

  validates :name, presence: true

  after_touch :broadcast_column_updated

  private

  def broadcast_column_updated
    Stage2.track_changed(self)

    # Turbo::StreamsChannel.broadcast_action_to(
    #   project,
    #   action: 'object_updated',
    #   attributes: { 
    #     id:, 
    #     type: self.class.name.downcase, 
    #     cache_key: self.cache_key,
    #     fingerprint: self.fingerprint
    #   },
    #   render: false
    # )
  end
end
