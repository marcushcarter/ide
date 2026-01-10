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

        glm::vec4 m_untrackedColor = glm::vec4(0.5f, 0.5f, 0.5f, 1.0f);
        glm::vec4 m_addedColor = glm::vec4(0.5f, 0.5f, 0.5f, 1.0f);
        glm::vec4 m_removedColor = glm::vec4(0.5f, 0.5f, 0.5f, 1.0f);
        glm::vec4 m_changedColor = glm::vec4(0.5f, 0.5f, 0.5f, 1.0f);

        void DrawFolderRecursive(const std::filesystem::path& folderPath, int indentLevel = 0);
	};

} // namespace ide