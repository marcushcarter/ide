#pragma once
#include "Core/ImGui/IPanel.h"

namespace ide
{
	class MenuPanel : public IPanel {
	public:
        MenuPanel(PanelStack* panelStack, const std::string& name = "Menu");
        ~MenuPanel() override { OnDetach(); }
        
		void OnAttach() override;
		void OnDetach() override;
		void OnUpdate(float deltaTime) override;

	private:
		std::string m_type;
	};

} // namespace ide