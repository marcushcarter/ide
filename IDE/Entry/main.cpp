#include <IDE.h>

int APIENTRY WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow) {
    ide::Application* app = ide::Application::CreateApplication();
    if (!app->Init())
        return -1;

    app->Run();
    delete app;
    return 0;
}