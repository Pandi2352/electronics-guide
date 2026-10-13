import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import SensorsPage from "./pages/SensorsPage";
import SensorDetailPage from "./pages/SensorDetailPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import ResistorsPage from "./pages/ResistorsPage";
import CapacitorsPage from "./pages/CapacitorsPage";
import PotentiometersPage from "./pages/PotentiometersPage";
import RelaysPage from "./pages/RelaysPage";
import DiodesPage from "./pages/DiodesPage";
import TransistorsPage from "./pages/TransistorsPage";
import MosfetsPage from "./pages/MosfetsPage";
import IcsPage from "./pages/IcsPage";
import ConvertersPage from "./pages/ConvertersPage";
import InductorsPage from "./pages/InductorsPage";
import OptocouplersPage from "./pages/OptocouplersPage";
import BuzzersPage from "./pages/BuzzersPage";
import RegulatorsPage from "./pages/RegulatorsPage";
import ModulesPage from "./pages/ModulesPage";
import ModuleDetailPage from "./pages/ModuleDetailPage";
import NotFoundPage from "./pages/NotFoundPage";

// HashRouter keeps deep links working on any static host without server rewrites.
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/sensors" replace />} />
          <Route path="sensors" element={<SensorsPage />} />
          <Route path="sensors/:sku" element={<SensorDetailPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:id" element={<ProjectDetailPage />} />
          <Route path="resistors" element={<ResistorsPage />} />
          <Route path="capacitors" element={<CapacitorsPage />} />
          <Route path="inductors" element={<InductorsPage />} />
          <Route path="potentiometers" element={<PotentiometersPage />} />
          <Route path="diodes" element={<DiodesPage />} />
          <Route path="transistors" element={<TransistorsPage />} />
          <Route path="mosfets" element={<MosfetsPage />} />
          <Route path="optocouplers" element={<OptocouplersPage />} />
          <Route path="relays" element={<RelaysPage />} />
          <Route path="buzzers" element={<BuzzersPage />} />
          <Route path="ics" element={<IcsPage />} />
          <Route path="regulators" element={<RegulatorsPage />} />
          <Route path="converters" element={<ConvertersPage />} />
          <Route path="modules" element={<ModulesPage />} />
          <Route path="modules/:id" element={<ModuleDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
