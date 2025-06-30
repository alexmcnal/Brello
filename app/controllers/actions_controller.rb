class ActionsController < ApplicationController

  def index
    @actions = Action.order(created_at: :desc)
  end
end