file(GLOB_RECURSE IDE_SRC
    CONFIGURE_DEPENDS
    ${CMAKE_CURRENT_SOURCE_DIR}/*.cpp
    ${CMAKE_CURRENT_SOURCE_DIR}/Core/*.cpp
)
list(FILTER IDE_SRC EXCLUDE REGEX ".*/Entry/main.cpp$")

add_library(IDE STATIC ${IDE_SRC})

target_include_directories(IDE PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})

target_precompile_headers(IDE PUBLIC ${CMAKE_CURRENT_SOURCE_DIR}/pch.h)

target_link_libraries(IDE PUBLIC
    glfw
    glad
    glm
    imgui
    stb
    Impl
    ${CMAKE_DL_LIBS}
)

add_executable(IDEApp Entry/main.cpp)

target_link_libraries(IDEApp PRIVATE IDE)

if (WIN32)
    target_link_libraries(IDEApp PRIVATE opengl32)
endif()