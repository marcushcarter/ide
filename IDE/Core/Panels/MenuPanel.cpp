#include "Panels/MenuPanel.h"

namespace ballistic
{
    MenuPanel::MenuPanel(LayerContext& context, PanelStack& panelStack, const std::string& type, const std::string& name) 
        : IPanel(context, panelStack, name), m_type(type) {}
    
    void MenuPanel::OnAttach() {}
    void MenuPanel::OnDetach() {}

    void MenuPanel::OnUpdate(float deltaTime) {
        ImGui::PushStyleVar(ImGuiStyleVar_FramePadding, ImVec2(0.0f, 12.0f));

        if (!ImGui::BeginMainMenuBar()) {
            ImGui::PopStyleVar();
            return;
        }

        if (m_type == "OpenEditor") {

            if (ImGui::BeginMenu("Project")) {
                if (ImGui::MenuItem("Force Quit")) 
                    GetRoot()->RequestShutdown();
                ImGui::EndMenu();
            }
            
            const float buttonSize = ImGui::GetFrameHeight();
            const float windowWidth = ImGui::GetWindowWidth();
            float centerX = (windowWidth - buttonSize) * 0.5f;
            ImGui::SetCursorPosX(centerX);
            if (ImGui::Button((const char*)u8"\u25B6", ImVec2(buttonSize, buttonSize))) {
                
            }

            std::string projectText = GetRoot()->GetProjectManager()->GetName() + " - ";
            std::string sceneText;
            if (m_context.sceneManager->HasActiveScene()) {
                Scene* scene = m_context.sceneManager->GetActiveScene();
                sceneText = !scene->GetName().empty() ? scene->GetName() + " - " : "Unnamed Scene - ";
            }

            std::string nodeText;
            if (m_context.sceneManager->HasActiveScene()) {
                Scene* scene = m_context.sceneManager->GetActiveScene();
                entt::entity selected = scene->GetSelectedEntity();
                if (selected != entt::null) {
                    auto& reg = scene->GetRegistry();
                    if (reg.all_of<Tag>(selected)) {
                        auto& tag = reg.get<Tag>(selected);
                        nodeText = !tag.name.empty() ? tag.name : "Unnamed Node";
                        nodeText += " - ";
                    } else {
                        nodeText = "Unnamed Node - ";
                    }
                }
            }

            std::string text = nodeText + sceneText + projectText + "Ballistic Engine";\

            float textWidth = ImGui::CalcTextSize(text.c_str()).x;
            float extraPadding = 20.0f;
            ImGui::SameLine(ImGui::GetWindowContentRegionMax().x - textWidth - ImGui::GetStyle().FramePadding.x - extraPadding);
            ImGui::TextUnformatted(text.c_str());

        } else if (m_type == "OpenLauncher") {

        }
        
        ImGui::PopStyleVar();
        ImGui::EndMainMenuBar();
    }

    void MenuPanel::OnEvent(IEvent& e) {}

} // namespace ballistic
