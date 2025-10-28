class Forms::CreateCard
  include ActiveModel::Model

  attr_accessor :title, :description, :column_id

  validates :title, presence: true
  validates :description, presence: true
  validates :column_id, presence: true

  def self.model_name
    ActiveModel::Name.new(Card)
  end

  def save
    false
  end
end