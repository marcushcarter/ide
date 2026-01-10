#include "Core/ImGui/TextEditor.h"

namespace ide
{
    TextEditor::TextEditor(PanelStack* panelStack, const std::string& name) 
        : IPanel(panelStack, name) {}
    
    void TextEditor::OnAttach() {}
    void TextEditor::OnDetach() {}

    void TextEditor::OnUpdate(float deltaTime) {
        ImGui::Begin("TextEditor");
        ImGui::End();
    }

} // namespace ide
