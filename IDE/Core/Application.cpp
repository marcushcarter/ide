#include "Core/Application.h"
#include "Core/Window/Window.h"
#include "Core/ImGui/ImGuiLayer.h"
#include "Core/ImGui/PanelStack.h"
#include "Core/ImGui/Dockspace.h"
#include "Core/ImGui/MenuPanel.h"
#include "Core/ImGui/DemoPanel.h"

namespace ide
{
    bool Application::Init() {
        m_window = new Window();
        if (!m_window->Init())
            return false;

        m_imguiLayer = new ImGuiLayer();
        if (!m_imguiLayer->Init(m_window))
            return false;

        m_panelStack = new PanelStack();
        if (!m_panelStack->Init())
            return false;

        m_panelStack->PushPanel(new Dockspace(m_panelStack));
		m_panelStack->PushPanel(new MenuPanel(m_panelStack));
        m_panelStack->PushPanel(new DemoPanel(m_panelStack));

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
            m_imguiLayer->BeginFrame();

            m_panelStack->OnUpdate(deltaTime);

            m_imguiLayer->EndFrame();
            m_window->Present();
        }
    }

    void Application::Shutdown() {
        if (m_panelStack) {
            m_panelStack->Shutdown();
            delete m_panelStack;
            m_panelStack = nullptr;
        }
        if (m_imguiLayer) {
            m_imguiLayer->Shutdown();
            delete m_imguiLayer;
            m_imguiLayer = nullptr;
        }
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