// import { useState, useEffect } from "react";
// import { Link, Redirect } from "react-router-dom";
// import Layout from "../core/Layout";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.min.css";


// const Activate = ({ match }) => {
//   const [values, setValues] = useState({
//     name: "",
//     token: "",
//     show: true,
//   });
  
//   useEffect(() => {
//     clickSubmit()
    
//   }, []);

//   const { name, token, show } = values;

//   const clickSubmit = () => {
//     setValues({ ...values, buttonText: "Submitting" });
//     axios({
//       method: "POST",
//       url: `${process.env.REACT_APP_API}/accountactivation`,
//       data: { token: match.params.token },
//     })
//       .then((response) => {
//         console.log(response);
//         setValues({
//           ...values,
//           show: false,
//         });
//         toast.success(response.data.message);
//       })
//       .catch((error) => {
//         console.log("Activate ERROR: " + error.response.data);
//         setValues({ ...values, buttonText: "submit" });
//         toast.error(error.response.data.error);
//       });
//   };

//   const activationLink = () => (
//     <div className="text-center">
//       <h1 className="p-5">{name}, activate your account</h1>
//       <button className="btn btn-outline-primary" onClick={clickSubmit}>
//         Activate Account
//       </button>
//     </div>
//   );
//   return (
//     <Layout>
//       <div className="col-md-6 offset-md-3">
//         <ToastContainer />
//         {/* {JSON.stringify({name, email, password})}  */}

//         {activationLink()}
//       </div>
//     </Layout>
//   );
// };

// export default Activate;
