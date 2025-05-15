class CardsController < ApplicationController
  def index
    @cards = Card.all
  end

  def new
    @card = Card.new
  end

  def show
    @card = Card.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    redirect_to cards_path
  end

  def edit
    @card = Card.find(params[:id])
  end

  def create
    @card = Card.build(card_params)
    if @card.save

      Action.create!(
        user: current_user,
        card: @card,
        action: "created_card",
        metadata:{
          title: @card.title,
          description: @card.description
        }
      )
      redirect_to cards_path(@card)
    else
      render :new, status: :unprocessable_entity
    end
  end

  def update
    @card = Card.find(params[:id])
    @card.attributes = card_params

    card_changes = @card.changes

    if @card.save
      if card_changes.any?
        Action.create!(
          user: current_user,
          card: @card,
          action: "updated_card",
          metadata: card_changes
        )
      end

      redirect_to @card, notice: "Card updated successfully"
    else
      render :edit
    end
  end

  def destroy
    @card = Card.find(params[:id])
    @card.destroy
    redirect_to cards_path, notice: 'Card deleted'
  end

  private

  def card_params
    params.require(:card).permit(:title, :description)
  end
end
