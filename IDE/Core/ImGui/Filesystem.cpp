#include "Core/ImGui/Filesystem.h"
#include "Core/Application.h"

namespace ide
{
    bool IsHidden(const std::filesystem::path& path) {
        #ifdef _WIN32
            DWORD attrs = GetFileAttributesW(path.wstring().c_str());
            return (attrs != INVALID_FILE_ATTRIBUTES) && (attrs & FILE_ATTRIBUTE_HIDDEN);
        #else
            return path.filename().string()[0] == '.';
        #endif
    }

    Filesystem::Filesystem(PanelStack* panelStack, const std::string& name) 
        : IPanel(panelStack, name) {}
    
    void Filesystem::OnAttach() {}
    void Filesystem::OnDetach() {}

    void Filesystem::DrawFolderRecursive(const std::filesystem::path& folderPath, int indentLevel) {
        if (!std::filesystem::exists(folderPath))
            return;

        for (const auto& entry : std::filesystem::directory_iterator(folderPath)) {
            if (!entry.is_directory() || IsHidden(entry.path()))
                continue;

            ImVec4 textColor = ImVec4(1.0, 1.0f, 1.0f, 1.0f);

            if (true) {
                ImVec2 cursor = ImGui::GetCursorScreenPos();
                float windowWidth = ImGui::GetWindowWidth();
                ImVec2 circlePos = ImVec2(ImGui::GetWindowPos().x + windowWidth - m_dotRadius - m_dotPadding, cursor.y + m_dotRadius + 4.0f);
                ImU32 color = IM_COL32(255, 255, 255, 255);
                ImGui::GetWindowDrawList()->AddCircleFilled(circlePos, m_dotRadius, color);
            }
            ImGui::PushStyleColor(ImGuiCol_Text, textColor);

            std::string name = entry.path().filename().string();
            
            const char* icon = m_FolderOpenStates[entry.path()]
                ? reinterpret_cast<const char*>(u8"\uF130")
                : reinterpret_cast<const char*>(u8"\uF132");
          
            char title[256];
            snprintf(title, sizeof(title), "%s %s", icon, name.c_str());

            ImGui::PushID(entry.path().string().c_str());
            ImGui::Indent(indentLevel * m_indentSize);

            bool selected = (Application::GetSelected() == entry.path());
            if (ImGui::Selectable(title, selected, ImGuiSelectableFlags_SpanAllColumns)) {
                m_FolderOpenStates[entry.path()] = !m_FolderOpenStates[entry.path()];
                Application::SetSelected(entry.path());
            }

            if (m_FolderOpenStates[entry.path()])
                DrawFolderRecursive(entry.path(), indentLevel + 1);

            ImGui::PopStyleColor();

            ImGui::Unindent(indentLevel * m_indentSize);
            ImGui::PopID();
        }

        for (const auto& entry : std::filesystem::directory_iterator(folderPath)) {
            if (entry.is_directory())
                continue;
            
            std::filesystem::path filePath = entry.path();
            std::string name = filePath.filename().string();

            const char* icon = "";
            
            if (filePath.extension() == ".cpp") icon = reinterpret_cast<const char*>(u8"\uF1A6");

            if (filePath.filename() == "CMakeLists.txt") icon = reinterpret_cast<const char*>(u8"\uF19D");
            
            char title[256];
            snprintf(title, sizeof(title), "%s %s", icon, name.c_str());

            ImGui::PushID(entry.path().string().c_str());
            ImGui::Indent(indentLevel * m_indentSize);

            bool selected = (Application::GetSelected() == entry.path());
            if (ImGui::Selectable(title, selected, ImGuiSelectableFlags_SpanAllColumns)) {
                Application::OpenFile(entry.path());
                Application::SetSelected(entry.path());
            }

            ImGui::Unindent(indentLevel * m_indentSize);
            ImGui::PopID();
        }
    }

    void Filesystem::OnUpdate(float deltaTime) {
        ImGui::Begin("Filesystem", nullptr, ImGuiWindowFlags_NoScrollWithMouse);

        ImGui::Text("Opened Folder: %s", Application::GetFolder().string().c_str());
        ImGui::Text("Selected File: %s", Application::GetFile().string().c_str());
        ImGui::Text("Selected: %s", Application::GetSelected().string().c_str());

        ImGui::BeginChild("FilesystemChild", ImVec2(0, 0), false, ImGuiWindowFlags_HorizontalScrollbar | ImGuiWindowFlags_NoScrollbar);
        DrawFolderRecursive(Application::GetFolder());
        ImGui::EndChild();

        ImGui::End();
    }

} // namespace ide
