class ProjectsController < ApplicationController 
  
  def show
    @project = Project.find(params[:id])
  end

  def new
    @project = Project.new
  end

  def create
    @project = Project.new(project_params)
    if @project.save
      redirect_to root_path, notice: "Project Created"
    else
      render :new
    end
  end

  def edit
    @project = Project.find(params[:id])
  end

  def update
    @project = Project.find(params[:id])
    if @project.update(project_params)
      redirect_to root_path, notice: "Project Updated"
    else
      render :edit
    end
  end

  private

  def project_params
    params.require(:project).permit(:name, :description)
  end

end
