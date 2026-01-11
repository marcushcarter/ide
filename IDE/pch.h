#pragma once

#include <windows.h>
#include <iostream>
#include <filesystem>
#include <string>
#include <vector>
#include <unordered_map>
#include <fstream>
#include <thread>
#include <mutex>
#include <vector>
#include <atomic>
#include <sstream>

#include <glad/glad.h>
#include <GLFW/glfw3.h>

#define GLM_ENABLE_EXPERIMENTAL
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <glm/gtx/euler_angles.hpp>
#include <glm/gtc/type_ptr.hpp>

#include <imgui.h>
#include <imgui_internal.h>
#include <backends/imgui_impl_glfw.h>
#include <backends/imgui_impl_opengl3.h>

#include <tinyfiledialogs.h>