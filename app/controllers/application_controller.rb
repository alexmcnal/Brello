class ApplicationController < ActionController::Base

  include ActionView::RecordIdentifier

  before_action :set_current_request_details
  before_action :authenticate

  helper_method :current_user

  def current_user
    Current.session&.user
  end

  private

  def authenticate
    if session_record = Session.find_by_id(cookies.signed[:session_token])
      Current.session = session_record
    else
      redirect_to sign_in_path
    end
  end

  def set_current_request_details
    Current.user_agent = request.user_agent
    Current.ip_address = request.ip
  end

  def close_dialog
    turbo_stream.replace('dialog', partial: 'dialog')
  end
end
