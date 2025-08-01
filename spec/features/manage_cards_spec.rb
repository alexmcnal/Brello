require 'rails_helper'

RSpec.describe 'Manage Cards', type: :feature, js: true do
  fixtures :all

  before do
    sign_in
  end

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

  describe 'create a new card' do
    scenario 'new cards appear on the board' do
      visit cards_path

      click_on 'Add Card'
      fill_in 'Title', with: 'New Card'
      fill_in 'Description', with: 'This is a new card'
      click_on 'Save Card'

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

  describe 'edit existing card' do
    scenario 'existing cards can be edited and adhere to changes' do
      visit cards_path

      click_on 'Add Card'
      fill_in 'Title', with: 'Newly Created Card'
      fill_in 'Description', with: 'This is a new card'
      click_on 'Save Card'

      visit cards_path

      expect(page).to have_css('.card'), 'No cards found on the page'
      within('.card') do
        expect(page).to have_css('.card__title'), 'Card title div not found'
        expect(page).to have_css('.card__description'), 'Card description div not found'

        within('.card__title') do
          expect(page).to have_content('Newly Created Card'), 'Card title not found'
        end
        within('.card__description') do
          expect(page).to have_content('This is a new card'), 'Card description not found'
        end
      end

      click_on 'Newly Created Card'
      fill_in 'Title', with: 'Newly Created Card Edit'
      fill_in 'Description', with: 'This is a new card edit'
      click_on 'Save Card'
      expect(page).to have_content('Newly Created Card Edit'), 'Card title has not changed when edited'
      expect(page).to have_content('This is a new card edit'), 'Card description has not changed when edited'
    end
  end
end
