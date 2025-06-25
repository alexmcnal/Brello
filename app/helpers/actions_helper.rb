module ActionsHelper
  def render_action_changes(action)
    case action.action
    when "created_card"
      safe_join(action.metadata.map do |field, value|
        content_tag(:div, class: "change") do
          "<strong>#{field.capitalize}:</strong> \"#{value}\"".html_safe
        end
      end)
    else
      safe_join(action.metadata.map do |field, change|
        content_tag(:div, class: "change") do
          "<strong>#{field.capitalize}:</strong> From: \"#{change.first}\" → To: \"#{change.last}\"".html_safe
        end
      end)
    end
  end

  def render_action(action)
    partial_name = "actions/action_#{action.action}"
    render partial_name, action:
  end
end
