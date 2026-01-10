#include "Core/ImGui/Dockspace.h"

namespace ide
{
    Dockspace::Dockspace(PanelStack* panelStack, const std::string& name) 
        : IPanel(panelStack, name) {}
    
    void Dockspace::OnAttach() {}
    void Dockspace::OnDetach() {}

    void Dockspace::OnUpdate(float deltaTime) {
        const ImGuiViewport* viewport = ImGui::GetMainViewport();
            
        ImGui::SetNextWindowPos(viewport->WorkPos);
        ImGui::SetNextWindowSize(viewport->WorkSize);
        ImGui::SetNextWindowViewport(viewport->ID);

        ImGuiWindowFlags window_flags =
            ImGuiWindowFlags_NoDocking |
            ImGuiWindowFlags_NoTitleBar |
            ImGuiWindowFlags_NoCollapse |
            ImGuiWindowFlags_NoResize |
            ImGuiWindowFlags_NoMove |
            ImGuiWindowFlags_NoBringToFrontOnFocus |
            ImGuiWindowFlags_NoNavFocus;

        ImGui::PushStyleVar(ImGuiStyleVar_WindowRounding, 0.0f);
        ImGui::PushStyleVar(ImGuiStyleVar_WindowBorderSize, 0.0f);
        // ImGui::PushStyleVar(ImGuiStyleVar_WindowPadding, ImVec2(0.0f, 0.0f));
        ImGui::Begin("DockSpaceMain", nullptr, window_flags);
        
        ImGuiID dockspace_id = ImGui::GetID("DockSpace");
        ImGui::DockSpace(dockspace_id, ImVec2(0.0f, 0.0f), ImGuiDockNodeFlags_None);
        
        ImGui::End();
        ImGui::PopStyleVar(2);
    }

} // namespace ide
