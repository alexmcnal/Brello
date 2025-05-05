class CardsController < ApplicationController
  def index
    @cards = Card.all
  end

  def new
    @card = Card.new
  end

  def create
    @card = Card.build(card_params)
    if @card.save
      redirect_to cards_path(@card)
    else
      render :new, status: :unprocessable_entity
    end
  end

  private

  def card_params
    params.require(:card).permit(:title, :description)
  end
end
