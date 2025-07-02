class BoardsController < ApplicationController
  def index
  end
  
  def show
    @board = Board.find(params[:id])
    @columns = @board.columns.includes(:cards).order(:position)
    @new_column = Column.new
  end
  
  def create
  end

  def new
  end
end