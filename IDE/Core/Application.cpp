#include "Core/Application.h"
#include "Core/Window/Window.h"

namespace ide
{
    bool Application::Init() {
        m_window = new Window();
        if (!m_window->Init())
            return false;

        std::cout << "Application initialized\n";
        return true;
    }

    void Application::Run() {
        
        using clock = std::chrono::high_resolution_clock;
        auto lastTime = clock::now();

        while (!m_window->ShouldClose()) {
            auto currentTime = clock::now();
            std::chrono::duration<float> elapsed = currentTime - lastTime;
            lastTime = currentTime;
            float deltaTime = elapsed.count();

            m_window->PollEvents();

            m_window->Present();
        }
    }

    void Application::Shutdown() {
        if (m_window) {
            m_window->Shutdown();
            delete m_window;
            m_window = nullptr;
        }
    }

    Application* Application::CreateApplication() {
        std::filesystem::path root = std::filesystem::current_path();
        while (!std::filesystem::exists(root / "Resources") && root.has_parent_path())
            root = root.parent_path();
        m_projectRoot = root;

        std::cout << "Project root: " << root << "\n";
        return new Application();
    }

} // namespace ide