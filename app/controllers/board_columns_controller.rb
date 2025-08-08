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

    def update
      @board_column = BoardColumn.find{params[:id]}
      if params[:position].present?
        @board.column.insert_at(params[:position].to_i)
        head :ok
      else
        render json: { error: 'No position given' }, status: :unprocessable_entity
      end
    end
  end

  private

  def board_column_params
    params.require(:board_column).permit(:board_id, :column_id)
  end
end