using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using NUnit.Framework;

namespace Failing
{
    [TestFixture]
    public class FailingFixture1
    {
        [Test]
        public void FailingTest1()
        {
            Assert.IsTrue(false, "FailingTest1 error message!");
        }
    }
}
