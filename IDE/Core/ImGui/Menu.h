#pragma once
#include "Core/ImGui/IPanel.h"

namespace ide
{
	class Menu : public IPanel {
	public:
        Menu(PanelStack* panelStack, const std::string& name = "Menu");
        ~Menu() override { OnDetach(); }
        
		void OnAttach() override;
		void OnDetach() override;
		void OnUpdate(float deltaTime) override;

	private:
		std::string m_type;
	};

} // namespace ide