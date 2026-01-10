#pragma once
#include "pch.h"

namespace ide
{
	class IPanel;

	class PanelStack {
	public:
		PanelStack() = default;
		~PanelStack() { Shutdown(); }

		bool Init();
		void Shutdown();

		void PushPanel(IPanel* panel);
		void PopPanel(IPanel* panel);

		void OnUpdate(float deltaTime);
		void Clear();

	private:
		std::vector<IPanel*> m_panels;
	};
    
} // namespace ide
