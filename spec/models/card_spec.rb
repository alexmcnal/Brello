require 'rails_helper'

RSpec.describe Card, type: :model do
  describe 'validations' do
    it 'is valid with a title' do
      card = Card.new(title: 'My Card', description: 'Test Description')
      expect(card).to be_valid
    end

    it 'is invalid without a title' do
      card = Card.new(description: 'Test Description')
      expect(card).not_to be_valid
      expect(card.errors[:title]).to include("can't be blank")
    end
  end
end

