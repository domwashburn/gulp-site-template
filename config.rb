# Require any additional compass plugins here.
require 'compass'
require 'susy'
require 'breakpoint'

# Set this to the root of your project when deployed:
http_path = '/'
project_path = '/'
css_dir = 'css'
sass_dir = 'scss'
#scss_dir = 'scss'
images_dir = 'images'
javascripts_dir = 'scripts'
fonts_dir = 'fonts'

output_style = :expanded
environment = :production

# To enable relative paths to assets via compass helper functions. Uncomment:
#relative_assets = true

line_comments = false
color_output = false

preferred_syntax = :scss

#enable source maps for SCSS debugging
sass_options = {:sourcemap => true}