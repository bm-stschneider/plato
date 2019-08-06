'use strict';

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  var libFolder = process.env.DEV === libFolder + '' ? libFolder + '' : 'src';

  // Project configuration.
  grunt.initConfig({
    nodeunit: {
      files: ['test/**/*_test.js']
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib: {
        src: [libFolder + '/**/*.js', '!' + libFolder + '/assets/**/*.js']
      },
      test: {
        src: ['test/**/*.js','!test/fixtures/**/*.js']
      },
      assets: {
        src: [libFolder + '/assets/scripts/*.js']
      }
    },
    eslint: {
      options: {
        configFile: '.eslintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib: {
        src: [libFolder + '/**/*.js', '!' + libFolder + '/assets/**/*.js']
      },
      test: {
        src: ['test/**/*.js','!test/fixtures/**/*.js']
      },
      assets: {
        src: [libFolder + '/assets/scripts/*.js']
      }
    },
    uglify: {
      'assets' : {
        files : {
          'lib/assets/scripts/bundles/core-bundle.js' : [
            libFolder + '/assets/scripts/vendor/jquery-1.8.3.min.js',
            libFolder + '/assets/scripts/vendor/lodash.min.js',
            libFolder + '/assets/scripts/vendor/raphael-min.js',
            libFolder + '/assets/scripts/vendor/morris.min.js',
            libFolder + '/assets/scripts/vendor/jquery.fittext.js',
            libFolder + '/assets/scripts/vendor/bootstrap-tooltip.js',
            libFolder + '/assets/scripts/vendor/bootstrap-popover.js'
          ],
          'lib/assets/scripts/bundles/codemirror.js' : [
            libFolder + '/assets/scripts/vendor/codemirror/codemirror.js',
            libFolder + '/assets/scripts/vendor/codemirror/javascript.js',
            libFolder + '/assets/scripts/vendor/codemirror/util/searchcursor.js'
          ]
        }
      }
    },
    watch: {
      gruntfile: {
        files: '<%= eslint.gruntfile.src %>',
        tasks: ['eslint:gruntfile']
      },
      lib: {
        files: '<%= eslint.lib.src %>',
        tasks: ['eslint:lib', 'nodeunit']
      },
      test: {
        files: '<%= eslint.test.src %>',
        tasks: ['eslint:test', 'nodeunit']
      }
    },
    ts: {
      default : {
        tsconfig: './tsconfig.json'
      }
    },
    // casper : {
    //   test: {
    //     files: {
    //       'reports/casper.xml': [
    //         'test/casper-overview.js',
    //         'test/casper-sortable-file-list.js'
    //       ],
    //     },
    //     options : {
    //       test: true,
    //       verbose: true,
    //       'fail-fast': true,
    //       'log-level': 'error',
    //       concise: true,
    //       parallel : false,
    //       concurrency : 2
    //     }
    //   }
    // }
  });

  grunt.registerTask('runtest',function(){
    var done = this.async();

    grunt.util.spawn({
        cmd : './bin/plato',
        args : [
          '-q',
          '-dtmp',
          '-ttest report',
          'test/fixtures/a.js','test/fixtures/b.js','test/fixtures/c-es6.js','test/fixtures/d-es6.js','test/fixtures/empty.js'
        ]
      },
      function(err, result, code){
        console.log(result.stdout);
        console.log(result.stderr);
        if (err || code !== 0) {
          grunt.fatal('Running plato binary failed');
        }
        done();
      }
    );
  });

  grunt.registerTask('runbin',function(){
    var done = this.async();

    grunt.util.spawn({
        cmd : './bin/plato',
        args : [
          '-q',
          '-r',
          '-l.jshintrc',
          '-xvendor|bundles',
          '-dreports',
          '-tPlato report',
          libFolder + '/'
        ]
      },
      function(err, result, code){
        console.log(result.stdout);
        if (err || code !== 0) {
          console.log(err);
          grunt.fatal('Running plato binary failed');
        }
        done();
      }
    );
  });

  grunt.registerTask('optimize', ['uglify']);
  // Default task.
  grunt.registerTask('test', ['ts', 'jshint', 'eslint', 'nodeunit', 'runtest', 'runbin']);
  grunt.registerTask('default', ['test']);

};
