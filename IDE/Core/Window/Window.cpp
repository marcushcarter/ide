#include "Core/Window/Window.h"

namespace ide
{
    bool Window::Init() {
        if (!glfwInit()) {
            std::cout << "Failed to initialize GLFW\n";
            return false;
        }

        glfwWindowHint(GLFW_CLIENT_API, GLFW_OPENGL_API);
		glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 4);
		glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 6);
		glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

        m_nativeWindow = glfwCreateWindow(m_state.dim.x, m_state.dim.y, "Ballistic Code Editor", nullptr, nullptr);
        if (!m_nativeWindow) {
            std::cout << "Failed to create window\n";
            glfwTerminate();
            return false;
        }

        glfwSwapInterval(true);

        glfwMakeContextCurrent(m_nativeWindow);

        if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress)) {
			std::cout << "Failed to initialize GLAD\n";
			Shutdown();
			return false;
		}

        std::cout << "Window initialized\n";
        return true;
    }

    void Window::Shutdown() {
        if (m_nativeWindow) glfwDestroyWindow(m_nativeWindow);
        glfwTerminate();
    }

    bool Window::ShouldClose() {
        int w, h;
		glfwGetWindowSize(m_nativeWindow, &w, &h);
		m_state.dim.x = w;
		m_state.dim.y = h;

        m_state.focused = glfwGetWindowAttrib(m_nativeWindow, GLFW_FOCUSED);
        m_state.minimized = glfwGetWindowAttrib(m_nativeWindow, GLFW_ICONIFIED);
        m_state.maximized = glfwGetWindowAttrib(m_nativeWindow, GLFW_MAXIMIZED);

		float xscale, yscale;
		glfwGetWindowContentScale(m_nativeWindow, &xscale, &yscale);
		m_state.dpiScale = xscale;

        return m_nativeWindow && glfwWindowShouldClose(m_nativeWindow);
    }

    void Window::PollEvents() {
        glfwPollEvents();
    }

    void Window::Present() {
        glfwSwapBuffers(m_nativeWindow);
    }

} // namespace ide