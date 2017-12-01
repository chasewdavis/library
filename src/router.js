import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Login from './components/login/login.js';
import Browse from './components/browse/browse.js';


export default (
    <div>
    <Switch>
        <Route component={Login} exact path='/' />
        <Route component={Browse} path='/browse'/>
    </Switch>
    </div>
  )