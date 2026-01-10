#pragma once
#include "Core/ImGui/IPanel.h"

namespace ide
{
	class Filesystem : public IPanel {
	public:
        Filesystem(PanelStack* panelStack, const std::string& name = "Filesystem");
        ~Filesystem() override { OnDetach(); }
        
		void OnAttach() override;
		void OnDetach() override;
		void OnUpdate(float deltaTime) override;
    
    private:
        std::unordered_map<std::filesystem::path, bool> m_FolderOpenStates;
        constexpr static int m_indentSize = 8;
        constexpr static float m_dotPadding = 16.0f;
        constexpr static float m_dotRadius = 4.0f;

        glm::vec3 m_normalColor = glm::vec3(1);
        glm::vec3 m_untrackedColor = glm::vec3(0.5f, 0.5f, 0.5f);
        glm::vec3 m_submoduleColor = glm::vec3(0.0f, 0.0f, 1.0f);
        glm::vec3 m_changedColor = glm::vec3(1.0f, 1.0f, 0.0f);
        glm::vec3 m_addedColor = glm::vec3(0.0f, 1.0f, 0.0f);

        bool IsHidden(const std::filesystem::path& path);

        bool GitUntracked(const std::filesystem::path& path);
        bool GitSubmodule(const std::filesystem::path& path);
        bool GitChanged(const std::filesystem::path& path);
        bool GitAdded(const std::filesystem::path& path);

        void DrawFolderRecursive(const std::filesystem::path& folderPath, int indentLevel = 0);
	};

} // namespace ide