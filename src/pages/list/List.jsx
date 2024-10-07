import "./list.scss"
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import Datatable from "../../components/datatable/Datatable"
import Inventory from "../../components/inventory/Inventory"
import Order from "../../components/order/Order"

const List = () => {
  return (
    <div className="list">
      <Sidebar/>
      <div className="listContainer">
        <Navbar/>
        
        {/* <Datatable/> */}
        {/* <Inventory/> */}
        {/* <Order/> */}
        <Outlet />
      </div>
    </div>
  )
}

export default List