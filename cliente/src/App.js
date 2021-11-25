import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './home/Home.js';
import Login from './login/Login.js';
import User from './user/User.js';
import PageNotFound from './common/PageNotFound.js';
import Hemlet from 'react-helmet';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faUser} from '@fortawesome/free-solid-svg-icons';

library.add(faUser);

function App() {
  return (
    <div>
      <Hemlet>
        <style>{'body { background-color: #fafafa; }'}</style>
      </Hemlet>
      <Router>
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/login' exact element={<Login />}/>
          <Route path='/user' exact element={<User />}/>
          <Route path='*' element={<PageNotFound/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
