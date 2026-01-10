#include "Panels/LauncherPanel.h"
#include <tinyfiledialogs.h>

namespace ballistic
{
    LauncherPanel::LauncherPanel(LayerContext& context, PanelStack& panelStack, const std::string& name) 
        : IPanel(context, panelStack, name) {}
    
    void LauncherPanel::OnAttach() {}
    void LauncherPanel::OnDetach() {}

    void LauncherPanel::OnUpdate(float deltaTime) {
        ImGuiViewport* vp = ImGui::GetMainViewport();
        ImGui::SetNextWindowPos(vp->WorkPos);
        ImGui::SetNextWindowSize(vp->WorkSize);
        ImGui::SetNextWindowViewport(vp->ID);

        ImGui::Begin(
            "Launcher", nullptr,
            ImGuiWindowFlags_NoTitleBar |
            ImGuiWindowFlags_NoResize |
            ImGuiWindowFlags_NoMove |
            ImGuiWindowFlags_NoDocking
        );

        constexpr float buttonWidth = 200.0f;
        constexpr float buttonHeight = 40.0f;
        constexpr float spacing = 5.0f;

        float contentWidth = ImGui::GetWindowContentRegionMax().x;
        float contentHeight = ImGui::GetWindowContentRegionMax().y;

        float totalBlockHeight = buttonHeight * 2 + spacing;

        float startY = (contentHeight - totalBlockHeight) * 0.5f;
        float startX = (contentWidth - buttonWidth) * 0.5f;
        
        ImGui::SetCursorPosX(startX);
        ImGui::SetCursorPosY(startY);
        if (ImGui::Button("New Project", ImVec2(buttonWidth, buttonHeight)))
            ImGui::OpenPopup("NewProjectMenu");

        ImGui::SetCursorPosX(startX);
        ImGui::SetCursorPosY(startY + buttonHeight + spacing);
        if (ImGui::Button("Open Project", ImVec2(buttonWidth, buttonHeight))) {
            const char* filters[] = { "project.config" };
            const char* file = tinyfd_openFileDialog("Open Project", "", 1, filters, "Project Config", 0);
            if (file && strlen(file) > 0) {
                std::filesystem::path configFile(file);
                if (GetRoot()->GetProjectManager()->OpenProject(configFile))
                    m_panelStack.QueueAction("OpenEditor");
            }
        }
        
        if (ImGui::BeginPopup("NewProjectMenu")) {
            static char projectName[128] = "";
            static char projectPath[512] = "";
            
            ImGui::Text("Project Name:");
            ImGui::InputTextWithHint("##ProjectName", "New Project", projectName, IM_ARRAYSIZE(projectName));

            ImGui::Text("Project Location:");
            ImGui::InputText("##ProjectPath", projectPath, IM_ARRAYSIZE(projectPath));

            if (ImGui::Button("Browse")) {
                const char* file = tinyfd_saveFileDialog(
                    "Select Project Location",
                    (strlen(projectName) == 0) ? "New Project" : projectName,
                    0, nullptr, nullptr
                );
                if (file && strlen(file) > 0) {
                    std::filesystem::path folder = std::filesystem::path(file).parent_path();
                    strncpy(projectPath, folder.string().c_str(), IM_ARRAYSIZE(projectPath));
                    projectPath[IM_ARRAYSIZE(projectPath) - 1] = '\0';
                }
            }

            std::filesystem::path path(projectPath);
            bool canCreate = !path.empty() && std::filesystem::exists(path) && std::filesystem::is_directory(path);

            ImGui::BeginDisabled(!canCreate);
            if (ImGui::Button("Create Project")) {
                if (GetRoot()->GetProjectManager()->CreateNewProject(path, projectName))
                    m_panelStack.QueueAction("OpenEditor");
                
                projectName[0] = '\0';
                projectPath[0] = '\0';
            }
            ImGui::EndDisabled();

            if (ImGui::Button("Skip"))
                m_panelStack.QueueAction("OpenEditor");

            ImGui::EndPopup();
        }

        ImGui::End();
    }

    void LauncherPanel::OnEvent(IEvent& e) {}

} // namespace ballistic
