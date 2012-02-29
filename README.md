# Paprika - Sprinkle JavaScript tasks on your .NET build

Paprika is a JavaScript library of tasks commonly performed while building .NET applications.

## Tasks Included

At the moment, there is only one task. Hopefully, this will fill out as more tasks are necessary!

### MSBuild task

Execute MSBuild using this task by passing in the required parameters.

    var msbuild = require('paprika').msbuild;
    msbuild({
        file: '../MySolution.sln'
      , version: 'net35'
      , processor: 'x86'
      , targets: ['Clean', 'Build']
      , properties: { Configuration: 'Release' }
      , show_stdout: false
      , buildCommand: 'xbuild' // customize the location of MSBuild.exe (or xbuild)
      , extraParameters: '/nologo /version' // add any additional parameters
    });
