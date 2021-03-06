'use strict';

var defaultAssets = require('./config/env/all');

module.exports = function(grunt) {
  // Unified Watch Object
  var watchFiles = {
    serverViews: ['app/views/**/*.*'],
    serverJS: ['gruntfile.js', 'server.js', 'config/**/*.js', 'app/**/*.js'],
    clientViews: ['public/modules/**/views/**/*.html'],
    clientJS: ['public/js/*.js', 'public/modules/**/*.js'],
    clientCSS: ['public/modules/**/*.css'],
  };

  // Project Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      serverViews: {
        files: watchFiles.serverViews,
        options: {
          livereload: true
        }
      },
      serverJS: {
        files: watchFiles.serverJS,
        options: {
          livereload: true
        }
      },
      clientViews: {
        files: watchFiles.clientViews,
        options: {
          livereload: true,
        }
      },
      clientJS: {
        files: watchFiles.clientJS,
        options: {
          livereload: true
        }
      },
      clientCSS: {
        files: watchFiles.clientCSS,
        tasks: ['csslint'],
        options: {
          livereload: true
        }
      },
      clientLESS: {
        files: defaultAssets.assets.less,
        tasks: ['less', 'csslint'],
        options: {
          livereload: true
        }
      }
    },
    jshint: {
      all: {
        src: defaultAssets.assets.shint,
        options: {
          jshintrc: true,
          reporter: require('jshint-stylish')
        }
      }
    },
    csslint: {
      options: {
        csslintrc: '.csslintrc',
      },
      all: {
        src: watchFiles.clientCSS
      }
    },
    less: {
      dist: {
        files: [{
          expand: true,
          src: defaultAssets.assets.less,
          ext: '.css',
          rename: function(base, src) {
            return src.replace('/less/', '/css/');
          }
        }]
      }
    },
    uglify: {
      production: {
        options: {
          mangle: false
        },
        files: {
          'public/dist/application.min.js': 'public/dist/application.js'
        }
      }
    },
    cssmin: {
      combine: {
        files: {
          'public/dist/application.min.css': '<%= applicationCSSFiles %>',
          'public/dist/vendor.min.css': defaultAssets.assets.lib.css
        }
      }
    },
    concat: {
      production: {
        options: {
          stripBanners: true
        },
        files: {
          'public/dist/vendor.min.js': defaultAssets.assets.lib.js
        }
      }
    },
    nodemon: {
      dev: {
        script: 'server.js',
        options: {
          ext: 'js,html',
          watch: watchFiles.serverViews.concat(watchFiles.serverJS)
        }
      }
    },
    'node-inspector': {
      custom: {
        options: {
          'web-port': 1337,
          'web-host': 'localhost',
          'debug-port': 5858,
          'save-live-edit': true,
          'no-preload': true,
          'stack-trace-limit': 50,
          'hidden': []
        }
      }
    },
    ngAnnotate: {
      production: {
        files: {
          'public/dist/application.js': '<%= applicationJavaScriptFiles %>'
        }
      }
    },
    concurrent: {
      default: ['nodemon', 'watch'],
      options: {
        logConcurrentOutput: true,
        limit: 10
      }
    },
    env: {
      test: {
        NODE_ENV: 'test'
      },
      dev: {
        NODE_ENV: 'development'
      },
      prod: {
        NODE_ENV: 'production'
      },
      secure: {
        NODE_ENV: 'secure'
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    },

    jasmine_nodejs: {
      options: {
        specNameSuffix: ["specs.js", "spec.js"],
        useHelpers: false,
        traceFatal: true
      },
      all: {
        specs: defaultAssets.assets.tests.server,
      }
    }
  });

  // Load NPM tasks
  require('load-grunt-tasks')(grunt);

  // Making grunt default to force in order not to break the project.
  grunt.option('force', true);

  // A Task for loading the configuration object
  grunt.task.registerTask('loadConfig', 'Task that loads the config into a grunt option.', function() {

    grunt.config.set('applicationJavaScriptFiles', defaultAssets.assets.js);
    grunt.config.set('applicationCSSFiles', defaultAssets.assets.css);
  });

  // Default task(s).
  grunt.registerTask('default', ['lint', 'concurrent:default']);

  // Debug task.
  grunt.registerTask('debug', ['lint', 'concurrent:debug']);

  // Secure task(s).
  grunt.registerTask('secure', ['env:secure', 'lint', 'concurrent:default']);

  // Lint task(s).
  grunt.registerTask('lint', ['jshint', 'csslint']);

  // Build task(s).
  grunt.registerTask('build', ['csslint', 'loadConfig', 'ngAnnotate', 'uglify', 'cssmin', 'concat']);

  // Test task.
  grunt.registerTask('test', ['test:server']);
	grunt.registerTask('test:server', ['env:test', 'jasmine_nodejs']);

  // Run the project in production mode
  grunt.registerTask('prod', ['build', 'env:prod', 'concurrent:default']);

};
