#include "Core/ImGui/Terminal.h"

namespace ide
{
    Terminal::Terminal(PanelStack* panelStack, const std::string& name) 
        : IPanel(panelStack, name) {}
    
    void Terminal::OnAttach() {}
    void Terminal::OnDetach() {}

    void Terminal::OnUpdate(float deltaTime) {
        ImGui::Begin("Terminal");
        ImGui::Text("Terminals are not available in this version of the IDE. Use a terminal or a command prompt instead.");
        ImGui::End();
    }

} // namespace ide
