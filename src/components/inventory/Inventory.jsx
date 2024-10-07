import "./inventory.scss";
import "./inventory.css";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Papa from "papaparse"; // Import jsPDF for PDF generation
import Widget from "../../components/widget/Widget";
import { DataGrid } from "@mui/x-data-grid";
import {
  userColumns,
  userRows,
} from "../../DataTableSources/inventorytablesource";
import { Modal, Button, Box, IconButton, Menu, MenuItem } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import Box from "@mui/material/Box"; // For modal styling
import { Link } from "react-router-dom";
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
  writeBatch,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Inventory } from "@mui/icons-material";

const InventoryModule = () => {
  const [data, setData] = useState(userRows);
  const [open, setOpen] = useState(false);
  const [productModal, setProductModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null); // To track selected row for delete
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [products, setProducts] = useState([]);
  const [uploadStatus, setUploadStatus] = useState("");

  // Function to open the modal and store the product ID to delete
  const handleOpen = (id) => {
    setSelectedId(id);
    setOpen(true);
  };
  const [anchorEl, setAnchorEl] = useState(null); // Remove type annotation
  const openExport = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget); // No need for type annotation here
  };

  const handleCloseExport = () => {
    setAnchorEl(null);
  };
  const handleOpenProduct = () => {
    setProductModal(true);
  };

  // Function to close the modal
  const handleCloseProduct = () => {
    setProductModal(false);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const [formData, setFormData] = useState({
    vendorName: "",
    category: "",
    quantity: "",
    batchnumber: "",
    uom: "",
    datecreated: "",
    name: "",
  });
  const handleChange = (e) => {
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

          // Add inventory to Firestore, tied to user
          const res = await addDoc(collection(db, "inventory"), {
            vendorName: formData.vendorName,
            category: formData.category,
            quantity: formData.quantity,
            batchnumber: formData.batchnumber,
            name: formData.name,
            datecreated: new Date().toISOString(),
            uom: formData.uom,
            createdBy: userId,
            createdAt: Timestamp.now(), // Tie product to the user
          });
          setProductModal(false);
          fetchAllProducts();
          console.log(res);
          setSuccess(true);
          setFormData({
            vendorName: "",
            category: "",
            quantity: "",
            batchnumber: "",
            name: "",
            datecreated: "",
            uom: "",
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
      if (selectedId) {
        // Delete the product from Firestore
        const productDocRef = doc(db, "inventory", selectedId);
        await deleteDoc(productDocRef);

        // Update UI by removing the deleted product from the state
        setData(data.filter((item) => item.id !== selectedId));
        console.log("Product deleted successfully");

        // Close the modal
        setOpen(false);
        fetchAllProducts();
      }
    } catch (error) {
      console.error("Error deleting product: ", error);
    }
  };
  // Function to fetch all product records

  const fetchAllProducts = async () => {
    try {
      // Reference to the "products" collection with ordering by "createdAt" field in descending order
      const productsCollection = collection(db, "inventory");
      const q = query(productsCollection, orderBy("createdAt", "desc"));

      // Fetch all documents from the ordered query
      const querySnapshot = await getDocs(q);

      // Process and store the fetched documents in a temporary array
      const productsList = [];
      querySnapshot.forEach((doc) => {
        productsList.push({ id: doc.id, ...doc.data() }); // Push each document's data to the array
      });

      // Update the products state with the fetched data
      setProducts(productsList);
      setLoading(false); // Set loading to false after fetching is complete
    } catch (error) {
      setErrors("Error fetching products");
      setLoading(false); // Ensure loading stops even in case of an error
    }
  };
  const handleExportCSV = () => {
    // Convert your products array to CSV format using papaparse
    const csv = Papa.unparse(products);

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
          "Vendor Name",
          "Category",
          "Quantity",
          "Batch Number",
          "UOM",
          "Created At",
        ],
      ],
      body: products.map((product) => [
        product.vendorName,
        product.category,
        product.quantity,
        product.batchnumber,
        product.uom,
        new Date(product.createdAt.seconds * 1000).toLocaleString(),
      ]),
    });

    // Save the PDF
    doc.save("inventory_records.pdf");
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
    fetchAllProducts();
  }, []);
  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link style={{ textDecoration: "none" }}>
              <div className="viewButton">View</div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleOpen(params.row.id)} // Open modal when delete is clicked
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Inventory
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
            Add Inventory
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
          <div>
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
          </div>
        </div>
      </div>
      <div className="widgets">
        <Widget type="product available" />
        <Widget type="low stock" />
        <Widget type="expired" />
        <Widget type="reorderlist" />
      </div>
      <DataGrid
        className="datagrid"
        rows={products}
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
            top: "40%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            textAlign: "center",
            position: "relative", // add this for positioning
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
            {/* Combined fields for Name and Price */}
            <div className="product-form-row">
              <div className="form-group">
                <label>Vendor Name</label>
                <input
                  type="text"
                  name="vendorName"
                  placeholder="Enter Vendor name"
                  value={formData.vendorName}
                  onChange={handleChange}
                />
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
              </div>
            </div>
            <div className="product-form-row">
              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="inventory-select"
                >
                  <option value="">Select an option</option>
                  <option value="GS">General Sales List</option>
                  <option value="PM">Pharmacy Medicines</option>
                  <option value="POM">Prescription Only Medicines</option>
                  <option value="CD">Controlled Drugs</option>
                </select>
              </div>
              <div className="form-group">
                <label>SubCategory</label>
                <select
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="inventory-select"
                >
                  <option value="">Select an option</option>
                  <option value="GS">Drug</option>
                  <option value="PM">Antidepressant</option>
                  <option value="POM">Anticoagulant</option>
                  <option value="CD">Analgesics</option>
                </select>
              </div>
            </div>
            {/* Combined fields for Quantity and Batch Number */}

            <div className="product-form-row">
              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  placeholder="Enter Quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Date Created</label>
                <input
                  type="date"
                  name="datecreated"
                  placeholder="Enter Date Created"
                  value={formData.datecreated}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Unit of Measurement</label>
              <select name="uom" value={formData.uom} onChange={handleChange}>
                <option value="">Select an option</option>
                <option value="kg">Kilogram</option>
                <option value="mg">Milligram</option>
              </select>
            </div>
            <button type="submit" className="signup-button">
              Submit
            </button>
          </form>
        </Box>
      </Modal>
      {/* Modal for confirming deletion */}
      <Modal
        open={open}
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
            Are you sure you want to delete this product?
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
    </div>
  );
};

export default InventoryModule;
