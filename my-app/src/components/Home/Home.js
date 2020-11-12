import React, { Component } from "react";
class Home extends Component {
  state = {
    product_name: "",
    product_quantity: "",
    product_details: "",
    actors_to_send_products: [],
    send_to: "Select",
    user_type: "",
    available_products: [],
    selected_product_to_send: "Select",
    transport_details: "",
    product_id_to_search: "",
    product_search_details: [],
    transaction1:{},
    transaction2:{}
  };
  
  componentDidMount() {
    fetch("http://localhost:8000/core/get_user_details", {
      headers: {
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        this.setState((prevstate) => {
          const newState = { ...prevstate };
          if (data.type_of_user === "farmer") {
            newState["user_type"] = data.type_of_user;
            newState["actors_to_send_products"] = data.actors_to_send_products;
          } else if (data.type_of_user === "distributor") {
            newState["user_type"] = data.type_of_user;
            newState["actors_to_send_products"] = data.actors_to_send_products;
            newState["available_products"] = data.products;
          }
          else if(data.type_of_user==="customer"){
            newState["user_type"]=data.type_of_user;
            newState["available_products"]=data.products;
          }
          else if(data.type_of_user==="retailer"){
            newState["user_type"]=data.type_of_user;
          }
          return newState;
        });
      }).catch(error=>{console.log(error)});
  }

  handle_change = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    console.log(name, value);
    this.setState((prevstate) => {
      const newState = { ...prevstate };
      newState[name] = value;
      return newState;
    });
  };

  submitProduct = (e) => {
    e.preventDefault();
    let data = {};
    if (this.state.user_type === "farmer") {
      if (
        !!this.state.product_name &&
        !!this.state.product_quantity &&
        !!this.state.product_details &&
        this.state.send_to !== "Select"
      ) {
        data = {
          product_name: this.state.product_name,
          product_quantity: this.state.product_quantity,
          product_details: this.state.product_details,
          send_to: this.state.send_to,
          user: this.props.username,
          user_type: this.state.user_type,
        };
      } else {
        alert("All the fields are mandatory");
        return;
      }
    } else if (this.state.user_type === "distributor") {
      console.log("elif", this.state);
      if (
        this.state.selected_product_to_send !== "Select" &&
        this.state.send_to !== "Select"
      ) {
        data = {
          product_id: this.state.selected_product_to_send,
          send_to: this.state.send_to,
          user: this.props.username,
          user_type: this.state.user_type,
          transport_details: this.state.transport_details,
        };
      } else {
        alert("All the fields are mandatory");
        return;
      }
    }

    fetch("http://localhost:8000/core/create_product/", {
      method: "POST",
      headers: {
        Authorization: `JWT ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          product_name: "",
          product_quantity: "",
          product_details: "",
          transport_details: "",
          send_to: "Select",
          selected_product_to_send: "Select",
        });
        alert("Sent successfully");
      });
  };
  handle_product=()=>{
    fetch(`http://localhost:5000/find/${this.state.product_id_to_search}`,{
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "Access-Control-Allow-Origin": true,
        "Access-Control-Allow-Credentials": true,
    }
    }).then((res)=>res.json()).then((json)=>{
      console.log(typeof(json));
      console.log(json);
      this.setState({
        product_search_details: json,
        transaction1: json[0].data,
        transaction2:json[1].data,
        product_id_to_search:""
      });
      console.log(this.state.product_search_details[0]);
      console.log(this.state.product_search_details[1]);
    })
  }
  render() {
    if (this.state.user_type === "farmer") {
      return (
        <div>
          <h3>Hi {this.props.username}</h3>
          <form
            onSubmit={(e) => this.submitProduct(e)}
            style={{
              border: "2px solid brown",
              width: "300px",
              margin: " 20px auto",
              padding: "10px",
            }}
          >
            <h4>Upload Product</h4>
            <label htmlFor="product_name" style={{ display: "block" }}>
              Product Name
            </label>
            <input
              type="text"
              name="product_name"
              value={this.state.product_name}
              onChange={this.handle_change}
              style={{ height: "30px", margin: "20px" }}
            />
            <label htmlFor="product_quantity" style={{ display: "block" }}>
              Quantity
            </label>
            <input
              type="text"
              name="product_quantity"
              value={this.state.product_quantity}
              onChange={this.handle_change}
              style={{ height: "30px", margin: "20px" }}
            />
            <label htmlFor="product_details" style={{ display: "block" }}>
              Product Details
            </label>
            <input
              type="text"
              name="product_details"
              value={this.state.product_details}
              onChange={this.handle_change}
              style={{ height: "30px", margin: "20px" }}
            />
            <br />
            <label htmlFor="send_to"> Send To: </label>
            <br />
            <select
              name="send_to"
              id="send_to"
              value={this.state.send_to}
              onChange={this.handle_change}
              style={{ width: "200px", height: "30px", margin: "20px" }}
            >
              <option value="Select">Select</option>
              {this.state.actors_to_send_products.map((actor) => (
                <option key={actor}> {actor} </option>
              ))}
            </select>

            <input
              type="submit"
              style={{ display: "block", margin: "20px auto", height: "30px" }}
            />
          </form>
        </div>
      );
    } else if (this.state.user_type === "distributor") {
      return (
        <div>
          <h3>Hi {this.props.username}</h3>
          <form
            onSubmit={(e) => this.submitProduct(e)}
            style={{
              border: "2px solid brown",
              width: "300px",
              margin: " 20px auto",
              padding: "10px",
            }}
          >
            <label htmlFor="selected_product_to_send"> Select Product: </label>
            <br />
            <select
              name="selected_product_to_send"
              id="selected_product_to_send"
              onChange={this.handle_change}
              style={{ width: "200px", height: "30px", margin: "20px" }}
              value={this.state.selected_product_to_send}
            >
              <option value="Select">Select</option>
              {this.state.available_products.map((product) => (
                <option key={product.product_id} value={product.product_id}>
                  {" "}
                  {product.product_name} - {product.product_id.slice(0, 7)}{" "}
                </option>
              ))}
            </select>
            <br />
            <label htmlFor="send_to"> Send To: </label>
            <br />
            <select
              name="send_to"
              id="send_to"
              onChange={this.handle_change}
              value={this.state.send_to}
              style={{ width: "200px", height: "30px", margin: "20px" }}
            >
              <option value="Select">Select</option>
              {this.state.actors_to_send_products.map((actor) => (
                <option key={actor}> {actor} </option>
              ))}
            </select>

            <label htmlFor="transport_details" style={{ display: "block" }}>
              Transport Details
            </label>
            <input
              type="text"
              name="transport_details"
              value={this.state.transport_details}
              onChange={this.handle_change}
              style={{ height: "30px", margin: "20px" }}
            />

            <input
              type="submit"
              style={{ display: "block", margin: "20px auto", height: "30px" }}
            />
          </form>
        </div>
      );
    }else if(this.state.user_type==="customer"){
     return ( <div><div style={{position:"relative",margin:"30px auto"}}><label style={{display:"block",margin:"20px auto"}}>Enter Product Id :</label>
     <input type="text" onChange={this.handle_change}
      name="product_id_to_search"
      value={this.state.product_id_to_search} style={{display:"block" ,margin:"auto"}}></input>
      <button type="submit" onClick={this.handle_product} style={{margin: "20px auto"}}>Search</button>
      {Object.keys(this.state.transaction1).length?(<div>
        
      <h1>Product Name: {this.state.transaction1.product_name}</h1>
      <h3>Transaction 1</h3>
      <p>Product was sent by Farmer {this.state.transaction1.sent_by}</p>
      <p>Product was sent to Distributor {this.state.transaction1.sent_to}</p>
      <p>Product details: {this.state.transaction1.product_details}</p>
      <p>Quantity sent: {this.state.transaction1.product_quantity}</p>
      
      </div>):null}
      {Object.keys(this.state.transaction1).length?<div>
      <h3>Transaction 2</h3>
      <p>Product was sent by Distributor {this.state.transaction2.sent_by}</p>
      <p>Product was sent to Retailer {this.state.transaction2.sent_to}</p>
      <p>Transportation Details: {this.state.transaction2.transport_details}</p>
      </div>:null}</div>
       <div style={{margin: "10px 20px",textAlign:"right"}} >
         <h3 style={{marginRight:"60px"}}>Avilable products:</h3>
         {this.state.available_products.map((product) => (
                <p key={product.product_id} style={{marginRight:"5px"}}>{product.product_name} - {product.product_id}</p>
              ))}</div></div> );
    } else {
      return <div>Loading</div>;
    }
  }
}
export default Home;
