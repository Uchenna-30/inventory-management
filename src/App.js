import Home from "./pages/home/Home";
import Signup from "./pages/Signup/signup";
import Login from "./pages/login/login";
import List from "./pages/list/List";
import Single from "./pages/single/Single";
import New from "./pages/new/New";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import { productInputs, userInputs } from "./formSource";
import "./style/dark.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import InventoryModule from "./components/inventory/Inventory";
import OrderModule from "./components/order/Order";
import Datatable from "./components/datatable/Datatable";

function App() {
  return (
    <Router> {/* Ensure this is correctly wrapping your Routes */}
      <Routes>
        {/* Add Signup and Login routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Login />} />
        
        <Route path="/list" element={<List />}>
          {/* Pass children components here */}
          <Route path="home" element={<Home />} />
          <Route path="inventory" element={<InventoryModule />} />
          <Route path="datatable" element={<Datatable />} />
          <Route path="order" element={<OrderModule />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
