import "./order.scss";
import "./order.css";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Widget from "../widget/Widget";
import { userColumns, userRows } from "../../DataTableSources/ordertablesource";
import {
  Modal,
  Button,
  Box,
  Stepper,
  Step,
  StepLabel,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState, useEffect } from "react";
import { db, auth } from "../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  Timestamp,
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
  writeBatch
} from "firebase/firestore";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Papa from "papaparse";
import { onAuthStateChanged } from "firebase/auth";
import { Inventory } from "@mui/icons-material";

const OrderModule = () => {
  const [data, setData] = useState(userRows);
  const [open, setOpen] = useState(false);
  const [productModal, setProductModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null); // To track selected row for delete
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0); // Tracks the current step in the stepper
  const [selectedOrderId, setSelectedOrderId] = useState(null); // Tracks the order being viewed
  const [timerRunning, setTimerRunning] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorE2, setAnchorE2] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  const steps = ["New", "In Transit", "Delivered"];
  const openExport = Boolean(anchorEl);
  // Function to open the modal and store the product ID to delete
  const handleOpen = (id) => {
    setSelectedId(id);
    setOpen(true);
  };

  const handleOpenProduct = () => {
    setProductModal(true);
  };
  const handleCloseExport = () => {
    setAnchorEl(null);
  };
  const handleMenuClick = (event, orderId) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrderId(orderId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  // Function to close the modal
  const handleCloseProduct = () => {
    setProductModal(false);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const [formData, setFormData] = useState({
    product: "",
    quantity: "",
    shippingaddress: "",
    status: "",
    deliverydate: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const validate = () => {
    let validationErrors = {};
    let isValid = true;
    setErrors(validationErrors);
    return isValid;
  };
  // Function to open the View Order modal
  const handleViewOrder = (id) => {
    setSelectedOrderId(id); // Set the order ID for the current order
    setViewModalOpen(true); // Open the modal
    setActiveStep(0); // Reset the stepper to the first step (New)
    setTimerRunning(false); // Ensure the timer is not running yet
  };

  // Function to close the View Order modal
  const handleCloseViewModal = () => {
    setViewModalOpen(false); // Close the modal
    setActiveStep(0); // Reset the stepper
    setTimerRunning(false); // Stop the timer
  };
  const handleCloseUpdate = () => {
    setUpdateModal(false); // Close the modal
     // Stop the timer
  };
  // Handle tracking the order
  //   const handleViewOrder = (id) => {
  //     setViewModalOpen(true); // Open the view modal
  //     handleMenuClose(); // Close the dropdown menu
  //     setSelectedOrderId(id); // Set the selected order
  //   };

  // Handle opening the delete confirmation modal
  const handleDeleteOrder = (id) => {
    setDeleteModalOpen(true); // Open delete confirmation modal
    handleMenuClose(); // Close the dropdown menu
    setSelectedOrderId(id); // Set the selected order for deletion
  };

  // Handle updating the order
  const handleUpdateOrder = (order) => {
    console.log(order);
    setSelectedOrder(order);
    console.log(selectedOrder)
    setFormData({
        product: order.product,
        quantity: order.quantity,
        shippingaddress: order.shippingaddress,
        deliverydate: order.deliverydate,
      });
      setUpdateModal(true);
    handleMenuClose(); // Close the dropdown menu
    // console.log("Updating order", id); // Placeholder for your update logic
  };
  // Function to update the order status in Firestore
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const orderDocRef = doc(db, "inventory", orderId); // Update the Firestore document
      await updateDoc(orderDocRef, {
        status: newStatus,
      });
      console.log("Order status updated to:", newStatus);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleSubmitUpdateOrder = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    try {
      const orderDocRef = doc(db, "orders", selectedOrder.id); // Reference to the Firestore document
      await updateDoc(orderDocRef, {
        product: formData.product,
        quantity: formData.quantity,
        shippingaddress: formData.shippingaddress,
        deliverydate: formData.deliverydate,
      });
  
      console.log("Order updated successfully!");
      setUpdateModal(false); // Close the modal
      fetchAllOrders(); // Re-fetch all orders to reflect the update
    } catch (error) {
      console.error("Error updating order: ", error);
    }
  };
  

  // Timer logic to update the status
  const startTimer = (orderId) => {
    setTimerRunning(true);
    setTimeout(() => {
      setActiveStep(1); // Move to "In Transit"
      updateOrderStatus(orderId, "In Transit"); // Update Firestore to "In Transit"
    }, 60000); // 1 minute for "In Transit"

    setTimeout(() => {
      setActiveStep(2); // Move to "Delivered"
      updateOrderStatus(orderId, "Delivered"); // Update Firestore to "Delivered"
      setTimerRunning(false); // Stop the timer after delivery
    }, 120000); // 2 minutes for "Delivered"
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form input before proceeding
    // if (!validate()) return;

    // setLoading(true);
    // setErrors({});

    try {
      // Get current authenticated user
      let userId = null;
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          console.log(user);
          userId = user.uid;
console.log("hello")
          // Add inventory to Firestore, tied to user
          const res = await addDoc(collection(db, "orders"), {
            product: formData.product,
            quantity: formData.quantity,
            shippingaddress: formData.shippingaddress,
            deliverydate: formData.deliverydate,
            status: "New",
            createdBy: userId,
            createdAt: Timestamp.now(), // Tie product to the user
          });
          console.log(res);
          setProductModal(false);
          fetchAllOrders();
          console.log(res);
          setSuccess(true);
          setFormData({
            product: "",
            quantity: "",
            shippingaddress: "",
            deliverydate: "",
          });
        }
      });
    } catch (error) {
      console.error("Error adding product: ", error);
      setErrors({ submit: "Failed to create product" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (selectedOrderId) {
        // Delete the product from Firestore
        const orderDocRef = doc(db, "orders", selectedOrderId);
        await deleteDoc(orderDocRef);

        // Update UI by removing the deleted product from the state
        setData(data.filter((item) => item.id !== selectedOrderId));
        console.log("Order deleted successfully");

        // Close the modal
        setDeleteModalOpen(false);
        fetchAllOrders();
      }
    } catch (error) {
      console.error("Error deleting product: ", error);
    }
  };
  // Function to fetch all product records
  const fetchAllProducts = async () => {
    try {
      // Fetch inventory records
      const inventoryCollection = collection(db, "inventory");
      const inventoryQuery = query(
        inventoryCollection,
        orderBy("createdAt", "desc")
      );
      const inventorySnapshot = await getDocs(inventoryQuery);

      const inventoryList = [];
      inventorySnapshot.forEach((doc) => {
        inventoryList.push({ id: doc.id, ...doc.data() });
      });
      console.log(inventoryList);
      // Fetch products records
      const productsCollection = collection(db, "products");
      const productsQuery = query(
        productsCollection,
        orderBy("createdAt", "desc")
      );
      const productsSnapshot = await getDocs(productsQuery);

      const productsList = [];
      productsSnapshot.forEach((doc) => {
        productsList.push({ id: doc.id, ...doc.data() });
      });
      console.log(productsList);

      // Combine both lists (optional step depending on how you want to manage the data)
      const combinedProducts = [...inventoryList, ...productsList];
      console.log(combinedProducts);
      // Update state with the fetched data
      setProducts(combinedProducts); // Store fetched data in state
      setLoading(false);
    } catch (error) {
      setErrors("Error fetching products");
      setLoading(false);
    }
  };
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
      setLoading(false); // Set loading to false after fetching is complete
    } catch (error) {
      setErrors("Error fetching products");
      setLoading(false); // Ensure loading stops even in case of an error
    }
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget); // No need for type annotation here
  };
  const handleExportCSV = () => {
    // Convert your products array to CSV format using papaparse
    const csv = Papa.unparse(orders);

    // Create a Blob from the CSV data and trigger a download
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inventory_records.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Set PDF title and column headers
    doc.text("Inventory Records", 20, 10);
    doc.autoTable({
      head: [
        [
          "Product",
          "Quantity",
          "Shipping Address",
          "Delivery Date",
          "Status",
        ],
      ],
      body: orders.map((order) => [
        order.product,
        order.quantity,
        order.shippingaddress,
        order.deliverydate,
        order.status,
        new Date(order.createdAt.seconds * 1000).toLocaleString(),
      ]),
    });

    // Save the PDF
    doc.save("order_records.pdf");
  };
  const handleBulkUpload = (event) => {
    const file = event.target.files[0]; // Get the selected file

    if (!file) {
      setUploadStatus("No file selected");
      console.log("No file selected");
      return;
    }

    console.log(`Processing file: ${file.name}`);

    Papa.parse(file, {
      header: true, // Treat first row as headers
      complete: async (result) => {
        const data = result.data;
        console.log("Parsed Data:", data);

        try {
          const inventoryCollection = collection(db, "inventory"); // Specify the collection
          const batchSize = 500; // Firestore allows up to 500 writes per batch
          let batch = writeBatch(db); // Create the first batch
          let batchCounter = 0;

          for (let i = 0; i < data.length; i++) {
            const inventoryItem = data[i];

            // Create a reference to a new document in Firestore
            const docRef = doc(inventoryCollection);

            // Log the inventory item to be uploaded
            console.log("Uploading Item:", inventoryItem);

            // Use the structure you specified for the Firestore document
            batch.set(docRef, {
              vendorName: inventoryItem.vendorName,
              category: inventoryItem.category,
              quantity: parseInt(inventoryItem.quantity), // Ensure quantity is an integer
              batchnumber: inventoryItem.batchnumber,
              name: inventoryItem.name,
              datecreated: new Date().toISOString(), // Use the current date
              uom: inventoryItem.uom,
              createdBy: "", // Replace userId with the actual user ID
              createdAt: Timestamp.now(), // Tie product to the user
            });

            batchCounter++;

            // If batch is full or this is the last item, commit the batch
            if (batchCounter === batchSize || i === data.length - 1) {
              await batch.commit(); // Commit the batch
              console.log(`Committed batch of size: ${batchCounter}`);
              batch = writeBatch(db); // Create a new batch for the next set
              batchCounter = 0; // Reset the counter
            }
          }

          setUploadStatus("Bulk upload successful!");
          console.log("Bulk upload successful!");
        } catch (error) {
          console.error("Error uploading data: ", error);
          setUploadStatus("Error uploading data");
        }
      },
      error: (error) => {
        console.error("Error parsing file: ", error);
        setUploadStatus("Error parsing file");
      },
    });
  };

  useEffect(() => {
    fetchAllOrders();
    fetchAllProducts();
    if (viewModalOpen && selectedOrderId && !timerRunning) {
      // Start the timer only if the modal is open and the timer isn't already running
      startTimer(selectedOrderId);
    }
  }, [viewModalOpen, selectedOrderId, timerRunning]);
  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div>
            {/* Dropdown icon button */}
            <IconButton
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={(event) => handleMenuClick(event, params.row.id)}
            >
              <MoreVertIcon />
            </IconButton>

            {/* Dropdown menu with options */}
            <Menu
              id="long-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl) && selectedOrderId === params.row.id} // Ensure the menu opens for the right row
              onClose={handleMenuClose}
              PaperProps={{
                style: {
                  maxHeight: 48 * 4.5,
                  width: "20ch",
                },
              }}
            >
              <MenuItem onClick={() => handleViewOrder(params.row.id)}>
                Track Order
              </MenuItem>
              <MenuItem onClick={() => handleUpdateOrder(params.row)}>
                Update Order
              </MenuItem>
              <MenuItem onClick={() => handleDeleteOrder(params.row.id)}>
                Delete Order
              </MenuItem>
            </Menu>
          </div>
        );
      },
    },
  ];

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Orders
        {/* Modal open button */}
        <div className="upt">
          <Button
            onClick={handleOpenProduct}
            variant="contained"
            startIcon={<AddIcon />} // Adds the plus icon
            style={{
              backgroundColor: "#008000", // Green color
              color: "white", // White text
              padding: "6px 10px",
              borderRadius: "50px", // Rounded edges
              textTransform: "none", // No uppercase
              fontSize: "10px",
            }}
          >
            Create Order
          </Button>
          <input
            type="file"
            accept=".csv"
            onChange={handleBulkUpload}
            style={{ display: "none" }}
            id="file-input"
          />
          <Button
            variant="contained"
            startIcon={<CloudUploadIcon />}
            style={{
              backgroundColor: "#008000", // Green color
              color: "white", // White text
              padding: "6px 10px",
              borderRadius: "50px", // Rounded edges
              textTransform: "none", // No uppercase
              fontSize: "10px",
            }}
            onClick={() => document.getElementById("file-input").click()}
          >
            Bulk Upload
          </Button>
          {/* <div>
            <Button
              id="demo-positioned-button"
              aria-controls={open ? "demo-positioned-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
              variant="contained"
              startIcon={<FileDownloadIcon />}
              style={{
                backgroundColor: "#008000", // Green color
                color: "white", // White text
                padding: "6px 10px",
                borderRadius: "50px", // Rounded edges
                textTransform: "none", // No uppercase
                fontSize: "10px",
              }}
            >
              Export
            </Button>
            <Menu
              id="demo-positioned-menu"
              aria-labelledby="demo-positioned-button"
              anchorEl={anchorEl}
              open={openExport}
              onClose={handleCloseExport}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <MenuItem onClick={handleExportPDF}>PDF</MenuItem>
              <MenuItem onClick={handleExportCSV}>CSV</MenuItem>
            </Menu>
          </div> */}
        </div>
      </div>
      <div className="widgets">
        <Widget type="all orders" />
        <Widget type="pending orders" />
        <Widget type="in progress" />
        <Widget type="completed" />
      </div>
      <DataGrid
        className="datagrid"
        rows={orders}
        columns={userColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />

      {/* Material UI Modal */}
      <Modal
        open={productModal}
        onClose={handleCloseProduct}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "51%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            textAlign: "center",
          }}
        >
          {/* Close Button */}
          <IconButton
            sx={{ position: "absolute", top: 8, right: 8 }} // positioning the button
            onClick={handleCloseProduct}
          >
            <CloseIcon />
          </IconButton>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Product</label>
              <select
                name="product"
                value={formData.product}
                onChange={handleChange}
              >
                <option value="">Select an option</option>
                {products.map((product) => (
                  <option key={product.id} value={product.name}>
                    {product.name}{" "}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                name="quantity"
                placeholder="Enter Quantity"
                value={formData.quantity}
                onChange={handleChange}
              />
              {/* {errors.name && <p className="error">{errors.name}</p>} */}
            </div>

            {/* </div> */}

            <div className="form-group">
              <label>Shipping Address</label>
              <input
                type="text"
                name="shippingaddress"
                placeholder="Enter shipping address"
                value={formData.shippingaddress}
                onChange={handleChange}
              />
              {/* {errors.batchnumber && (
                <p className="error">{errors.batchnumber}</p>
              )} */}
            </div>
            <div className="form-group">
              <label>Delivery Date</label>
              <input
                type="date"
                name="deliverydate"
                placeholder="Enter Delivery Date"
                value={formData.deliverydate}
                onChange={handleChange}
              />
              {/* {errors.price && <p className="error">{errors.price}</p>} */}
            </div>
            {/* </div> */}
            <button type="submit" className="signup-button">
              Submit
            </button>
          </form>
        </Box>
      </Modal>
      {/* Modal for confirming deletion */}
      <Modal
        open={deleteModalOpen}
        onClose={handleClose} // Close modal if clicked outside or "No" is selected
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            textAlign: "center",
          }}
        >
          <h2 id="modal-modal-title">Delete Product</h2>
          <p id="modal-modal-description">
            Are you sure you want to delete this order?
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleDelete} // Delete product on confirm
              style={{ marginRight: "10px" }}
            >
              Yes
            </Button>
            <Button variant="contained" color="secondary" onClick={handleClose}>
              No
            </Button>
          </div>
        </Box>
      </Modal>
      {/* Modal for Viewing Order */}
      <Modal
        open={viewModalOpen}
        onClose={handleCloseViewModal}
        aria-labelledby="order-status-modal"
        aria-describedby="order-status-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            textAlign: "center",
          }}
        >
          <h2 id="order-status-modal">Order Status</h2>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((label, index) => (
              <Step key={index}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      </Modal>
      <Modal
        open={updateModal}
        onClose={handleCloseUpdate}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "51%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            textAlign: "center",
          }}
        >
          {/* Close Button */}
          <IconButton
            sx={{ position: "absolute", top: 8, right: 8 }} // positioning the button
            onClick={handleCloseProduct}
          >
            <CloseIcon />
          </IconButton>

          <form onSubmit={handleSubmitUpdateOrder}>
            <div className="form-group">
              <label>Product</label>
              <select
                name="product"
                value={formData.product}
                onChange={handleUpdateChange}
              >
                <option value="">Select an option</option>
                {products.map((product) => (
                  <option key={product.id} value={product.name}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                name="quantity"
                placeholder="Enter Quantity"
                value={formData.quantity}
                onChange={handleUpdateChange}
              />
            </div>

            <div className="form-group">
              <label>Shipping Address</label>
              <input
                type="text"
                name="shippingaddress"
                placeholder="Enter Shipping Address"
                value={formData.shippingaddress}
                onChange={handleUpdateChange}
              />
            </div>

            <div className="form-group">
              <label>Delivery Date</label>
              <input
                type="date"
                name="deliverydate"
                value={formData.deliverydate}
                onChange={handleUpdateChange}
              />
            </div>

            <button type="submit" className="signup-button">
              Update Order
            </button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default OrderModule;
