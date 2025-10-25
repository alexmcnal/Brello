class Boards::ColumnsController < ApplicationController
  def show
    @board = Board.find(params[:board_id])
    @project = @board.project
    @column = @board.columns.find(params[:id])
    @board_column = @board.board_columns.find_by(column_id: @column.id)
    render locals: { column: @column, board_column: @board_column }
  end
end
