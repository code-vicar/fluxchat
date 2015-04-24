'use strict';

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        wiredep: {
            task: {
                src: ['client/index.mustache']
            }
        },
        compass: {
            dist: {
                options: {
                    sassDir: 'client/sass',
                    cssDir: 'client/css',
                    environment: 'production'
                }
            }
        }
    });

    // Default task.
    grunt.registerTask('default', ['wiredep', 'compass']);

};
