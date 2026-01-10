#pragma once
#include "pch.h"

namespace ide
{
    class Window;

    class ImGuiLayer
    {
    public:
        ImGuiLayer() = default;
        ~ImGuiLayer() { Shutdown(); }

        bool Init(Window* window);
        void Shutdown();
        void BeginFrame();
        void EndFrame();
    };
    
} // namespace ide