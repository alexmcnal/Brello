class CardsController < ApplicationController
  def index
    @cards_by_status = Card.by_status
  end

  def show
    @board = Board.find(params[:board_id])
    @project = @board.project
    @card = Card.find(params[:id])
    @available_columns = @board.columns
  end

  def new
    @project = Project.find(params[:project_id])
    @board = @project.boards.find(params[:board_id])
    @card = Card.new
    @available_columns = @board.columns
  end

  def create
    @project = Project.find(params[:project_id])
    @board = @project.boards.find(params[:board_id])
    @card = Card.build(card_params)
    if @card.save

      Action.create!(
        user: current_user,
        card: @card,
        action: "created_card",
        metadata: {
          title: @card.title,
          description: @card.description
        }
      )
      redirect_to project_board_path(@project, @board)
    else
      @available_columns = @board.columns
      render :new, status: :unprocessable_entity
    end
  end

  def edit
    @card = Card.find(params[:id])
    @available_columns = @board.columns
  end

  def update
    @board = Board.find(params[:board_id])
    @project = @board.project

    @card = Card.find(params[:id])
    @card.attributes = card_params

    card_changes = @card.changes
    if @card.save
      if params[:position].present?
        @card.insert_at(params[:position].to_i)
      end

      if card_changes.any?
        Action.create!(
          user: current_user,
          card: @card,
          action: "updated_card",
          metadata: card_changes
        )
      end

      # redirect_to project_board_path(@project, @board), notice: "Card updated successfully"
      respond_to do |format|
        format.html { redirect_to project_board_path(@project, @board), notice: "Card updated successfully" }
        format.turbo_stream { 
          Turbo::StreamsChannel.broadcast_replace_to(
            dom_id(@project, :board),
            target: dom_id(@card, :board),
            partial: "cards/card",
            locals: { card: @card, board: @board, project: @project }
          )
          head :ok
        }
      end
    else
      @available_columns = @board.columns
      render :edit
    end
  end

  def destroy
    @board = Board.find(params[:board_id])
    @project = @board.project
    @card = Card.find(params[:id])
    @card.destroy
    redirect_to project_board_path(@project, @board), notice: "Card deleted"
  end

  private

  def card_params
    params.require(:card).permit(:title, :description, :column_id, :status, :position)
  end
end
