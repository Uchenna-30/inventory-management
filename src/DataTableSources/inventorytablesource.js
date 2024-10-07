export const userColumns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "vendorName",
      headerName: "Vendor Name",
      width: 100,
      // renderCell: (params) => {
      //   return (
      //     <div className="cellWithImg">
      //       <img className="cellImg" src={params.row.img} alt="avatar" />
      //       {params.row.name}
      //     </div>
      //   );
      // },
    },
    {
      field: "category",
      headerName: "Category",
      width: 100,
    },
  
    {
      field: "name",
      headerName: "Sub Category",
      width: 100,
    },
    
    {
      field: "batchnumber",
      headerName: "Batch Number",
      width: 100,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 100,
    },
    {
      field: "datecreated",
      headerName: "Date Created",
      width: 100,
    },
    {
        field: "uom",
        headerName: "UOM",
        width: 100,
      },
    // {
    //   field: "status",
    //   headerName: "Status",
    //   width: 160,
    //   renderCell: (params) => {
    //     return (
    //       <div className={`cellWithStatus ${params.row.status}`}>
    //         {params.row.status}
    //       </div>
    //     );
    //   },
    // },
  ];
  
  //temporary data
  export const userRows = [
    {
      id: 1,
      name: "Snow",
      status: "active",
      quantity: 34,
      batchnumber: 35,
      description:"ghjj",
      datecreated:"2/4/2024",
      price:36
    },
    
    {
      id: 2,
      name: "Snow",
      status: "active",
      quantity: 34,
      batchnumber: 35,
      description:"ghjj",
      datecreated:"2/4/2024",
      price:36
    },
    {
      id: 3,
      name: "Snow",
      status: "active",
      quantity: 34,
      batchnumber: 35,
      description:"ghjj",
      datecreated:"2/4/2024",
      price:36
    },
    {
      id: 4,
      name: "Snow",
      status: "active",
      quantity: 34,
      batchnumber: 35,
      description:"ghjj",
      datecreated:"2/4/2024",
      price:36
    },
    {
      id: 5,
      name: "Snow",
      status: "active",
      quantity: 34,
      batchnumber: 35,
      description:"ghjj",
      datecreated:"2/4/2024",
      price:36
    },
  ];
  