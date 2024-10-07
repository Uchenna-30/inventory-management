import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./home.scss";
import {useState, useEffect} from "react";
import {collection, getDocs,query, orderBy} from "firebase/firestore"
import {db} from "../../firebase"
import Widget from "../../components/widget/Widget";
import Featured from "../../components/featured/Featured";
import BarChart from "../../components/featured/Barchart";
import SectionUsage from "../../components/sectionusage/sectionusage";
import StatisticsCard from "../../components/featured/statisticscard";
import Chart from "../../components/chart/Chart";
import {ULineChart} from "../../components/ulinechart/ULineChart";
import Topcities from "../../components/topcities/Topcities";
import BestSellers from "../../components/bestseller/BestSeller";
import Table from "../../components/table/Table";
import RecentActivities from "../../components/recentactivities/RecentActivities";

const Home = () => {
  const [orders, setOrders] = useState([]);
  const [orderCount, setOrderCount] = useState(0);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const fetchAllOrders = async () => {
    try {
      // Reference to the "products" collection with ordering by "createdAt" field in descending order
      const productsCollection = collection(db, "orders");
      const q = query(productsCollection, orderBy("createdAt", "desc"));

      // Fetch all documents from the ordered query
      const querySnapshot = await getDocs(q);

      // Process and store the fetched documents in a temporary array
      const orderList = [];
      querySnapshot.forEach((doc) => {
        orderList.push({ id: doc.id, ...doc.data() }); // Push each document's data to the array
      });

      // Update the products state with the fetched data
      setOrders(orderList);
      setOrderCount(orderList.length);
      setLoading(false); // Set loading to false after fetching is complete
    } catch (error) {
      setErrors("Error fetching products");
      setLoading(false); // Ensure loading stops even in case of an error
    }
  };
  useEffect(() => {
    fetchAllOrders();
  }, []);
  return (
    <div className="home">
      {/* <Sidebar /> */}
      <div className="homeContainer">
        {/* <Navbar /> */}
        <div className="widgets">
          <Widget type="user" />
          <Widget type="order" />
          <Widget type="earning" />
          <Widget type="balance" />
        </div>
        <div className="charts">
        <Topcities/>
        <ULineChart/>
          {/* <StatisticsCard/> */}
          
          <SectionUsage/>
          {/* <BarChart/> */}       
          {/* <Chart title="Last 6 Months (Revenue)" aspect={2 / 1} /> */}
        </div>
        <div className="cha">
        <Featured  />
        <StatisticsCard/>
        {/* <BestSellers/> */}
        <RecentActivities/>
        
        </div>
        <div className="listContainer">
          <div className="listTitle">Latest Orders</div>
          <Table orders={orders} />
        </div>
      </div>
    </div>
  );
};

export default Home;
