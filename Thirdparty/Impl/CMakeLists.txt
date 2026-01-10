add_library(Impl STATIC
    stb_image_impl.cpp
)

target_include_directories(Impl PUBLIC ${CMAKE_SOURCE_DIR}/Thirdparty/stb)