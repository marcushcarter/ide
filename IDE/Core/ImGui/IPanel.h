#pragma once
#include "pch.h"
#include "Core/ImGui/PanelStack.h"

namespace ide
{
    class PanelStack;
    
    class IPanel {
    public:
        IPanel(PanelStack* panelStack, const std::string name = "Panel")
            : m_panelStack(panelStack), m_name(name), m_open(true) {}
        
        virtual ~IPanel() = default;

		virtual void OnAttach() = 0;
		virtual void OnDetach() = 0;
        virtual void OnUpdate(float deltaTime) = 0;

        bool IsOpen() const { return m_open; }
        void SetOpen(bool open) { m_open = open; }

		const std::string& getName() const { return m_name; }
        
	protected:
        PanelStack* m_panelStack;
        bool m_open;
    
    private:
		std::string m_name;
    };
    
} // namespace ide
