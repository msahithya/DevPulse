import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import OverviewPage from './pages/OverviewPage';
import RepositoryPage from './pages/RepositoryPage';
import CodeMapPage from './pages/CodeMapPage';
import ChangeSimulatorPage from './pages/ChangeSimulatorPage';
import PlaceholderPage from './pages/PlaceholderPage';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/"           element={<OverviewPage />} />
        <Route path="/repository" element={<RepositoryPage />} />
        <Route path="/code-map"   element={<CodeMapPage />} />
        <Route path="/simulator"  element={<ChangeSimulatorPage />} />
        <Route path="/impact"     element={<PlaceholderPage title="Impact Analysis" message="Run the Change Simulator first to see impact results." icon="impact" />} />
        <Route path="/risk"       element={<PlaceholderPage title="Risk Center"      message="Simulate a change to view risk factors and mitigation strategies." icon="risk" />} />
        <Route path="/tests"      element={<PlaceholderPage title="Test Impact"      message="Simulate a change to see recommended tests and execution results." icon="test" />} />
        <Route path="/scenarios"  element={<PlaceholderPage title="Scenario Compare" message="Save multiple simulations to compare their blast radius side-by-side." icon="compare" />} />
        <Route path="/release"    element={<PlaceholderPage title="Release Gate"     message="Complete impact analysis to evaluate release readiness." icon="release" />} />
        <Route path="/reports"    element={<PlaceholderPage title="Reports"          message="Generate and export impact reports after running simulations." icon="report" />} />
        <Route path="/settings"   element={<PlaceholderPage title="Settings"         message="Repository configuration and integration settings coming soon." icon="settings" />} />
      </Route>
    </Routes>
  );
}
