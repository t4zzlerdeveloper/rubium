import ReactDOM from "react-dom/client";
import { Suspense, lazy, useEffect } from "react";
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
import Version from "./views/Version";
import OAuth2 from "./pages/OAuth2";
import PricingPage from "./pages/PricingPage";



function App() {

  return (
    <UserProvider>
       <Version/>
        <Suspense fallback={<LoadingPage/>}>
            <BrowserRouter>
            <Routes>
                <Route path="/">
                  <Route index element={<LandingPage/>} />
                  <Route path="login" element={<LoginPage />} />
                  <Route path="auth">
                    <Route path="oauth2" >
                      <Route path="*" element={<OAuth2/>}/>
                    </Route>
                  </Route>
                  <Route path="register" element={<RegisterPage />} />
                  <Route path="verify" element={<VerifyPage/>} />
                  <Route path="app" element={<RequireAuth><NoteApp/></RequireAuth>}>
                    <Route path=":paramId" element={<RequireAuth><NoteApp/></RequireAuth>}/>
                  </Route>
                  <Route path="note" element={<PublishedNote/>}>
                    <Route path="*" element={<PublishedNote/>}/>
                  </Route>
                  <Route path="pricing" element={<PricingPage />} />
                  <Route path="*" element={<NoPage />} />
                </Route>
            </Routes>
            </BrowserRouter>
        </Suspense>
    </UserProvider>
  );
}

export default App