require 'rails_helper'

RSpec.describe Project, type: :model do
  describe 'validations' do
    it 'is valid with a name' do
      project = Project.new(name: 'My Project', description: 'Test description')
      expect(project).to be_valid
    end

    it 'is invalid without a name' do
      project = Project.new(name: nil, description: 'Test description')
      expect(project).not_to be_valid
      expect(project.errors[:name]).to include("can't be blank")
    end
  end
end
