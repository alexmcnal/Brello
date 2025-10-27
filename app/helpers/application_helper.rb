module ApplicationHelper

  def auto_refresh_turbo_frame_tag(dom_id,path_name:, path_params: [], fingerprint: false, &block)
    local_path_params = path_params.dup
    raise "Must provide at least one path param" if path_params.empty?
    fingerprinted_model = local_path_params.pop

    local_path_params << fingerprinted_model.fingerprinted_id
    data = {
      cache_key: fingerprinted_model.cache_key
    }

    turbo_frame_tag dom_id, src: send(path_name, *local_path_params), class: 'content', data: data do
      yield
    end
  end

end
