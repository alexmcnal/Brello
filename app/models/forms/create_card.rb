class Forms::CreateCard
  include ActiveModel::Model

  attr_accessor :title, :description, :column_id

  validates :title, presence: true
  validates :column_id, presence: true

  def self.model_name
    ActiveModel::Name.new(Card)
  end

  def save
    if valid?
      card = create_card
      record_action(card)
      broadcast_changes(card.project)
      true
    else
      false
    end
  end

  private

  def create_card
    Card.create!(title:, description:, column_id:)
  end

  def record_action(card)
    Action.create!(
      user: current_user,
      card: card,
      action: "created_card",
      metadata: {
        title: card.title,
        description: card.description
      }
    )
  end

  def broadcast_changes(project)
    Stage2.broadcast_changes(project)
  end

  def current_user
    Current.session&.user
  end
end