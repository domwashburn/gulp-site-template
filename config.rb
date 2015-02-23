# Require any additional compass plugins here.
require 'compass'
require 'susy'
require 'breakpoint'
require 'compass/import-once/activate'

# Set this to the root of your project when deployed:
http_path = '/'
css_dir = 'assets/css'
sass_dir = 'assets/scss'
scss_dir = 'assets/scss'
images_dir = 'assets/images'
javascripts_dir = 'assets/scripts'
fonts_dir = 'assets/fonts'

output_style = :expanded
environment = :production

# To enable relative paths to assets via compass helper functions. Uncomment:
relative_assets = true

line_comments = false
color_output = false

preferred_syntax = :scss

#enable source maps for SCSS debugging
sass_options = {:sourcemap => true}