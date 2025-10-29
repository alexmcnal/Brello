namespace :heroicons do
  desc "Download Heroicons (24/outline)"
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

      src_dir = File.join(tmp_dir, 'src', '24', 'outline')
      unless Dir.exist?(src_dir)
        raise "Source directory not found: #{src_dir}"
      end

      FileUtils.rm_rf(dest_dir)
      FileUtils.mkdir_p(dest_dir)

      svgs = Dir.glob(File.join(src_dir, '*.svg'))
      svgs.each do |svg|
        FileUtils.cp(svg, dest_dir)
      end
    end

    puts "Heroicons 24/outline SVGs copied to #{dest_dir}"
  end

  desc "Generate CSS mask classes for Heroicons"
  task :generate_css do
    require 'fileutils'

    project_root = File.expand_path('../../', __dir__)
    heroicons_dir = File.join(project_root, 'app', 'assets', 'images', 'heroicons')
    css_file = File.join(project_root, 'app', 'assets', 'stylesheets', 'heroicons.css')

    unless Dir.exist?(heroicons_dir)
      puts "Heroicons directory not found: #{heroicons_dir}"
      puts "Run 'rake heroicons:download' first"
      exit 1
    end

    css_content = []
    css_content << "/* Auto-generated Heroicons CSS classes */"
    css_content << "/* Run 'rake heroicons:generate_heroicons_css' to regenerate */"
    css_content << ""

    svg_files = Dir.glob(File.join(heroicons_dir, '*.svg')).sort
    
    svg_files.each do |svg_file|
      icon_name = File.basename(svg_file, '.svg')
      css_class_name = "heroicon-#{icon_name}"
      asset_path = "heroicons/#{File.basename(svg_file)}"
      
      css_content << ".#{css_class_name} {"
      css_content << "  mask: url('#{asset_path}') no-repeat center;"
      css_content << "  mask-size: contain;"
      css_content << "  -webkit-mask: url('#{asset_path}') no-repeat center;"
      css_content << "  -webkit-mask-size: contain;"
      css_content << "  background-color: currentColor;"
      css_content << "  display: inline-block;"
      css_content << "  width: 1.5rem;"
      css_content << "  height: 1.5rem;"
      css_content << "}"
      css_content << ""
    end

    File.write(css_file, css_content.join("\n"))
    
    puts "Generated #{css_file} with #{svg_files.length} icon classes"
    puts "Use classes like: heroicon-academic-cap, heroicon-arrow-left, etc."
  end
end