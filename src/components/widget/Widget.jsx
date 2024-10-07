import "./widget.scss";
import { Link } from 'react-router-dom';
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CategoryIcon from '@mui/icons-material/Category';
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const Widget = ({ type }) => {
  let data;
  let backgroundColor = '';
  let iconColor = '';

  //temporary
  const amount = 100;
  const diff = 20;

  switch (type) {
    case "user":
      data = {
        title: "DELIVERIES MADE",
        count:100,
        link: (
          <Link to="/list/order" className="">
            View all orders
          </Link>
        ),
        icon: (
          <PersonOutlinedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      backgroundColor = "#FFFF";
      break;
    case "order":
      data = {
        title: "ORDERS",
        count:200,
        link: (
          <Link to="/list/order" className="orderLink">
            View all orders
          </Link>
        ),
        icon: (
          <ShoppingCartOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(218, 165, 32, 0.2)",
              color: "goldenrod",
            }}
          />
        ),
      };
      backgroundColor = "#FFFF";
      break;
    case "earning":
      data = {
        title: "TOTAL PRODUCTS",
        count:300,
        link: (
          <Link to="/list/datatable" className="orderLink">
            View all products
          </Link>
        ),
        icon: (
          <MonetizationOnOutlinedIcon
            className="icon"
            style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
          />
        ),
      };
      backgroundColor = "#FFFF";
      break;
    case "balance":
      data = {
        title: "TODAY'S DISPATCH",
        count:500,
        link: (
          <Link to="/list/order" className="orderLink">
            View all orders
          </Link>
        ),
        icon: (
          <AccountBalanceWalletOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(128, 0, 128, 0.2)",
              color: "purple",
            }}
          />
        ),
      };
      backgroundColor = "#FFFF";
      break;
      case "product available":
      data = {
        title: "Product Available",
        count:500,
        icon: (
           <CategoryIcon
            className="icon"
            style={{
              // backgroundColor: "rgba(128, 0, 128, 0.2)",
              color: "#008000",             
            }}
          />
        ),
      };
      backgroundColor = "#FFFF";
      break;
      case "low stock":
      data = {
        title: "Low Stock",
        count:500,
        icon: (
          <CategoryIcon
            className="icon"
            style={{
              color: "#008000",
            }}
          />
        ),
      };
      backgroundColor = "#FFFF";
      break;
      case "expired":
      data = {
        title: "Expired",
        count:200,
        icon: (
          <CategoryIcon
            className="icon"
            style={{
              color: "#008000",
            }}
          />
        ),
      };
      backgroundColor = "#FFFF";
      break;
      case "reorderlist":
      data = {
        title: "Reorder List",
        count:500,
        icon: (
          <CategoryIcon
            className="icon"
            style={{
              color: "#008000",
            }}
          />
        ),
      };
      backgroundColor = "#FFFF";
      break;
      case "all orders":
      data = {
        title: "All Orders",
        count:200,
        icon: (
          <ShoppingCartIcon
            className="icon"
            style={{
              color: "#008000",
            }}
          />
        ),
      };
      backgroundColor = "#FFFF";
      break;
      case "pending orders":
      data = {
        title: "Pending Orders",
        count:200,
        icon: (
          <ShoppingCartIcon
            className="icon"
            style={{
              color: "#008000",
            }}
          />
        ),
      };
      backgroundColor = "#FFFF";
      break;
      case "in progress":
      data = {
        title: "In Progress",
        count:200,
        icon: (
          <ShoppingCartIcon
            className="icon"
            style={{
              color: "#008000",
            }}
          />
        ),
      };
      backgroundColor = "#FFFF";
      break;
      case "completed":
      data = {
        title: "Completed",
        count:200,
        icon: (
          <ShoppingCartIcon
            className="icon"
            style={{
              color: "#008000",
            }}
          />
        ),
      };
      backgroundColor = "#FFFF";
      break;
    default:
      break;
  }

  return (
    <div className="widget" style={{ backgroundColor: backgroundColor }}>
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">
          {data.count}
        </span>
        <span className="link">{data.link}</span>
      </div>
      <div className="right">
        <div className="percentage positive">
          <KeyboardArrowUpIcon />
          {diff} %
        </div>
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;
