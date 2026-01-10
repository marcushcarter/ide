#pragma once
#include "Panels/IPanel.h"

namespace ballistic
{
	class MenuPanel : public IPanel {
	public:
        MenuPanel(LayerContext& context, PanelStack& panelStack, const std::string& type = "OpenEditor", const std::string& name = "Menu");
        ~MenuPanel() override { OnDetach(); }
        
		void OnAttach() override;
		void OnDetach() override;
		void OnUpdate(float deltaTime) override;
		void OnEvent(IEvent& e) override;

	private:
		std::string m_type;
	};

} // namespace ballistic