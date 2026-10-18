import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/react";
import { Navigate, Route, Routes } from "react-router";
import { Toaster } from "react-hot-toast";
import ProblemsPage from "./pages/ProblemsPage";
import HomePage from "./pages/HomePage";

function App() {
  const { isSignedIn } = useUser(); // useUser() is a clerk hook

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route
          path="/problems"
          element={isSignedIn ? <ProblemsPage /> : <Navigate to={"/"} />}
        ></Route>
      </Routes>
      <Toaster toastOptions={{ duration: 3000 }} />
    </>
  );
}

export default App;
