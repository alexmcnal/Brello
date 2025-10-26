namespace :heroicons do
  desc "Download Heroicons"
  task :download do
    require 'fileutils'
    require 'tmpdir'

    repo_url = 'https://github.com/tailwindlabs/heroicons.git'
    project_root = File.expand_path('../../', __dir__)
    dest_dir = File.join(project_root, 'app', 'assets', 'images', 'heroicons')

    Dir.mktmpdir('heroicons-') do |tmp_dir|
      clone_cmd = ['git', 'clone', '--depth', '1', repo_url, tmp_dir]
      unless system(*clone_cmd)
        raise "Failed to clone #{repo_url}"
      end

      src_dir = File.join(tmp_dir, 'src')
      unless Dir.exist?(src_dir)
        raise "Source directory not found: #{src_dir}"
      end

      FileUtils.rm_rf(dest_dir)
      FileUtils.mkdir_p(dest_dir)

      entries = Dir.glob(File.join(src_dir, '*'))
      entries.each do |entry|
        FileUtils.cp_r(entry, dest_dir)
      end
    end

    puts "Heroicons SVGs copied to #{dest_dir}"
  end
end