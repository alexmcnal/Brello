# frozen_string_literal: true

require 'capybara/rails'
require 'capybara/rspec'
require 'capybara/cuprite'

# require "capybara-screenshot"
# require "selenium-webdriver"

# Load the custom selectors from the support directory
Dir[Rails.root.join('spec/support/selectors/**/*.rb')].each { |f| require f }

# RSpec.configure do |config|
#   config.include(ScopedSelectors, type: :feature)
# end

require 'pry'

SELENIUM_HOST = ENV['SELENIUM_HOST'] || 'selenium'
SELENIUM_PORT = ENV['SELENIUM_PORT'] || '4444'
TEST_APP_HOST = ENV['TEST_APP_HOST'] || 'properties'
TEST_APP_PORT = ENV['TEST_APP_PORT'] || '4000'

Capybara.register_driver(:cuprite) do |app|
  running_vnc = !%x(ps aux | grep vnc | grep -v grep).empty?

  if running_vnc
    puts 'Running in VNC mode'
  end

  Capybara::Cuprite::Driver.new(
    app,
    browser_options: {
      'no-sandbox':                  nil,
      'disable-gpu':                 nil,
      'disable-software-rasterizer': nil,
      'disable-dev-shm-usage':       nil,
    },
    process_timeout: 2,
    window_size: [1200, 800],
    xvfb: !running_vnc,
    headless: !running_vnc
  )
end

Capybara.configure do |config|
  config.run_server = true
  config.default_driver = :rack_test
  config.always_include_port = true
  config.raise_server_errors = true
  config.javascript_driver = :cuprite
  config.server = :puma, { Silent: true }
  config.match = :prefer_exact
  config.default_max_wait_time = 20
end
