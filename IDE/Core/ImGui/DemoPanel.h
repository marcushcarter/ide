#pragma once
#include "Core/ImGui/IPanel.h"

namespace ide
{
	class DemoPanel : public IPanel {
	public:
        DemoPanel(PanelStack* panelStack, const std::string& name = "Demo");
        ~DemoPanel() override { OnDetach(); }
        
		void OnAttach() override;
		void OnDetach() override;
		void OnUpdate(float deltaTime) override;
	};

} // namespace ide