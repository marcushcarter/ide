#pragma once
#include "Panels/IPanel.h"

namespace ballistic
{
	class DemoPanel : public IPanel {
	public:
        DemoPanel(LayerContext& context, PanelStack& panelStack, const std::string& name = "Dockspace");
        ~DemoPanel() override { OnDetach(); }
        
		void OnAttach() override;
		void OnDetach() override;
		void OnUpdate(float deltaTime) override;
		void OnEvent(IEvent& e) override;
	};

} // namespace ballistic