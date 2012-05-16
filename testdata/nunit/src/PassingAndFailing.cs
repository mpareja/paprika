using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using NUnit.Framework;

namespace PassingAndFailing
{
    [TestFixture]
    public class PassingFixture2
    {
        [Test]
        public void PassingTest2()
        {
            Assert.IsTrue(true);
        }
    }

    [TestFixture]
    public class FailingFixture2
    {
        [Test]
        public void FailingTest2()
        {
            Assert.IsTrue(false, "FailingTest2 error message!");
        }
    }
}
