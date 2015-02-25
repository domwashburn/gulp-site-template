# gulp-site-template
A comprehensive site template for development using Gulp.js as a task runner

## Features
- configured with a config.rb
- SASS compiling with multi-level directory support
  - Support for Compass, Breakpoint and Susy (just install the gems)
- compass compiling 
	- be sure to navigate to your project directory via terminal and run ````compass init```` so that compass can generate it's own config.rb
- HTML templating (easily removed if unnecessary)
- JavaScript concatenation
- Live change reloading with BrowserSync

#### Todo's
 - create base susy grid structure
 - clean up the mixins
 - clean up the functions
 - consider a development and public sub directories to clean up the whole repositories structure
 - fix and or remove the HTML templating feature
 - create a gem file
 - add versioning to the gulp file 
 - clean out unused packages from the packages.json
 - add support for CoffeeScript
 - ~~integrate HUB~~
