cmake_minimum_required(VERSION 3.25.0)
project(<%= projectName %> VERSION <%= version %>)

add_executable(<%= projectName %> main.cc)

target_compile_options(<%= projectName %> PRIVATE -Wall -Wextra -Wpedantic)
target_compile_features(<%= projectName %> PRIVATE cxx_std_20)

<% if (selfBootstrapped) { %>
set(CMAKE_TOOLCHAIN_FILE "${CMAKE_CURRENT_SOURCE_DIR}/vcpkg/scripts/buildsystems/vcpkg.cmake")
set(CMAKE_PREFIX_PATH "${CMAKE_CURRENT_SOURCE_DIR}/vcpkg/installed/x64-osx")
<% } else {%>
set(CMAKE_TOOLCHAIN_FILE "$ENV{VCPKG_ROOT}/scripts/buildsystems/vcpkg.cmake")
set(CMAKE_PREFIX_PATH "$ENV{/vcpkg}/installed/x64-osx")
<% } %>


enable_testing()
add_subdirectory(tests)
