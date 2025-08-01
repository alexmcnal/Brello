require 'rails_helper'

RSpec.describe 'Manage Cards', type: :feature, js: true do
  fixtures :all

  before do
    sign_in
  end

  describe 'create a new project' do
    scenario 'new project form outputs correct error message if fields are not filled in' do
      visit root_path

      click_on "New Project"
      expect(page).not_to have_content("Dashboard"), "Still on project index page"
      expect(page).to have_css('.form__button'), "Form button not found"
      click_on "Save Project"
      expect(page).to have_content("can't be blank"), "Error message not displayed"
    end

    scenario 'new project is created once the forms parameters are successfully met' do
      visit root_path

      click_on "New Project"
      expect(page).not_to have_content("Dashboard"), "Still on project index page"
      expect(page).to have_css('.form__button'), "Form button not found"

      fill_in "Name", with: "Newly Created Project"
      fill_in "Description", with: "New Project description"

      click_on "Save Project"

      expect(page).to have_content("Dashboard"), "Saving project not redirected to project Dashboard"
      expect(page).to have_content("Newly Created Project"), "Newly created projects aren't displaying"
    end

    scenario 'edited projects values change when edited' do
      visit root_path

      click_on "New Project"
      expect(page).not_to have_content("Dashboard"), "Still on project index page"
      expect(page).to have_css('.form__button'), "Form button not found"

      fill_in "Name", with: "Newly Created Project"
      fill_in "Description", with: "New Project description"

      click_on "Save Project"

      expect(page).to have_content("Dashboard"), "Saving project not redirected to project Dashboard"
      expect(page).to have_content("Newly Created Project"), "Newly created projects aren't displaying"

      click_on "Newly Created Project"
      expect(page).not_to have_content("Dashboard"), "Project Link not redirected to show page"
      expect(page).to have_content("Show Page"), "Project show page not displayed"
      expect(page).to have_content("Edit Project"), "Project Edit link not found"

      click_on "Edit Project"

      fill_in "Name", with: "Newly Created Project Edited"
      fill_in "Description", with: "New Project Description Edited"
      click_on "Save Project"

      expect(page).to have_content("Dashboard"), "Save Project not redirected to project dashboard"
      expect(page).to have_content("Newly Created Project Edited"), "Project title has not changed when edited"
      expect(page).to have_content("New Project Description Edited"), "Project description has not changed when edited"
    end
  end
end
