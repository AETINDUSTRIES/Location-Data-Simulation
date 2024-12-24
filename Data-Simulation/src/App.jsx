import React from "react";
import "./App.css";
import { useUserContext } from "./context/UserContext";
import AuthForm from "./components/AuthForm";
import MainApp from "./MainApp";

function App() {
  const { isAuthenticated } = useUserContext();


  return isAuthenticated ? <MainApp /> : <AuthForm />;
}

export default App;
