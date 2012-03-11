var runcmd = require('../lib/paprika').runcmd;
  pa = runcmd.processArguments;

describe('runcmd', function () {
  describe('parameter parsing', function () {
    it('should support parameter: cmd', function () {
      expect(pa('cmd')).toEqual({
        cmd: 'cmd',
        args: [],
        options: {}
      });
    });
    
    it('should support parameters: cmd, callback', function () {
      var callback = function () {},
        params = pa('cmd', callback);

      expect(params).toEqual({
        cmd: 'cmd',
        args: [],
        options: {},
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
        options: {}
      });
    });

    it('should support parameters: cmd, args, callback', function () {
      var args = ['test'],
        callback = function () {},
        params = pa('cmd', args, callback);

      expect(params).toEqual({
        cmd: 'cmd',
        args: args,
        options: {},
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

    it('should require cmd parameter to be a string', function () {
      expect(function () {
        runcmd([]);
      }).toThrow(new Error('Invalid parameter: cmd.'));
    });
  });

});
