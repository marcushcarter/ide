#pragma once
#include "Panels/IPanel.h"

namespace ballistic
{
	class Dockspace : public IPanel {
	public:
        Dockspace(LayerContext& context, PanelStack& panelStack, const std::string& name = "Demo");
        ~Dockspace() override { OnDetach(); }
        
		void OnAttach() override;
		void OnDetach() override;
		void OnUpdate(float deltaTime) override;
		void OnEvent(IEvent& e) override;
	};

} // namespace ballistic