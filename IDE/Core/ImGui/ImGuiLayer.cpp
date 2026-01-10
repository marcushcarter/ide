#include "Core/ImGui/ImGuiLayer.h"
#include "Core/Window/Window.h"
#include "Core/Application.h"

namespace ide
{
    bool ImGuiLayer::Init(Window* window) {      
        IMGUI_CHECKVERSION();
        ImGui::CreateContext();
        ImGuiIO& io = ImGui::GetIO();
	    io.ConfigFlags |= ImGuiConfigFlags_NavEnableKeyboard;
	    io.ConfigFlags |= ImGuiConfigFlags_NavEnableGamepad;
	    io.ConfigFlags |= ImGuiConfigFlags_DockingEnable;
    	io.ConfigFlags |= ImGuiConfigFlags_ViewportsEnable;
        
        // ImFontConfig cfg;
		// cfg.PixelSnapH = true;
		// cfg.MergeMode = false;
		// io.Fonts->AddFontFromFileTTF((Application::GetRoot() / "Resources/Fonts/noto-sans/NotoSans-Regular.ttf").string().c_str(), 16.0f, &cfg);
        
        ImFontConfig cfg;
		cfg.PixelSnapH = true;
		cfg.MergeMode = false;
		io.Fonts->AddFontFromFileTTF((Application::GetRoot() / "Resources/Fonts/space-mono/SpaceMono-Regular.ttf").string().c_str(), 16.0f, &cfg);
		
		cfg.MergeMode = true;
		static const ImWchar icons_ranges[] = { 0xF000, 0xF8FF, 0 };
		io.Fonts->AddFontFromFileTTF((Application::GetRoot() / "Resources/Fonts/vscode-codicon/vscode-codicon.ttf").string().c_str(), 35.0f, &cfg, icons_ranges);

    	ImGui::StyleColorsDark();

        ImGuiStyle& style = ImGui::GetStyle();
        if (io.ConfigFlags & ImGuiConfigFlags_ViewportsEnable) {
            // style.WindowRounding = 0.0f;
            // style.TabRounding = 0.0f;
            // style.TabBarBorderSize = 0.0f;
            // style.GrabRounding = 2.0f;
            // style.ScrollbarRounding = 2.0f;
            // style.DockingSeparatorSize = 0.0f;
            // style.WindowBorderSize = 0.0f;
        }

        // style.WindowTitleAlign = ImVec2(0.5f, 0.5f);
        // style.WindowMenuButtonPosition = ImGuiDir_None;

        ImGui_ImplGlfw_InitForOpenGL(window->GetNativeWindow(), true);
        ImGui_ImplOpenGL3_Init("#version 460");

		std::cout << "ImGuiLayer initialized\n";
        return true;
    }

    void ImGuiLayer::Shutdown() {
        if (ImGui::GetCurrentContext()) {
            ImGui_ImplOpenGL3_Shutdown();
            ImGui_ImplGlfw_Shutdown();
            ImGui::DestroyContext();
        }
    }
    
    void ImGuiLayer::BeginFrame() {
        ImGui_ImplOpenGL3_NewFrame();
        ImGui_ImplGlfw_NewFrame();
        ImGui::NewFrame();
    }

    void ImGuiLayer::EndFrame() {
        ImGui::Render();
        ImGui_ImplOpenGL3_RenderDrawData(ImGui::GetDrawData());
        auto io = ImGui::GetIO();
		if (io.ConfigFlags & ImGuiConfigFlags_ViewportsEnable) {
			GLFWwindow* backup = glfwGetCurrentContext();
			ImGui::UpdatePlatformWindows();
			ImGui::RenderPlatformWindowsDefault();
			glfwMakeContextCurrent(backup);
		}
    }
    
} // namespace ide