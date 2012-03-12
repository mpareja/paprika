# Paprika - Sprinkle JavaScript tasks on your .NET build

Paprika is a JavaScript library of tasks commonly performed while building .NET applications.

## Tasks Included

At the moment, there is only one task. Hopefully, this will fill out as more tasks are necessary!

### MSBuild task

Execute MSBuild using this task by passing in the required parameters. You can also include a callback function as a second parameter

    var msbuild = require('paprika').msbuild;
    msbuild({
        file: '../MySolution.sln'
      , version: 'net35'
      , processor: 'x86'
      , targets: ['Clean', 'Build']
      , properties: { Configuration: 'Release' }
      , stdout: false // prevent redirection to stdout
      , stderr: false // prevent redirection to stderr
      , buildCommand: 'xbuild' // customize the location of MSBuild.exe (or xbuild)
      , extraParameters: '/nologo /version' // add any additional parameters
    }, function () { complete(); });

You can specify default values to prevent repeating yourself.

    var msbuild = require('paprika').msbuild;
    msbuild.setDefaults({
        properties: { Configuration: 'Release' }
      , buildCommand: 'xbuild'
    });

### ZIP task

Run the zip command with the passed in command line arguments. This task determines what version of zip (www.info-zip.org) to use depending on the platform and architecture. The zip function accepts command line parameters as either a single string, or an array of strings.

    var zip = require('paprika').zip;
    zip('-r deploy_package ./package');
    zip(['-r', 'deploy_package', './package']);

### Run task

The run task takes the effort out of calling out to other processes. It takes care of operating system specific idiosyncrasies (I'm looking at you node for Windows) and assumes you either want output redirected to the console (default) or not at all. Here is a simple example to get started:

    run('pwd');

The run function requires one parameters: the filename (may include path) of the process to run. It has several optional parameters - here is the function signature along with some other examples:

    // run(cmd [, args] [, options] [, callback])
    var run = require('paprika').run;
    run('node', '--version', {
      stdout: false // by default, stdout is redirected to console
      stderr: false // by default, stderr is redirected to console
    }, function () { complete(); });

    run('mycmd', ['many', 'options']);

    run('prevent_meltdown', function (code) {
      if (code !== 0) {
        runLikeHell();
      }
    });
