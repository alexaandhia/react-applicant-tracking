import React, {useState} from 'react';
import Form from './Form';
import Applicants from './Applicants';
import AddButton from './AddButton';
import Loader from './Loader';
import "./app.css";
function App() {


  return (
    <div className="App">
      <div className="ui fixed inverted menu">
          <div className="ui container">
            <a href="/#" className="header item">
              Applicant Tracking
            </a>
          </div> 
        </div>
        <div className="ui main container">
        <AddButton/>
        <Applicants/>
        </div>
      
    </div>
  );
}
export default App;