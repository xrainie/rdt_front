import {Navigate, Route, Routes, useLocation} from "react-router-dom";
import { useEffect, useState } from "react";

import { Context } from "./common/utils/context";
import { AuthorizationPage } from "./pages/AuthorizationPage";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { RoutePage } from "./pages/RoutePage";
import { NewRoutePage } from "./pages/NewRoutePage";
import { ArchivePage } from "./pages/ArchivePage";
import { ReportPage } from "./pages/ReportPage";
import { QuadcopterPage } from "./pages/QuadcopterPage";
import { DetectionSettingPage } from "./pages/DetectionSettingPage";
import { ErrorsPage } from "./pages/ErrorsPage";
import {getRoutes} from "./api";

function App() {
  const location = useLocation();

  const [isAuthorized, setIsAuthorized] = useState(!!localStorage.getItem("token"));
  const [isOpenRouteDropdown, setIsOpenRouteDropdown] = useState(false);
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    if (location.pathname.includes('routes/')) {
      setIsOpenRouteDropdown(true);
    }
  }, [location])

  const getRoutesData = () => {
    getRoutes().then((response) => {
      setRoutes(response.data);
    }).catch((error) => {
      console.log(error);
    });
  }

  useEffect(() => {
    getRoutesData();
  }, []);

  return (
    <Context.Provider
      value={{
        isAuthorized,
        setIsAuthorized,
        isOpenRouteDropdown,
        setIsOpenRouteDropdown,
        routes,
        getRoutesData,
      }}>
      <Routes>
        <Route path='auth/' element={isAuthorized ? <Navigate to={`/`} /> : <AuthorizationPage />} />
        <Route path='/'  element={isAuthorized ? <Layout /> : <Navigate to={`/auth`} />} >
          <Route index element={isAuthorized ? <HomePage /> : <Navigate to={`/auth`} />} />
          <Route path='new-route/' element={isAuthorized ? <NewRoutePage /> : <Navigate to={`/auth`} />} />
          <Route path='routes/:id' element={isAuthorized ? <RoutePage /> : <Navigate to='/auth' />}/>
          <Route path='archive/' element={isAuthorized ? <ArchivePage /> : <Navigate to={`/auth`} />} />
          <Route path='archive/report/:id' element={isAuthorized ? <ReportPage /> : <Navigate to={`/auth`} />} />
          <Route path='quadcopters/' element={isAuthorized ? <QuadcopterPage /> : <Navigate to={`/auth`} />} />
          <Route path='detection-setting/' element={isAuthorized ? <DetectionSettingPage /> : <Navigate to={`/auth`} />} />
          <Route path='errors/' element={isAuthorized ? <ErrorsPage /> : <Navigate to={`/auth`} />} />
        </Route>
      </Routes>
    </Context.Provider>
  );
}

export default App;
