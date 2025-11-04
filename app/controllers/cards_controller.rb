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
    @card = Forms::CreateCard.new
    @available_columns = @board.columns
  end

  def create
    @project = Project.find(params[:project_id])
    @board = @project.boards.find(params[:board_id])
    @card = Card.new(card_params)

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

      respond_to do |format|
        format.html { redirect_to project_board_path(@project, @board) }
        format.turbo_stream {
          render turbo_stream: [
            close_dialog,
            update_column(@card.column)
          ]
        }
        broadcast_card_updated(@card)
      end
    else
      @available_columns = @board.columns
      render :new, status: :unprocessable_content
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

      respond_to do |format|
        format.html { head :ok }
        format.turbo_stream { 
          render turbo_stream: update_card(@card)
        }
        format.json { head :ok }
      end

      # broadcast_card_updated(@card)
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

  def update_card(card)
    turbo_stream.replace(dom_id(card), partial: "cards/card", locals: { card: })
  end

  def update_column(column)
    turbo_stream.replace(dom_id(column), partial: "boards/columns/column", locals: { column: })
  end

  def broadcast_card_updated(card)
    ActionCable.server.broadcast('cards', {
      action: 'cardUpdated',
      card: card,
      dom_id: dom_id(card),
      additional_data: { source_id: @cable_client_id }
    })
  end
end
