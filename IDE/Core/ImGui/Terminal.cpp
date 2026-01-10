#include "Core/ImGui/Terminal.h"

namespace ide
{
    Terminal::Terminal(PanelStack* panelStack, const std::string& name) 
        : IPanel(panelStack, name) {}
    
    void Terminal::OnAttach() {}
    void Terminal::OnDetach() {}

    void Terminal::OnUpdate(float deltaTime) {
        ImGui::Begin("Terminal");
        ImGui::End();
    }

} // namespace ide
