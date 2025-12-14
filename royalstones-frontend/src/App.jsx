import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
    <ToastContainer position="top-right" autoClose={2000} />
    <BrowserRouter>
      <Header />
      <AppRoutes />
      <Footer />
    </BrowserRouter>
   </>
  );
}

export default App;
