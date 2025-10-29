class ApplicationRecord < ActiveRecord::Base
  primary_abstract_class

  def fingerprint
    Digest::MD5.hexdigest("#{self.class.name.downcase}:#{id}:#{updated_at.to_f}")
  end
end
