set(BUILD_SHARED_LIBS OFF CACHE BOOL "" FORCE)

# GLFW
set(GLFW_BUILD_EXAMPLES OFF CACHE BOOL "" FORCE)
set(GLFW_BUILD_TESTS OFF CACHE BOOL "" FORCE)
set(GLFW_BUILD_DOCS OFF CACHE BOOL "" FORCE)
set(GLFW_VULKAN_STATIC ON CACHE BOOL "" FORCE)
set(GLFW_USE_HYBRID_HPG ON CACHE BOOL "" FORCE) # optional
add_subdirectory(glfw)

# GLAD
add_library(glad STATIC glad/src/glad.c)
target_include_directories(glad PUBLIC glad/include)

# GLM
add_library(glm INTERFACE)
target_include_directories(glm INTERFACE glm)

# STB
add_library(stb INTERFACE)
target_include_directories(stb INTERFACE stb)

# ImGui
file(GLOB IMGUI_CORE imgui/*.cpp)
set(IMGUI_BACKENDS imgui/backends/imgui_impl_glfw.cpp imgui/backends/imgui_impl_opengl3.cpp)
set(IMGUI_SRC ${IMGUI_CORE} ${IMGUI_BACKENDS})
add_library(imgui STATIC ${IMGUI_SRC})
target_include_directories(imgui PUBLIC imgui)
target_link_libraries(imgui PUBLIC glfw)

# TinyFileDialogs
add_library(tinyfiledialogs STATIC tinyfiledialogs/tinyfiledialogs.c)
target_include_directories(tinyfiledialogs PUBLIC tinyfiledialogs)

add_subdirectory(Impl)