#define DOCTEST_CONFIG_IMPLEMENT_WITH_MAIN
#include <doctest/doctest.h>

TEST_CASE("simple test case") {
  CHECK(1 == 1);
  CHECK(2 == 2);
}
