import React,{Component} from 'react';
class Home extends Component{

    state = {
        product_name: '',
        product_quantity: '',
        product_details:''
      };
    
      handle_change = e => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState(prevstate => {
          const newState = { ...prevstate };
          newState[name] = value;
          return newState;
        });
      };
      submitProduct=(e)=>{
        e.preventDefault();
        console.log(444444444)
        const data={...this.state};
        fetch('http://localhost:8000/core/create_product/', {
            method: 'POST',
            headers: {
                Authorization: `JWT ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
          })
            .then(res => res.json())
            .then(json => {
              console.log(2222222222)
              console.log(json)
              this.setState({
                  product_name:'',
                  product_quantity:'',
                  product_details:''
              })
            });
            // axios.post('http://localhost:8000/core/create_product/',data, {
            //     headers: {
            //         'authorization':"${localStorage.getItem('token')}",
            //         'Accept' : 'application/json',
            //         'Content-Type': 'application/json'
            //     }
            // })
            // .then(response => {
            //     // return  response;
            //     console.log(response.json)
            // })
            // .catch((error) => {
            //     //return  error;
            // });
      }
      render() {
        return (
            <div>
                <h3>Hi {this.props.username}</h3>
                 <form onSubmit={e => this.submitProduct(e)} style={{border:"2px solid brown",width:"300px",margin: " 20px auto",padding:"10px"}}>
            <h4>Upload Product</h4>
            <label htmlFor="product_name" style={{display:"block"}}>Product Name</label>
            <input
              type="text"
              name="product_name"
              value={this.state.product_name}
              onChange={this.handle_change}
              style={{height:"30px",margin:"20px"}}
            />
            <label htmlFor="product_quantity" style={{display:"block"}}>Quantity</label>
            <input
              type="text"
              name="product_quantity"
              value={this.state.product_quantity}
              onChange={this.handle_change}
              style={{height:"30px" ,margin:"20px"}}
            />
            <label htmlFor="product_details" style={{display:"block"}}>Product Details</label>
            <input
              type="text"
              name="product_details"
              value={this.state.product_details}
              onChange={this.handle_change}
              style={{height:"30px" ,margin:"20px"}}
            />

            <input type="submit" style={{display:"block" ,margin:"auto",height:"30px"}} />
          </form>
            </div>
         
);
}
}
export default Home;