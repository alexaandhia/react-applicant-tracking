import React, { useState, useEffect, useLayoutEffect } from "react";
import axios from "axios";
import { Dropdown } from 'semantic-ui-react';
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import {  InputGroup } from "react-bootstrap";
import "bs-stepper/dist/css/bs-stepper.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import FormWizard from "react-form-wizard-component";
import "react-form-wizard-component/dist/style.css";
import Stepper from "bs-stepper";
import "./app.css";

function FormAdd({ isEditMode, selectedApplicant, selectedSkills, onSubmit }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [skills, setSkills] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    resume: "",
    description: "",
    title: "",
    department: "",
    employer: "",
    experience: "",
    position: "",
    applied: "",
    interview: "",
    interviewer: "",
    score: "",
    status: "",
    notes: "",
    skill: "",
  });

  useEffect(() => {
    const apiUrl = "http://127.0.0.1:8888/api/skill";

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setSkills(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    // Initialize bs-stepper
  }, []);

  const handleComplete = () => {
    console.log("Form completed!");
    // Handle form completion logic here
  };

  const tabChanged = ({ prevIndex, nextIndex }) => {
    console.log("prevIndex", prevIndex);
    console.log("nextIndex", nextIndex);
  };

  const changeHandler = (event, data) => {
    const { name, value, files } = event.target;
  
    if (name === "resume") {
      setSelectedFile(files[0]);
      setIsFilePicked(true);
    } else if (name === "department") {
      setFormData({ ...formData, [name]: value });
    } else if (name === "skill[]") {
      // Use data.value to get the selected values from Dropdown
      setFormData({
        ...formData,
        skill: Array.isArray(data.value) ? data.value.map((val) => parseInt(val)) : [], // Ensure skill is an array
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  
   

  const skillOptions = skills.map((skill) => ({
    key: skill.id,
    text: skill.skill,
    value: skill.id,
  }));

  // const handleSubmission = async (event) => {
  //   if (event) {
  //     event.preventDefault();
  //   }
  
  //   const ApplicantData = new FormData();
  //   ApplicantData.append("resume", selectedFile);
  
  //   // Append other form data
  //   Object.entries(formData).forEach(([key, value]) => {
  //     if (key === "skill") {
  //       // Check if value is an array before iterating
  //       if (Array.isArray(value)) {
  //         value.forEach((skillId) => {
  //           ApplicantData.append("skill[]", skillId);
  //         });
  //       } else {
  //         // If it's not an array, assume it's a single skill ID
  //         ApplicantData.append("skill[]", value);
  //       }
  //     } else {
  //       ApplicantData.append(key, value);
  //     }
  //   });
  
  //   const url = "http://127.0.0.1:8888/api/add";
  
  //   try {
  //     const response = await axios.post(url, ApplicantData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });
  
  //     console.log("Response Data:", response.data);
  
  //     if (response.data.error) {
  //       alert("Add Failed!");
  //     } else {
  //       alert("Add Succeed");
  //       window.location.reload();
  //     }
  //   } catch (error) {
  //     if (error.response && error.response.status === 429) {
  //       await new Promise((resolve) => setTimeout(resolve, 5000));
  //       handleSubmission(event);
  //     } else {
  //       console.error("Error:", error);
  //       alert("Add Failed!");
  //     }
  //   }
  // };
  
  const handleSubmission = async (event) => {
    if (event) {
      event.preventDefault();
    }
  
    const ApplicantData = new FormData();
    ApplicantData.append("resume", selectedFile);
  
    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          // Check if the server expects a different key for skills
          ApplicantData.append("skill[]", item);
        });
      } else {
        ApplicantData.append(key, value);
      }
    });
  
    const url = "http://127.0.0.1:8888/api/add";
  
    try {
      const response = await axios.post(url, ApplicantData);
  
      console.log("Response Data:", response.data);
  
      if (response.data.error) {
        alert("Add Failed!");
      } else {
        alert("Add Succeed");
        window.location.reload();
      }
    } catch (error) {
      if (error.response && error.response.status === 429) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        handleSubmission(event);
      } else {
        console.error("Error:", error);
        alert("Add Failed!");
      }
    }
  };
  
  
  

  

  return (
    <div className="content-wrapper p-3">
      <FormWizard
        shape="circle"
        color="#543478"
        onComplete={handleSubmission}
        onTabChange={tabChanged}
      >
        <FormWizard.TabContent title="Applicant details" icon="ti-user" encType="multipart/form-data">
          {/* Add your form inputs and components for the frst step */}
          <label for="name" className="form-label">
            Name
          </label>
          <div className="row g-3 mb-2">
            <div className="col-md-6">
              <input type="text" id="name" className="form-control" name="first_name" onChange={changeHandler} 
              placeholder="First Name"
                aria-label="First name"
              />
            </div>
            <div className="col-md-6">
            <input type="text" id="name" className="form-control" name="last_name" onChange={changeHandler} 
            placeholder="Last Name"
            aria-label="Last name"
              />
            </div>
          </div>
          <div className="row g-3 mb-2">
            <div className="col-md-6">
              <label for="email">Email</label>
              <input type="email" id="email" className="form-control" name="email" onChange={changeHandler} 
              placeholder="example@gmail.com"
                aria-label="email"
              />
            </div>
            <div className="col-md-6">
              <label for="phone">Phone</label>
              <input type="tel" id="phone" className="form-control" name="phone" onChange={changeHandler} 
              placeholder="ex: 088972835546"
                aria-label="phone"
              />
            </div>
          </div>
          <div className="row g-2 mb-2">
          <div className="col-12">
              <label for="resume">Resume (PDF)</label>
              <input type="file" id="resume" className="form-control" name="resume" onChange={changeHandler} 
                aria-label="resume" accept=".pdf"
              />
            </div>
          </div>
        </FormWizard.TabContent>
        <FormWizard.TabContent title="Job details" icon="ti-settings">
        <div className="row g-3 mb-2">
            <div className="col-md-6">
              <label for="title">Position Title</label>
              <input type="text" id="title" className="form-control" name="title" onChange={changeHandler} 
              placeholder="Position Title"
                aria-label="title"
              />
            </div>
            <div className="col-md-6">
              <label for="desc">Description</label>
              <input type="text" id="desc" className="form-control" name="description" onChange={changeHandler} 
              placeholder="Description"
                aria-label="desc"
              />
            </div>
          </div>
          <div className="row g-3 mb-2">
            <div className="col-md-6">
              <label for="dept">Department</label>
              <select id="dept" className="form-control" name="department" onChange={changeHandler} aria-label="dept">
              <option value="" selected disabled>
                Select Department
              </option>
              <option value="backend">Backend</option>
              <option value="frontend">Frontend</option>
              <option value="fullstack">Full Stack</option>
              <option value="mobile">Mobile</option>
            </select>
            </div>
            <div className="col-md-6">
              <label>Skill</label>
             <Dropdown
              name="skill[]" 
              selection
              multiple
              id="skill" className="form-control" aria-label="skill"
              options={skillOptions}
              onChange={changeHandler}
              placeholder="Skills"
              value={formData.skill_id} 
            /> 
           
            </div>
          </div>
          <div className="row g-3 mb-2">
            <div className="col-md-4">
              <label for="experience">Experience Required</label>
              <input type="text" id="experience" className="form-control" name="experience" onChange={changeHandler} 
              placeholder="Experience Required"
                aria-label="experience"
              />
            </div>
            <div className="col-md-4">
              <label for="employer">Current Employer</label>
              <input type="text" id="employer" className="form-control" name="employer" onChange={changeHandler} 
              placeholder="Current Employer"
                aria-label="employer"
              />
            </div>
            <div className="col-md-4">
              <label for="position">Current Position</label>
              <input type="text" id="position" className="form-control" name="position" onChange={changeHandler} 
              placeholder="position"
                aria-label="position"
              />
            </div>
          </div>
        </FormWizard.TabContent>
        <FormWizard.TabContent title="Interview details" icon="ti-check">
        <div className="row g-3 mb-2">
            <div className="col-md-6">
              <label for="applied">Date of Applied</label>
              <input type="date" id="applied" className="form-control" name="applied" onChange={changeHandler} 
              placeholder="Date of Applied"
                aria-label="applied"
              />
            </div>
            <div className="col-md-6">
              <label for="interview">Date of Interview</label>
              <input type="date" id="interview" className="form-control" name="interview" onChange={changeHandler} 
              placeholder="Date of Interview"
                aria-label="interview"
              />
            </div>
          </div>
          <div className="row g-3 mb-2">
            <div className="col-md-6">
              <label for="interviewer">Interviewed By</label>
              <input type="text" id="interviewer" className="form-control" name="interviewer" onChange={changeHandler} 
              placeholder="Position interviewer"
                aria-label="interviewed by"
              />
            </div>
            <div className="col-md-6">
              <label for="score">Interview Score</label>
              <input type="text" id="score" className="form-control" name="score" onChange={changeHandler} 
              placeholder="score"
                aria-label="score"
              />
            </div>
          </div>

          <div className="row g-3 mb-2">
            <div className="col-md-6">
              <label for="status">Status</label>
              <input type="text" id="status" className="form-control" name="status" onChange={changeHandler} 
              placeholder="status"
                aria-label="status"
              />
            </div>
            <div className="col-md-6">
              <label for="notes">Notes</label>
              <input type="text" id="notes" className="form-control" name="notes" onChange={changeHandler} 
              placeholder="notes"
                aria-label="notes"
              />
            </div>
          </div>
        </FormWizard.TabContent>
      </FormWizard>

      {/* add style */}
      <style>{`
        @import url("https://cdn.jsdelivr.net/gh/lykmapipo/themify-icons@0.1.2/css/themify-icons.css");
      `}</style>
    </div>
  );
}

export default FormAdd;
