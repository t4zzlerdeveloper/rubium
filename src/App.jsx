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

function App() {
  return (
    <UserProvider>
        <Suspense fallback={<LoadingPage/>}>
            <BrowserRouter>
            <Routes>
                <Route path="/">
                <Route index element={<LandingPage/>} />
                <Route path="login" element={<LoginPage />} />
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