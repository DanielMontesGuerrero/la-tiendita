import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './home/Home.js';
import Login from './login/Login.js';
import User from './user/User.js';
import ProductShop from './product/ProductShop.js';
import MarketPlace from './store/MarketPlace.js';
import Cart from './cart/Cart.js';
import PageNotFound from './common/PageNotFound.js';
import Hemlet from 'react-helmet';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faUser, faStore, faStar} from '@fortawesome/free-solid-svg-icons';

library.add(faUser, faStore, faStar);

function App() {
  return (
    <div>
      <Hemlet>
        <style>{'body { background-color: #fafafa; }'}</style>
      </Hemlet>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/login" exact element={<Login/>}/>
          <Route path="/user" exact element={<User/>}/>
          <Route path="/products" exact element={<ProductShop/>}/>
          <Route path="/stores" exact element={<MarketPlace/>}/>
          <Route path="/cart" exact element={<Cart/>}/>
          <Route path="*" element={<PageNotFound/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
