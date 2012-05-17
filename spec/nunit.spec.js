var nunit = require('../lib/nunit'),
  path = require('path'),
  nunitDir = path.join('nunit', 'bin');

describe('nunit', function () {
  it('needs to know where nunit lives', function () {
    nunit('MyProject.UnitTests.dll', function (err) {
      expect(err).toMatch('nunit');
      asyncSpecDone();
    });
    asyncSpecWait();
  });

  it('verifies nunit exists', function () {
    nunit('MyProject.UnitTests.dll', { nunitDir: 'doesntExist' }, function (err) {
      expect(err).toMatch('nunit');
      asyncSpecDone();
    });
    asyncSpecWait();
  });

  it('can run using 64-bit NUnit', function () {
    testProcessor('x64', /nunit-console.exe$/);
  });

  it('can run using 32-bit NUnit', function () {
    testProcessor('x86', /nunit-console-x86.exe$/);
  });

  function testProcessor(proc, expected) {
    var run = nunit.run,
      testdll = path.join('testdata', 'nunit', 'Passing.dll');
    nunit.run = function (exe) {
      nunit.run = run;
      expect(exe).toMatch(expected);
      process.nextTick(asyncSpecDone);
    };
    nunit([testdll], { processor: proc, nunitDir: nunitDir }, function () {});
    asyncSpecWait();
  }

  if (!path.existsSync(nunitDir)) {
    // disable remaining specs
    describe = xdescribe;
    console.log('!!! SKIPPING NUNIT TESTS !!!');
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
      nunit(path.join('testdata', 'nunit', dll), {
        nunitDir: nunitDir,
        run_options: { stdout: false },
        subset: subset
      }, function (err) {
        expectations(err);
        asyncSpecDone();
      });
      asyncSpecWait();
    }
  });
});
