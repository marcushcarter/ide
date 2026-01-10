#include <IDE.h>

int main() {
    ide::Application* app = ide::Application::CreateApplication();
    if (!app->Init())
        return -1;

    app->Run();
    delete app;
    return 0;
}