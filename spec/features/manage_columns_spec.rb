require 'rails_helper'

RSpec.describe 'Manage Columns', type: :feature, js: true do
  fixtures :all
  
  before do
    sign_in
  end

  scenario 'newly created column shows on project show page' do
    visit root_path

    click_on 'project one'
    expect(page).to have_content('New Column'), 'Expected link to new column to be on the project show page, but was not found'

    click_on 'New Column'

    fill_in "Name", with: "In Progress"
    fill_in "Description", with: "In Progress description"

    click_on 'Save Column'

    expect(page).to have_content('In Progress'), 'Expected new column to be on the project show page'
    expect(page).to have_content('In Progress description'), 'Expected new column description to be on the project show page'
  end

  scenario 'column values change when edited' do
    visit root_path

    click_on 'project one'
    expect(page).to have_content('New Column')

    click_on 'New Column'

    fill_in "Name", with: "In Progress"
    fill_in "Description", with: "Newly created column description"

    click_on 'Save Column'

    expect(page).to have_content('Newly created column')
    expect(page).to have_content('Newly created column description')

    click_on 'In Progress'

    fill_in "Name", with: "In Progress EDITED"
    fill_in "Description", with: "In Progress description EDITED"

    click_on 'Save Column'

    expect(page).to have_content('In Progress EDITED'), "Expected column name to be changed when edited, but was not"
    expect(page).to have_content('In Progress description EDITED'), "Expected column description to be changed when edited, but was not"
  end
end
