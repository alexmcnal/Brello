class ColumnsController < ApplicationController 
  
  def show
    @project = Project.find(params[:project_id])
    @column = @project.columns.find(params[:id])
  end

  def new
    @project = Project.find(params[:project_id])
    @column = @project.columns.build
  end

  def create
    @project = Project.find(params[:project_id])
    @column = @project.columns.build(column_params)
    if @column.save
      redirect_to project_path(@project), notice: 'Column Created'
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
    @project = Project.find(params[:project_id])
    @column = @project.columns.find(params[:id])
  end
  
  def update
    @project = Project.find(params[:project_id])
    @column = @project.columns.find(params[:id])
    if @column.update(column_params)
      redirect_to project_path(@project), notice: "Column Updated"
    else
      render :edit, status: :unprocessable_entity
    end
  end

  private

  def column_params
    params.require(:column).permit(:name, :description)
  end
end
