#pragma once
#include "Core/ImGui/IPanel.h"

namespace ide
{
	class Terminal : public IPanel {
	public:
        Terminal(PanelStack* panelStack, const std::string& name = "Terminal");
        ~Terminal() override { OnDetach(); }
        
		void OnAttach() override;
		void OnDetach() override;
		void OnUpdate(float deltaTime) override;
	};

} // namespace ide