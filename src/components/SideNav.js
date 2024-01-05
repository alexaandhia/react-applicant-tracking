import React, { useState } from "react";
import FormAdd from "./FormAdd";
import "./app.css";
import { Link, NavLink } from "react-router-dom";

function SideNav() {
  return (
    <div className="SideNav">
      {/* Main Sidebar Container */}
      <aside className="main-sidebar sidebar-light-primary elevation-4">
        {/* Brand Logo */}
        <a href="" className="brand-link">
          <img
            src="dist/img/next.png"
            alt="Next Logo"
            className=""
            style={{ opacity: ".8", width: "100px" }}
          />
          <span className="brand-text font-weight-light"></span>
        </a>
        {/* Sidebar */}
        <div className="sidebar">
          {/* Sidebar user panel (optional) */}
          <div className="user-panel mt-3 pb-3 mb-3 d-flex">
            <div className="image">
              <img
                src="dist/img/chspfp.jpg"
                className="img-circle elevation-2"
                alt="User Image"
              />
            </div>
            <div className="info">
              <a href="#" className="d-block">
                Vernon Choi
              </a>
            </div>
          </div>
          {/* SidebarSearch Form */}
          <div className="form-inline">
            <div className="input-group" data-widget="sidebar-search">
              <input
                className="form-control form-control-sidebar"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <div className="input-group-append">
                <button className="btn btn-sidebar">
                  <i className="fas fa-search fa-fw" />
                </button>
              </div>
            </div>
          </div>
          {/* Sidebar Menu */}
          <nav className="mt-2">
            <ul
              className="nav nav-pills nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
              <div>
                <NavLink to="/" className="nav-link ">
                  <i className="nav-icon fas fa-tachometer-alt" />
                  <p>&nbsp;Dashboard</p>
                </NavLink>
                {/* <Routes> */}
                <li className="nav-item">
                  <NavLink to="/data" className="nav-link">
                    <i className="nav-icon fas fa-table" />
                    <p>&nbsp;Data</p>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/create" className="nav-link">
                    <i className="nav-icon fas fa-edit" />
                    <p>&nbsp;Create Data</p>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/skill" className="nav-link">
                    <i className="nav-icon fas fa-solid fa-plus" />
                    <p>&nbsp;New Skill</p>
                  </NavLink>
                </li>
                {/* </Routes> */}
              </div>

              <li className="nav-header">EXAMPLES</li>
              <li className="nav-item">
                <a href="pages/calendar.html" className="nav-link">
                  <i className="nav-icon far fa-calendar-alt" />
                  <p>
                    Calendar
                    <span className="badge badge-info right">2</span>
                  </p>
                </a>
              </li>
              <li className="nav-item">
                <a href="pages/gallery.html" className="nav-link">
                  <i className="nav-icon far fa-image" />
                  <p>Gallery</p>
                </a>
              </li>
              <li className="nav-item">
                <a href="pages/kanban.html" className="nav-link">
                  <i className="nav-icon fas fa-columns" />
                  <p>Kanban Board</p>
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link">
                  <i className="nav-icon far fa-envelope" />
                  <p>
                    Mailbox
                    <i className="fas fa-angle-left right" />
                  </p>
                </a>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <a href="pages/mailbox/mailbox.html" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>Inbox</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="pages/mailbox/compose.html" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>Compose</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="pages/mailbox/read-mail.html" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>Read</p>
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
          {/* /.sidebar-menu */}
        </div>
        {/* /.sidebar */}
      </aside>
    </div>
  );
}
export default SideNav;
