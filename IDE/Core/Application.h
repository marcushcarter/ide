#pragma once
#include "pch.h"

#define BALLISTIC_IDE_VERSION "v1.0"

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
 
        static std::filesystem::path& GetFile() { return m_selectedFile; };
        static std::filesystem::path& GetFolder() { return m_selectedFolder; };
        static std::filesystem::path& GetSelected() { return m_selectedPath; };

        static void OpenFile(const std::filesystem::path& file) { m_selectedFile = file; };
        static void OpenFolder(const std::filesystem::path& folder) { m_selectedFolder = folder; };
        static void SetSelected(const std::filesystem::path& path) { m_selectedPath = path; };
    
    private:
        Window* m_window = nullptr;
        ImGuiLayer* m_imguiLayer = nullptr;
        PanelStack* m_panelStack = nullptr;

        static inline std::filesystem::path m_projectRoot;
        
        static inline std::filesystem::path m_selectedFile;
        static inline std::filesystem::path m_selectedFolder;
        static inline std::filesystem::path m_selectedPath;
    };

} // namespace ide