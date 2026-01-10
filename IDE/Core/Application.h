#pragma once
#include "pch.h"

namespace ide
{
    class Window;
    class ImGuiLayer;
    class PanelStack;

    class Application
    {
    public:
        Application() = default;
        ~Application() { Shutdown(); }

        bool Init();
        void Run();
        void Shutdown();

        static Application* CreateApplication();

        static std::filesystem::path GetRoot() { return m_projectRoot; };
    
    private:
        Window* m_window = nullptr;
        ImGuiLayer* m_imguiLayer = nullptr;
        PanelStack* m_panelStack = nullptr;

        static inline std::filesystem::path m_projectRoot;
    };

} // namespace ide