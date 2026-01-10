#include "Core/ImGui/PanelStack.h"
#include "Core/ImGui/IPanel.h"

namespace ide
{
	bool PanelStack::Init() {
        std::cout << "Panel Stack initialized\n";
		return true;
	}
	
	void PanelStack::Shutdown() {
		Clear();
	}
    
	void PanelStack::PushPanel(IPanel* panel) {
		std::cout << panel->getName() << " panel attached\n";
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
			std::cout << (*it)->getName() << " panel detached\n";
			(*it)->OnDetach();
			m_panels.erase(it);
		}
	}

	void PanelStack::OnUpdate(float deltaTime) {
		for (auto& panel : m_panels)
           	panel->OnUpdate(deltaTime);
	}

	void PanelStack::Clear() {
		for (auto& panel : m_panels)
			panel->OnDetach();

		m_panels.clear();
	}

} // namespace ide
