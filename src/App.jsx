import Hybridhome from "./components/HybridHome";
import Sidebar, { SidebarProvider, SidebarTrigger } from "./components/Sidebar";


function App() {
  return (
    <div className="min-h-screen">
      <SidebarProvider>
          {/* your header elsewhere */}
          <Hybridhome />
          <Sidebar />
        </SidebarProvider>

    </div>
  );
}

export default App;
