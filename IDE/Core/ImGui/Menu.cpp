#include "Core/ImGui/Menu.h"
#include "Core/Application.h"

namespace ide
{
    Menu::Menu(PanelStack* panelStack, const std::string& name) 
        : IPanel(panelStack, name) {}
    
    void Menu::OnAttach() {}
    void Menu::OnDetach() {}

    void Menu::OnUpdate(float deltaTime) {
        ImGui::PushStyleVar(ImGuiStyleVar_FramePadding, ImVec2(0.0f, 12.0f));

        if (ImGui::BeginMainMenuBar()) {
            if (ImGui::BeginMenu("Project")) {
                if (ImGui::MenuItem("Open Folder")) {
                    const char* path = tinyfd_selectFolderDialog(
                        "Select Project Folder",
                        nullptr
                    );

                    if (path)
                        Application::OpenFolder(path);
                }
                ImGui::EndMenu();
            }
            
            ImGui::EndMainMenuBar();
        }
        ImGui::PopStyleVar();
    }

} // namespace ide
