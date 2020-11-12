import React, { Component } from "react";
import Nav from "./components/Navigation/Nav";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import "./App.css";
import Home from "./components/Home/Home";
//import BlockchainForm from "./components/BlockchainForm/BlockchainForm";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayed_form: "login",
      logged_in: localStorage.getItem("token") ? true : false,
      username: "",
      //show_home: true
    };
  }

  componentDidMount() {
    console.log("component mounted")
    if (this.state.logged_in) {
      console.log("user logged in")
      fetch("http://localhost:8000/core/current_user/", {
        headers: {
          Authorization: `JWT ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => res.json())
        .then((json) => {
          this.setState({ username: json.username,displayed_form:"" });
        });
    }
  }

  handle_login = (e, data) => {
    e.preventDefault();
    fetch("http://localhost:8000/token-auth/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) =>  {
        if (res.status >=400 && res.status <600) {
          throw Error("Something went wrong");
      }
      else{
        return res.json();
      }
      })
      .then((json) => {
        localStorage.setItem("token", json.token);
        this.setState({
          logged_in: true,
          displayed_form: "",
          username: json.user.username,
        });
      }).catch((err)=>{
        alert("Username/password doesn't match or the user doesn't exist")
      });
  };

  handle_signup = (e, data) => {
    e.preventDefault();
    fetch("http://localhost:8000/core/users/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.status >=400 && res.status <600) {
            throw Error("Something went wrong");
        }
        else{
          return res.json();
        }
        
      })
      .then((json) => {
        localStorage.setItem("token", json.token);
        this.setState({
          logged_in: true,
          displayed_form: "",
          username: json.username,
        });
      })
      .catch((err) => {
        alert("A user with this details already exists");
      });
  };

  handle_logout = () => {
    localStorage.removeItem("token");
    this.setState({ logged_in: false, username: "",displayed_form:"login" });
  };

  display_form = (form) => {
    // if (form=="blockchain")
    //  {
    //   this.setState({
    //     displayed_form: form,
    //     show_home: false
    //   });
    //  }
    this.setState({
      displayed_form: form,
    });
  };
  // handle_home=()=>{
  //   this.setState({
  //      show_home:true,
  //      displayed_form: ""
  //   });
  // }
  render() {
    let form;
    switch (this.state.displayed_form) {
      case "login":
        form = <LoginForm handle_login={this.handle_login} />;
        break;
      case "signup":
        form = <SignupForm handle_signup={this.handle_signup} />;
        break;
      // case "blockchain":
      //   form=<BlockchainForm handle_blockchain={this.handle_home}></BlockchainForm>

      default:
        form = null;
    }

    return (
      <div className="App">
        <Nav
          logged_in={this.state.logged_in}
          display_form={this.display_form}
          handle_logout={this.handle_logout}
        />
      
        {form}
        <div>
          {this.state.logged_in ?(
            <Home username={this.state.username}></Home>
          ) : (
            ""
          )}
        </div>
       
        
      </div>
    );
  }
}

export default App;
