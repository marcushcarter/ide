#include "Core/ImGui/DemoPanel.h"

namespace ide
{
    DemoPanel::DemoPanel(PanelStack* panelStack, const std::string& name) 
        : IPanel(panelStack, name) {}
    
    void DemoPanel::OnAttach() {}
    void DemoPanel::OnDetach() {}

    void DemoPanel::OnUpdate(float deltaTime) {
        ImGui::ShowDemoWindow();
    }

} // namespace ide
