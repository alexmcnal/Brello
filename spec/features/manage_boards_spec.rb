require 'rails_helper'

RSpec.describe 'Manage Boards', type: :feature, js: true do
  fixtures :all

  before do
    sign_in
  end

  scenario 'index page displays newly created boards' do
    Capybara.using_wait_time(5) do
      visit root_path
      click_on 'Project 1'
      click_on 'New Board'
      fill_in 'Name', with: 'Newly created board'
      fill_in 'Description', with: 'Newly created board description'
      click_on('Save Board')
      expect(page).to have_content("Project 1"), "not on project index page"
      expect(page).to have_content("Newly created board"), "no board shown"
    end
  end

  scenario 'edited boards values change when edited' do
    visit root_path
    click_on 'Project 1'
    click_on 'New Board'
    fill_in 'Name', with: 'Newly created board'
    fill_in 'Description', with: 'Newly created board description'
    click_on('Save Board')

    click_on('Newly created board')
    click_on('Edit Board')
    fill_in 'Name', with: 'Newly created board edited'
    fill_in 'Description', with: 'Newly Created board description edited'
    click_on('Save Board')
    expect(page).to have_content("Newly created board edited"), "edited board hasn't changed when edited"
  end
end
