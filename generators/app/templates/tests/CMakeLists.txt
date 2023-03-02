find_package(doctest CONFIG REQUIRED)

add_library(test_common_libs INTERFACE)

# add other dependencies of your tests
target_link_libraries(test_common_libs INTERFACE doctest::doctest)

list(APPEND tests test)


foreach(test IN LISTS tests)
    add_executable("${test}" "${CMAKE_CURRENT_SOURCE_DIR}/${test}.cc")
    add_test("${test}" "${test}")
    target_link_libraries("${test}" PRIVATE test_common_libs)
endforeach()
