var run = require(process.env.paprika || '..').run;
  pa = run.processArguments,
  defaultOptions = function () {
    return { stdout: true, stderr: true }
  },
  customOptions = function () {
    return { stdout: false, stderr: false }
  };

describe('run', function () {
  describe('parameter parsing', function () {
    it('should support parameter: cmd', function () {
      expect(pa('cmd')).toEqual({
        cmd: 'cmd',
        args: [],
        options: defaultOptions()
      });
    });
    
    it('should support parameters: cmd, callback', function () {
      var callback = function () {},
        params = pa('cmd', callback);

      expect(params).toEqual({
        cmd: 'cmd',
        args: [],
        options: defaultOptions(),
        callback: callback
      });
    });

    it('should support parameters: cmd, options', function () {
      var options = customOptions(),
        params = pa('cmd', options);

      expect(params).toEqual({
        cmd: 'cmd',
        args: [],
        options: options
      });
    });

    it('should support parameters: cmd, args', function () {
      var args = ['test'],
        params = pa('cmd', args);

      expect(params).toEqual({
        cmd: 'cmd',
        args: args,
        options: defaultOptions()
      });
    });

    it('should support parameters: cmd, args, callback', function () {
      var args = ['test'],
        callback = function () {},
        params = pa('cmd', args, callback);

      expect(params).toEqual({
        cmd: 'cmd',
        args: args,
        options: defaultOptions(),
        callback: callback
      });
    });

    it('should support parameters: cmd, args, options', function () {
      var args = ['test'],
        options = customOptions(),
        params = pa('cmd', args, options);

      expect(params).toEqual({
        cmd: 'cmd',
        args: args,
        options: options
      });
    });

    it('should support parameters: cmd, args, options', function () {
      var callback = function () {},
        options = customOptions(),
        params = pa('cmd', callback, options);

      expect(params).toEqual({
        cmd: 'cmd',
        args: [],
        options: options,
        callback: callback
      });
    });

    it('should support parameters: cmd, args, options', function () {
      var args = ['test'],
        callback = function () {},
        options = customOptions(),
        params = pa('cmd', args, callback, options);

      expect(params).toEqual({
        cmd: 'cmd',
        args: args,
        options: options,
        callback: callback
      });
    });

    it('should support passing command line arguments as string', function () {
      var params = pa('cmd', 'my arguments');
      expect(params).toEqual({
        cmd: 'cmd',
        args: ['my arguments'],
        options: defaultOptions()
      });
    });

    it('should require cmd parameter to be a string', function () {
      expect(function () {
        pa();
      }).toThrow(new Error('Invalid parameter: cmd.'));
    });
  });

  describe('options', function () {
    it('should be able to specify whether to show sdtout', function () {
      runAndVerifyOption({ stdout: false }, { stdout: false, stderr: true });
    });

    it('should be able to specify whether to show stderr', function () {
      runAndVerifyOption({ stderr: false }, { stdout: true, stderr: false });
    });

    function runAndVerifyOption(options, expected) {
      expect(pa('cmd', options)).toEqual({
        cmd: 'cmd',
        args: [],
        options: expected
      });
    }
  });
});
