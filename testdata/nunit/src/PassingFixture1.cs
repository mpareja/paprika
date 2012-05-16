using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using NUnit.Framework;

namespace Passing
{
    [TestFixture]
    public class PassingFixture1
    {
        [Test]
        public void PassingTest1() {
            Assert.IsTrue(true);
        }
    }
}
