var run = require('../lib/paprika').run;
  pa = run.processArguments,
  defaultOptions = { stdout: true, stderr: true };

describe('run', function () {
  describe('parameter parsing', function () {
    it('should support parameter: cmd', function () {
      expect(pa('cmd')).toEqual({
        cmd: 'cmd',
        args: [],
        options: defaultOptions
      });
    });
    
    it('should support parameters: cmd, callback', function () {
      var callback = function () {},
        params = pa('cmd', callback);

      expect(params).toEqual({
        cmd: 'cmd',
        args: [],
        options: defaultOptions,
        callback: callback
      });
    });

    it('should support parameters: cmd, options', function () {
      var options = { bob: 'test' },
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
        options: defaultOptions
      });
    });

    it('should support parameters: cmd, args, callback', function () {
      var args = ['test'],
        callback = function () {},
        params = pa('cmd', args, callback);

      expect(params).toEqual({
        cmd: 'cmd',
        args: args,
        options: defaultOptions,
        callback: callback
      });
    });

    it('should support parameters: cmd, args, options', function () {
      var args = ['test'],
        options = { bob: 'test' },
        params = pa('cmd', args, options);

      expect(params).toEqual({
        cmd: 'cmd',
        args: args,
        options: options
      });
    });

    it('should support parameters: cmd, args, options', function () {
      var callback = function () {},
        options = { bob: 'test' },
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
        options = { bob: 'test' },
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
        options: defaultOptions
      });
    });

    it('should require cmd parameter to be a string', function () {
      expect(function () {
        pa();
      }).toThrow(new Error('Invalid parameter: cmd.'));
    });
  });

});
