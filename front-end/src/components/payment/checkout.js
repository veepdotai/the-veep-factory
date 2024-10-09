import { useState, useEffect } from "react";
//import "./App.css";
import { useCookies } from "react-cookie";
import { Logger } from 'react-logger-lib';

import { Constants } from "src/constants/Constants";

export default function Checkout() {
  const log = Logger.of(Checkout.name);

  const [message, setMessage] = useState(false);
  const [cookies, setCookie] = useCookies(['JWT']);

  function ProductDisplay () {
    return (
      <section>
        <div className="product">
          <img
            src="https://i.imgur.com/EHyR2nP.png"
            alt="The cover of Stubborn Attachments"
            />
          <div className="description">
          <h3>Stubborn Attachments</h3>
          <h5>$20.00</h5>
          </div>
        </div>
        <button type="submit" onClick={checkout}>
          Checkout
        </button>
      </section>
    )
  };
  
  function Message({ message }) {
    return (
      <section>
        <p>{message}</p>
      </section>
    )
  };

  function checkout() {
    fetch(Constants.WORDPRESS_REST_URL + "/wp-json/veepdotai_rest/v1/payment/" + '?JWT=' + cookies.JWT,
      {
            'method': 'POST',
            'token': cookies.JWT,
            'mode': 'no-cors', // no-cors, *cors, same-origin
            'credentials': 'include',
            'Content-Type': 'application/json'
      })
    .then((res) => {        
    })
    .catch((e) => {
    });
  }
    
  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      setMessage("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready."
      );
    }
  }, []);

  return (
      message ?
      <>
        <Message message={message} />
      </>
      :
      <>Ici
        <ProductDisplay />
      </>
  )
}