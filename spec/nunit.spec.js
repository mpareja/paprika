var nunit = require('../lib/nunit'),
  path = require('path'),
  nunitDir = path.join('nunit', 'bin');

describe('nunit', function () {
  it('needs to know where nunit lives', function () {
    nunit('MyProject.UnitTests.dll', { nunitDir: 'doesntExist' }, function (err) {
      expect(err).toMatch('nunit');
      asyncSpecDone();
    });
    asyncSpecWait();
  });

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
      nunit(path.join('testdata', 'nunit', dll),
        { 
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
