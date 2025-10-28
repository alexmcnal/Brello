module ApplicationHelper

  def auto_refresh_turbo_frame_tag(dom_id, object:, **attributes, &block)
    data = { 
      controller: "refresh", 
      refresh_cache_key_value: object.cache_key 
    } 

    attributes[:data] = data
    turbo_frame_tag dom_id, **attributes, &block
  end

end
