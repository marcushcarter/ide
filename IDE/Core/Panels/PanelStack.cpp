#include "Panels/PanelStack.h"
#include "Panels/IPanel.h"
#include "Panels/Dockspace.h"
#include "Panels/MenuPanel.h"
#include "Panels/LauncherPanel.h"
#include "Panels/DemoPanel.h"
#include "Panels/ViewportPanel.h"
#include "Panels/HierarchyPanel.h"
#include "Panels/InspectorPanel.h"
#include "Panels/ConsolePanel.h"
#include "Panels/PerformancePanel.h"

namespace ballistic
{
	PanelStack::PanelStack(LayerContext& layerContext) 
		: m_context(layerContext) {}

    void PanelStack::PushPanel(IPanel* panel) {
		LogDebug(panel->getName(), " panel attached");
        panel->OnAttach();
        m_panels.push_back(std::move(panel));
	}

	void PanelStack::PopPanel(IPanel* panel) {
		auto it = std::find_if(
			m_panels.begin(),
			m_panels.end(),
			[panel](const IPanel* p) { return p == panel; }
		);

		if (it != m_panels.end()) {
			LogDebug((*it)->getName(), " panel detached");
			(*it)->OnDetach();
			m_panels.erase(it);
		}
	}

	void PanelStack::OnUpdate(float deltaTime) {
		for (auto& panel : m_panels)
           	panel->OnUpdate(deltaTime);

		ExecutePendingAction();
	}

	void PanelStack::Clear() {
		for (auto& panel : m_panels)
			panel->OnDetach();

		m_panels.clear();
	}

	void PanelStack::DispatchEvent(IEvent& e) {
		for (auto& panel : m_panels)
            panel->OnEvent(e);
	}
	
	void PanelStack::OpenEditor(LayerContext& context) {
		Clear();

		PushPanel(new Dockspace(context, *this));
		PushPanel(new MenuPanel(context, *this));
		PushPanel(new ViewportPanel(context, *this));
		PushPanel(new HierarchyPanel(context, *this));
		PushPanel(new InspectorPanel(context, *this));
		PushPanel(new ConsolePanel(context, *this));
		PushPanel(new PerformancePanel(context, *this));
		// PushPanel(new DemoPanel(m_context, *this));
	}

	void PanelStack::OpenLauncher(LayerContext& context) {
		Clear();

		PushPanel(new Dockspace(context, *this));
		PushPanel(new MenuPanel(context, *this, "OpenLauncher"));
		PushPanel(new LauncherPanel(context, *this));
		// PushPanel(std::make_unique<DemoPanel>(m_context, *this));
	}
    
	void PanelStack::ExecutePendingAction() {
		if (m_pendingAction == "OpenEditor") {
			OpenEditor(m_context);
		} else if (m_pendingAction == "OpenLauncher") {
			OpenLauncher(m_context);
		}
		m_pendingAction = "None";
	}

} // namespace ballistic
