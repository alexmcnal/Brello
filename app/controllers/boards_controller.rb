class BoardsController < ApplicationController

  def show
    @project = Project.find(params[:project_id])
    @board = @project.boards.find(params[:id])
  end
  
  def new
    @project = Project.find(params[:project_id])
    @board = @project.boards.build
  end

  def create
    @project = Project.find(params[:project_id])
    @board = @project.boards.build(board_params)
    if @board.save
      redirect_to project_path(@project), notice: "Board Created"
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
    @project = Project.find(params[:project_id])
    @board = @project.boards.find(params[:id])
  end

  def update
    @project = Project.find(params[:project_id])
    @board = @project.boards.find(params[:id])
    if @board.update(board_params)
      redirect_to project_path(@project), notice: "Board Updated"
    else
      render :edit, status: :unprocessable_entity
    end
  end

  private

  def board_params
    params.require(:board).permit(:name, :description)
  end
end