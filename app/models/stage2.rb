class Stage2 < ActiveSupport::CurrentAttributes

  Change = Struct.new(:id,:type, :cache_key, :fingerprint) do
    def self.from_object(object)
      new(
        object.id, 
        object.class.name.downcase, 
        object.cache_key, 
        object.fingerprint
      )
    end
  end

  def self.track_changed(object)
    tracked_objects[object.cache_key] = Change.from_object(object)
  end

  def self.broadcast_changes(channel)
    tracked_objects.each do |cache_key, change|
      broadcast_change(channel, change)
    end
  end

  def self.tracked_objects
    @tracked_objects ||= {}
  end

  def self.broadcast_change(channel, change)
    Turbo::StreamsChannel.broadcast_action_to(
      channel,
      action: 'object_updated',
      attributes: { 
        id: change.id, 
        type: change.type, 
        cache_key: change.cache_key, 
        fingerprint: change.fingerprint
      },
      render: false
    )
  end

end