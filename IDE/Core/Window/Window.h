#pragma once
#include "pch.h"

namespace ide
{
    struct WindowState {
		glm::vec2 dim = glm::vec2(1280, 800);
		float dpiScale = 1.0f;
		bool fullscreen = false;
		bool minimized = false;
		bool maximized = false;
		bool focused = true;
    };

    class Window
    {
    public:
        Window() = default;
        ~Window() { Shutdown(); }

        bool Init();
        void Shutdown();

        bool ShouldClose();
        void PollEvents();
        void Present();

        const WindowState& GetState() const { return m_state; }

        GLFWwindow* GetNativeWindow() const { return m_nativeWindow; }

    private:
        GLFWwindow* m_nativeWindow = nullptr;
        WindowState m_state{};
    };

} // namespace ide