export const userColumns = [
    { field: "id", headerName: "ID", width: 150 },
    {
      field: "product",
      headerName: "Product",
      width: 150,
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
      field: "quantity",
      headerName: "Quantity",
      width: 100,
    },
  
    {
      field: "shippingaddress",
      headerName: "Shipping Address",
      width: 200,
    },
    
    {
      field: "deliverydate",
      headerName: "Delivery Date",
      width: 150,
    },
    {
      field: "status",
      headerName: "Status",
      width: 160,
      renderCell: (params) => {
        return (
          <div className={`cellWithStatus ${params.row.status}`}>
            {params.row.status}
          </div>
        );
      },
    },
  ];

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
  
  