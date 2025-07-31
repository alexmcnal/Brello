require 'rails_helper'

RSpec.describe 'Manage Columns', type: :feature, js: true do
  fixtures :all
  
  before do
    sign_in
  end

  scenario 'New column adheres to provided parameters' do
    visit root_path

    click_on 'project one'
    expect(page).to have_content('New Column')

    click_on 'New Column'

    fill_in "Name", with: "Newly created column"
    fill_in "Description", with: "Nely created column description"

    click_on 'Save Column'

    expect(page).to have_content('Newly created column')

    # This should check that the column is on the project show page

  end
end