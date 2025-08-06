class BoardColumnsController < ApplicationController

  def new
    @board = Board.find(params[:board_id])
    @project = @board.project
    @board_column = @board.board_columns.build
    @available_columns = @project.columns - @board.columns
  end

  def create
    @project = Project.find(params[:project_id])
    @board = Board.find(params[:board_id])
    @board_column = @board.board_columns.build(board_column_params)

    if @board_column.save
      redirect_to project_board_path(@board.project, @board), notice: "Column added to board"
    else
      @available_columns = @project.columns
      render :new, status: :unprocessable_entity
    end
  end

  private

  def board_column_params
    params.require(:board_column).permit(:board_id, :column_id)
  end
end