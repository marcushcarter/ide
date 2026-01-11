#include "Core/ImGui/TextEditor.h"

namespace ide
{
    TextEditor::TextEditor(PanelStack* panelStack, const std::string& name) 
        : IPanel(panelStack, name) {}
    
    void TextEditor::OnAttach() {}
    void TextEditor::OnDetach() {}

    void TextEditor::OnUpdate(float deltaTime) {
        ImGui::Begin("TextEditor");
        if (ImGui::BeginTabBar("MyTabBar"))
        {
            if (ImGui::BeginTabItem("Tab 1"))
            {
                ImGui::Text("Content of Tab 1");
                ImGui::EndTabItem();
            }

            if (ImGui::BeginTabItem("Tab 2"))
            {
                ImGui::Text("Content of Tab 2");
                ImGui::EndTabItem();
            }

            if (ImGui::BeginTabItem("Tab 3"))
            {
                ImGui::Text("Content of Tab 3");
                ImGui::EndTabItem();
            }

            ImGui::EndTabBar();
        }
        ImGui::End();
    }

} // namespace ide
