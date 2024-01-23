import ReactDOM from "react-dom/client";
import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
const NoteApp = lazy(() => import('./pages/NoteApp'));
//import NoteApp from "./pages/NoteApp";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import NoPage from "./pages/NoPage";
import { UserProvider } from "./lib/context/user";
import RequireAuth from "./views/RequireAuth";

import LoadingPage from "./pages/LoadingPage";
import PublishedNote from "./pages/PublishedNote";
import RegisterPage from "./pages/RegisterPage";
import VerifyPage from "./pages/VerifyPage";


import packageJson from '../package.json';


function App() {
  return (
    <UserProvider>
        <div className="package-version">
        <b>Alpha</b> v{packageJson.version}
          
          </div>
        <Suspense fallback={<LoadingPage/>}>
            <BrowserRouter>
            <Routes>
                <Route path="/">
                <Route index element={<LandingPage/>} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="verify" element={<VerifyPage/>} />
                <Route path="app" element={<RequireAuth><NoteApp/></RequireAuth>} />
                <Route path="note" element={<PublishedNote/>}>
                  <Route path="*" element={<PublishedNote/>}/>
                </Route>
                <Route path="*" element={<NoPage />} />
                </Route>
            </Routes>
            </BrowserRouter>
        </Suspense>
    </UserProvider>
  );
}

export default App