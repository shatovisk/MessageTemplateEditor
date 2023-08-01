import React from 'react';
import { MessageEditor } from './components/MessageEditor';
import {Route, Routes} from 'react-router-dom'
import { MainPage } from './components/MainPage';

function App() {

  return (
    <Routes>
      <Route path='/' element={ <MessageEditor/>} />
      <Route path='/template' element= { <MainPage/>} />
    </Routes>
  );
}

export default App;
