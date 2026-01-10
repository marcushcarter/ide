#pragma once
#include "Core/ImGui/IPanel.h"

namespace ide
{
	class TextEditor : public IPanel {
	public:
        TextEditor(PanelStack* panelStack, const std::string& name = "TextEditor");
        ~TextEditor() override { OnDetach(); }
        
		void OnAttach() override;
		void OnDetach() override;
		void OnUpdate(float deltaTime) override;
	};

} // namespace ide