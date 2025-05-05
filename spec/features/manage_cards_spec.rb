require 'rails_helper'

RSpec.describe 'Manage Cards', type: :feature, js: true do

  scenario 'index page show all cards' do
    Card.create!(title: 'Test Card', description: 'This is a test card')

    visit cards_path

    expect(page).to have_css('.card'), 'No cards found on the page'

    within('.card') do
      expect(page).to have_css('.card__title'), 'Card title div not found'
      expect(page).to have_css('.card__description'), 'Card description div not found'

      within('.card__title') do
        expect(page).to have_content('Test Card'), 'Card title not found'
      end
      within('.card__description') do
        expect(page).to have_content('This is a test card'), 'Card description not found'
      end
    end
  end

  describe 'Create a new card' do
    scenario 'new cards appear on the board' do
      visit cards_path

      click_on 'Add Card'
      fill_in 'Title', with: 'New Card'
      fill_in 'Description', with: 'This is a new card'
      click_on 'Create Card'

      visit cards_path

      expect(page).to have_css('.card'), 'No cards found on the page'
      within('.card') do
        expect(page).to have_css('.card__title'), 'Card title div not found'
        expect(page).to have_css('.card__description'), 'Card description div not found'

        within('.card__title') do
          expect(page).to have_content('New Card'), 'Card title not found'
        end
        within('.card__description') do
          expect(page).to have_content('This is a new card'), 'Card description not found'
        end
      end


    end
  end

end
