#include "Core/ImGui/MenuPanel.h"

namespace ide
{
    MenuPanel::MenuPanel(PanelStack* panelStack, const std::string& name) 
        : IPanel(panelStack, name) {}
    
    void MenuPanel::OnAttach() {}
    void MenuPanel::OnDetach() {}

    void MenuPanel::OnUpdate(float deltaTime) {
        ImGui::PushStyleVar(ImGuiStyleVar_FramePadding, ImVec2(0.0f, 12.0f));

        if (ImGui::BeginMainMenuBar()) {
            if (ImGui::BeginMenu("Project")) {
                if (ImGui::MenuItem("Force Quit")) {}
                ImGui::EndMenu();
            }
            
            ImGui::EndMainMenuBar();
        }
        ImGui::PopStyleVar();
    }

} // namespace ide
