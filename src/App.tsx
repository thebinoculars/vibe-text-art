import { Switch, Route } from "wouter";
import Home from "./pages/Home";

// Adding dark mode class to root dynamically to enforce aesthetic
if (typeof document !== 'undefined') {
  document.documentElement.classList.add('dark');
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route>
        <div className="flex items-center justify-center min-h-screen">
          <h1 className="text-4xl font-bold">404 Not Found</h1>
        </div>
      </Route>
    </Switch>
  );
}

function App() {
  return <Router />;
}

export default App;
