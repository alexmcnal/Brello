require 'rails_helper'

RSpec.describe 'Manage Boards', type: :feature, js: true do
  fixtures :all

  before do
    sign_in
  end

  scenario 'index page displays newly created boards' do
    Capybara.using_wait_time(5) do
      visit root_path
      click_on 'project one'
      click_on 'New Board'
      fill_in 'Name', with: 'Newly created board'
      fill_in 'Description', with: 'Newly created board description'
      click_on('Save Board')
      expect(page).to have_content("project one"), "not on project index page"
      expect(page).to have_content("Newly created board"), "no board shown"
    end
  end

  scenario 'edited boards adhere to changed parameters' do
    visit root_path
      click_on 'project one'
      click_on 'New Board'
      fill_in 'Name', with: 'Newly created board'
      fill_in 'Description', with: 'Newly created board description'
      click_on('Save Board')

      click_on('Newly created board')
      expect(page).to have_content("SHOW PAGE"), "Not on show page"
      click_on('Edit Board')
      fill_in 'Name', with: 'Newly created board edited'
      fill_in 'Description', with: 'Newly Created board description edited'
      click_on('Save Board')
      expect(page).to have_content("Newly created board edited"), "edited board hasn't adhered to changed parameters"
  end
end
