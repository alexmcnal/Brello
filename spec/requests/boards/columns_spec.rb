require 'rails_helper'

RSpec.describe "Boards::Columns", type: :request do
  describe "GET /show" do
    it "returns http success" do
      get "/boards/columns/show"
      expect(response).to have_http_status(:success)
    end
  end

end
