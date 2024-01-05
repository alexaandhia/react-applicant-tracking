import React, {useState} from 'react';
import "./app.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
function Footer() {

  return (
    <div className="Footer">
      <footer class="main-footer">
    <strong>Copyright &copy; 2014-2021 <a href="https://adminlte.io">AdminLTE.io</a>.</strong>
    All rights reserved.
    <div class="float-right d-none d-sm-inline-block">
      <b>Version</b> 3.2.0
    </div>
  </footer>
    </div>
  );
}
export default Footer;