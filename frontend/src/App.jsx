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
  const { isSignedIn, isLoaded } = useUser(); // useUser() is a clerk hook
  if (!isLoaded) return null; // when we are signed in and go to home page , the below navigation immediately sends us to dashboard , but what we see is : first we visit home for a split second then automatically navigated to dashboard because it usually takes more time for clerk to confirm whether user is authenticated or not, to remove that split second visit to home ( flickering effect ) , we only display the app when the user data is loaded beforehand .
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={!isSignedIn ? <HomePage /> : <Navigate to={"/dashboard"} />}
        ></Route>
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
