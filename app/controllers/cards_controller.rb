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
      redirect_to cards_path(@card)
    else
      render :new, status: :unprocessable_entity
    end
  end

  def update
    @card = Card.find(params[:id])

    if @card.update(card_params)
      redirect_to @card, notice: "Card updated successfully"
    else
      render :edit
    end
  end

  private

  def card_params
    params.require(:card).permit(:title, :description)
  end
end
