var nunit = require(process.env.paprika || '..').nunit,
  path = require('path'),
  fs = require('fs'),
  nunitDir = path.join('nunit', 'bin');

describe('nunit', function () {
  nunit.setDefaults({
    nunitDir: nunitDir,
    extraParameters: '/noxml',
    run_options: { stdout: false }
  });

  it('verifies nunit exists', function () {
    nunit('MyProject.UnitTests.dll', { nunitDir: 'doesntExist' }, function (err) {
      expect(err).toMatch('nunit');
      asyncSpecDone();
    });
    asyncSpecWait();
  });

  if (!fs.existsSync(nunitDir)) {
    // disable remaining specs
    console.log('!!! SKIPPING NUNIT TESTS !!!');
    return;
  }

  it('can run using 64-bit NUnit', function () {
    testProcessor('x64', /nunit-console.exe$/);
  });

  it('can run using 32-bit NUnit', function () {
    testProcessor('x86', /nunit-console-x86.exe$/);
  });

  it('uses x86 processor if not supplied', function () {
    testProcessor(null, /nunit-console-x86.exe$/);
  });

  function testProcessor(proc, expected) {
    var run = nunit.run,
      testdll = path.join('testdata', 'nunit', 'Passing.dll');
    nunit.run = function (exe) {
      nunit.run = run;
      expect(exe).toMatch(expected);
      process.nextTick(asyncSpecDone);
    };
    var options = {};
    if (proc) {
      options.processor = proc;
    }
    nunit([testdll], options, function (err) {
      expect(err).toBeFalsy();
      asyncSpecDone();
    });
    asyncSpecWait();
  }

  describe('integration tests', function () {
    it('runs passing tests', function () {
      runTests('Passing.dll', function (err) {
        expect(err).toBeNull();
      });
    });

    it('runs failing tests', function () {
      runTests('Failing.dll', function (err) {
        expect(err).not.toBeNull();
      });
    });

    it('runs passing and failing tests', function () {
      runTests('PassingAndFailing.dll', function (err) {
        expect(err).not.toBeNull();
      });
    });

    it('can run a subset of tests', function () {
      var subset = 'PassingAndFailing.PassingFixture2';
      runTests('PassingAndFailing.dll', subset, function (err) {
        expect(err).toBeNull();
      });
    });

    function runTests(dll, subset, expectations) {
      if (typeof subset === 'function') {
        // subset is optional
        expectations = subset;
        subset = null;
      }
      var target = path.join('testdata', 'nunit', dll);
      nunit(target, { subset: subset }, function (err) {
        expectations(err);
        asyncSpecDone();
      });
      asyncSpecWait();
    }
  });
});
