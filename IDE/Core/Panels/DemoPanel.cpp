#include "Panels/DemoPanel.h"

namespace ballistic
{
    DemoPanel::DemoPanel(LayerContext& context, PanelStack& panelStack, const std::string& name) 
        : IPanel(context, panelStack, name) {}
    
    void DemoPanel::OnAttach() {}
    void DemoPanel::OnDetach() {}

    void DemoPanel::OnUpdate(float deltaTime) {
        ImGui::ShowDemoWindow();

        ImGui::Begin("ImPlot Demo Window");
        ImPlot::ShowDemoWindow();
        ImGui::End();

    }

    void DemoPanel::OnEvent(IEvent& e) {}

} // namespace ballistic
