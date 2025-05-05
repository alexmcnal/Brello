require 'rails_helper'

RSpec.describe 'Manage Cards', type: :feature, js: true do

  scenario 'index page show all cards' do
    Card.create!(title: 'Test Card', description: 'This is a test card')

    visit cards_path

    within('.card') do
      within('.card__title') do
        expect(page).to have_content('Test Card')
      end
      within('.card__description') do
        expect(page).to have_content('This is a test card')
      end
    end
  end

  xdescribe 'Create a new card' do
    scenario 'new cards appear on the board' do
      visit '/'
    end
  end

end
