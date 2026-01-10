#pragma once
#include "Core/ImGui/IPanel.h"

namespace ide
{
	class Dockspace : public IPanel {
	public:
        Dockspace(PanelStack* panelStack, const std::string& name = "Dockspace");
        ~Dockspace() override { OnDetach(); }
        
		void OnAttach() override;
		void OnDetach() override;
		void OnUpdate(float deltaTime) override;
	};

} // namespace ide