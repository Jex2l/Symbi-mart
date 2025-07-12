import React from 'react'
import Card from '../components/Card'
import "../css/Cart.css"
import {Link, useNavigate} from "react-router-dom";

const Cart = (props) => {
    // const deleteI = () => {
    //     props.cartItems = [];
    // }
    const navigation = useNavigate();
    const Logout = () => {
        localStorage.removeItem("token");
        navigation("/login");
    }
    console.log(typeof props.cartItems)
    return (
        <>
            <nav className="nav" style={{backgroundColor: "black", padding: "0px 0px"}}>
                <div className="nav__center container">
                    <div className="nav__logo">
                        <Link to="/"><h1>SymbiMart<span>Cart</span></h1></Link>
                    </div>

                    <ul className="nav__list">
                        <button  className="login" onClick={() => props.setCartItems(null)}>Empty cart</button>
                        <button  className="login">Checkout</button>
                        <button onClick={Logout}  className="login">Logout</button>
                    </ul>
                </div>
            </nav>
            <div className='cart-items' style={{marginTop: "200px", display: "flex", flexDirection: "row", flexWrap: "wrap"}}>
                <Card items={props.cartItems} />
            </div>
        </>
    )
}

export default Cart;