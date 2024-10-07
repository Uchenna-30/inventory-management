import "./datatable.scss";
import "./datatable.css";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns, userRows } from "../../datatablesource";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Papa from "papaparse";
// import Modal from "@mui/material/Modal";
// import Button from "@mui/material/Button";
import { Modal, Button, Box, Menu,MenuItem,IconButton, } from "@mui/material";
// import Box from "@mui/material/Box"; // For modal styling
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { db, auth } from "../../firebase";
import { collection, addDoc, getDocs, Timestamp, query, orderBy, deleteDoc, doc,writeBatch } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import AddIcon from "@mui/icons-material/Add";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import Widget from "../widget/Widget";

const Datatable = () => {
  const [data, setData] = useState(userRows);
  const [open, setOpen] = useState(false);
  const [productModal, setProductModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null); // To track selected row for delete
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [products, setProducts] = useState([]);
  const [uploadStatus, setUploadStatus] = useState("");
  const [anchorEl, setAnchorEl] = useState(null); // Remove type annotation
  const openExport = Boolean(anchorEl);
  // Function to open the modal and store the product ID to delete
  const handleOpen = (id) => {
    setSelectedId(id);
    setOpen(true);
  };

  const handleOpenProduct = () => {
    setProductModal(true);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget); // No need for type annotation here
  };

  const handleCloseExport = () => {
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
    name: "",
    price: "",
    quantity: "",
    batchnumber: "",
    description: "",
    datecreated: "",
    status: "",
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
          console.log(user)
          userId = user.uid
          // Add product to Firestore, tied to user
         const res = await addDoc(collection(db, "products"), {
            name: formData.name,
            price: formData.price,
            quantity: formData.quantity,
            batchnumber: formData.batchnumber,
            description: formData.description,
            datecreated: new Date().toISOString(),
            status: formData.status,
            createdBy: userId,
            createdAt: Timestamp.now(), // Tie product to the user
          });
          setProductModal(false);
          fetchAllProducts();
          console.log(res);
          setSuccess(true);
          setFormData({
            name: "",
            price: "",
            quantity: "",
            batchnumber: "",
            description: "",
            datecreated: "",
            status: "",
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
        const productDocRef = doc(db, "products", selectedId);
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
      const productsCollection = collection(db, "products");
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
    a.download = "product_records.csv";
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
          "Name",
          "Price",
          "Quantity",
          "Batch Number",
          "Description",
          "Date Created",
          "Status"
        ],
      ],
      body: products.map((product) => [
        product.name,
        product.price,
        product.quantity,
        product.batchnumber,
        product.description,
        product.datecreated,
        product.status,
        new Date(product.createdAt.seconds * 1000).toLocaleString(),
      ]),
    });

    // Save the PDF
    doc.save("product_records.pdf");
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
          const productCollection = collection(db, "products"); // Specify the collection
          const batchSize = 500; // Firestore allows up to 500 writes per batch
          let batch = writeBatch(db); // Create the first batch
          let batchCounter = 0;

          for (let i = 0; i < data.length; i++) {
            const productItem = data[i];

            // Create a reference to a new document in Firestore
            const docRef = doc(productCollection);

            // Log the inventory item to be uploaded
            // console.log("Uploading Item:", inventoryItem);

            // Use the structure you specified for the Firestore document
            batch.set(docRef, {
              name: productItem.name,
              price:productItem.price,
              quantity: parseInt(productItem.quantity), // Ensure quantity is an integer
              batchnumber: productItem.batchnumber,
              description: productItem.description,
              datecreated: new Date().toISOString(), // Use the current date
              status: productItem.status,
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
        Product
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
            Add Product
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
          }}
        >
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
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={handleChange}
                />
                {/* {errors.name && <p className="error">{errors.name}</p>} */}
              </div>
              <div className="form-group">
                <label>Price</label>
                <input
                  type="number"
                  name="price"
                  placeholder="Enter price"
                  value={formData.price}
                  onChange={handleChange}
                />
                {/* {errors.price && <p className="error">{errors.price}</p>} */}
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
                {errors.quantity && <p className="error">{errors.quantity}</p>}
              </div>
              <div className="form-group">
                <label>Batch Number</label>
                <input
                  type="number"
                  name="batchnumber"
                  placeholder="Enter batch number"
                  value={formData.batchnumber}
                  onChange={handleChange}
                />
                {errors.batchnumber && (
                  <p className="error">{errors.batchnumber}</p>
                )}
              </div>
            </div>
            <div className="product-form-row">
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  name="description"
                  placeholder="Enter Description"
                  value={formData.description}
                  onChange={handleChange}
                />
                {/* {errors.name && <p className="error">{errors.name}</p>} */}
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
                {/* {errors.price && <p className="error">{errors.price}</p>} */}
              </div>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="">Select an option</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              {/* {errors.userType && <p className="error">{errors.userType}</p>} */}
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

export default Datatable;
