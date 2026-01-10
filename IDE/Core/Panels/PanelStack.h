#pragma once
#include <Ballistic.h>

namespace ballistic
{
	class IPanel;

	class PanelStack {
	public:
		PanelStack(LayerContext& layerContext);
		~PanelStack() { Clear(); }

		void PushPanel(IPanel* panel);
		void PopPanel(IPanel* panel);

		void OnUpdate(float deltaTime);
		void Clear();
		void DispatchEvent(IEvent& e);

		void OpenEditor(LayerContext& context);
		void OpenLauncher(LayerContext& context);

		void QueueAction(const std::string& action) { m_pendingAction = action; }

	private:
		std::vector<IPanel*> m_panels;
		std::string m_pendingAction = "None";
		LayerContext& m_context;

		void ExecutePendingAction();
	};
    
} // namespace ballistic
