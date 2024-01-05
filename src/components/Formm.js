import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dropdown, Step, Button, Icon } from "semantic-ui-react";
import { event } from "jquery";
import "bs-stepper/dist/css/bs-stepper.min.css";
import Stepper from "bs-stepper";
import "./app.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

function Form({ isEditMode, selectedApplicant, selectedSkills, onSubmit }) {
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
    const stepper = new Stepper(document.querySelector(".bs-stepper"));
  }, []);

  const changeHandler = (event) => {
    if (event.target.tagName === "INPUT") {
      const { name, value, files } = event.target;
      if (name === "resume") {
        setSelectedFile(files[0]);
        setIsFilePicked(true);
      } else if (name === "department") {
        setFormData({ ...formData, [name]: value });
      } else {
        setFormData({ ...formData, [name]: value });
      }
    } else if (event.target.tagName === "SELECT") {
      if (event.target.name === "skill") {
        setFormData({
          ...formData,
          skill: [...event.target.selectedOptions].map(
            (option) => option.value
          ),
        });
      } else if (event.target.name === "department") {
        setFormData({ ...formData, department: event.target.value });
      }
    }
  };

  const handleNext = () => {
    // Check if we are on the first step (Applicant Identity)
    if (activeStep === 0) {
      // Define the required fields for the first step
      const requiredFields = ["first_name", "last_name", "email", "phone", "resume"];
  
      // Check if all required fields are filled
      const isFormValid = requiredFields.every((field) => !!formData[field]);
  
      // If all required fields are filled, navigate to the next step
      if (!isFormValid) {
        // Display an error message or take appropriate action
        alert("Please fill in all required fields.");
        return; // Stop execution if the form is not valid
      }
    }
  
    // Navigate to the next step
    setActiveStep(activeStep + 1);
  };
  

  const handlePrev = () => {
    // Navigate to the previous step
    setActiveStep(activeStep - 1);
  };

  const skillOptions = skills.map((skill) => ({
    key: skill.id,
    text: skill.skill,
    value: skill.id,
  }));

  const handleSubmission = async (event) => {
    event.preventDefault();

    const ApplicantData = new FormData();
    ApplicantData.append("resume", selectedFile);

    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          ApplicantData.append(key, item);
        });
      } else {
        ApplicantData.append(key, value);
      }
    });

    const url = "http://127.0.0.1:8888/api/add";

    try {
      const response = await axios({
        method: "POST",
        url: url,
        data: ApplicantData,
        headers: { "Content-Type": "multipart/form-data" },
      });

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
      <form className="ui form scrolling content" encType="multipart/form-data">
        {/* bs-stepper */}
        <div className="bs-stepper">
          <div className="bs-stepper-header" role="tablist">
            <div className="step" data-target="#applicant-identity">
              <button
                type="button"
                className="step-trigger"
                role="tab"
                aria-controls="applicant-identity"
              >
                <span className="bs-stepper-circle">1</span>
                <span className="bs-stepper-label">Applicant Identity</span>
              </button>
            </div>
            <div className="line" />
            <div className="step" data-target="#job-details">
              <button
                type="button"
                className="step-trigger"
                role="tab"
                aria-controls="job-details"
              >
                <span className="bs-stepper-circle">2</span>
                <span className="bs-stepper-label">Job Details</span>
              </button>
            </div>
            <div className="line" />
            <div className="step" data-target="#interview-details">
              <button
                type="button"
                className="step-trigger"
                role="tab"
                aria-controls="interview-details"
              >
                <span className="bs-stepper-circle">3</span>
                <span className="bs-stepper-label">Interview Details</span>
              </button>
            </div>
          </div>
          <div className="bs-stepper-content">
            <div id="applicant-identity" className="content" role="tabpanel">
              <div className="field">
                <label>Name</label>
                <div className="two fields">
                  <div className="field">
                    <input
                      type="text"
                      name="first_name"
                      onChange={changeHandler}
                      placeholder="First Name"
                      required
                    />
                  </div>
                  <div className="field">
                    <input
                      type="text"
                      name="last_name"
                      onChange={changeHandler}
                      placeholder="Last Name"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="two fields">
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              onChange={changeHandler}
              placeholder="example@gmail.com"
              required
            />
          </div>
          <div className="field">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              onChange={changeHandler}
              placeholder="ex: 088783625321"
              required
            />
          </div>
        </div>

        <div className="field">
          <label>Resume (PDF)</label>
          <input
            type="file"
            name="resume"
            accept=".pdf"
            onChange={changeHandler}
            placeholder="PDF File"
            required
          />
        </div>
              <button
                className="ui primary button submit-button"
                onClick={handleNext}
              >
                Next
              </button>
            </div>
            <div id="job-details" className="content" role="tabpanel">
            <div className="two fields">
          <div className="field">
            <label>Department</label>
            <select
              className="ui search dropdown"
              name="department"
              onChange={changeHandler}
            >
              <option value="" selected disabled>
                Select Department
              </option>
              <option value="backend">Backend</option>
              <option value="frontend">Frontend</option>
              <option value="fullstack">Full Stack</option>
              <option value="mobile">Mobile</option>
            </select>
          </div>

          <div className="field">
            <label>Skill</label>
            <Dropdown
              name="skill" // Tambahkan properti name
              selection
              multiple
              options={skillOptions}
              onChange={changeHandler}
              placeholder="Skills"
              value={formData.skill_id} // Gunakan formData.skill sebagai nilai
            />
          </div>
        </div>

        <div className="three fields">
          <div className="field">
            <label>Experience Required</label>
            <input
              type="text"
              name="experience"
              placeholder=""
              onChange={changeHandler}
            />
          </div>
          <div className="field">
            <label>Current Employer</label>
            <input
              type="text"
              name="employer"
              placeholder=""
              onChange={changeHandler}
            />
          </div>
          <div className="field">
            <label>Current position</label>
            <input
              type="text"
              name="position"
              placeholder=""
              onChange={changeHandler}
            />
          </div>
        </div>
              <button
                className="ui primary button submit-button"
                onClick={handlePrev}
              >
                Previous
              </button>
              <button
                className="ui primary button submit-button"
                onClick={handleNext}
              >
                Next
              </button>
            </div>
            <div id="interview-details" className="content" role="tabpanel">
            <div className="two fields">
          <div className="field">
            <label>Date of Applied</label>
            <input type="date" name="applied" onChange={changeHandler} />
          </div>
          <div className="field">
            <label>Date of Interview</label>
            <input type="date" name="interview" onChange={changeHandler} />
          </div>
        </div>
        <div className="two fields">
          <div className="field">
            <label>Interviewed By</label>
            <input
              type="text"
              name="interviewer"
              placeholder=""
              onChange={changeHandler}
            />
          </div>
          <div className="field">
            <label>Interview Score</label>
            <input
              type="text"
              name="score"
              placeholder=""
              onChange={changeHandler}
            />
          </div>
        </div>
        <div className="two fields">
          <div className="field">
            <label>Status</label>
            <input
              type="text"
              name="status"
              onChange={changeHandler}
              placeholder=""
            />
          </div>
          <div className="field">
            <label>Notes</label>
            <input
              type="text"
              name="notes"
              onChange={changeHandler}
              placeholder=""
            />
          </div>
        </div>
              <button
                className="ui primary button submit-button"
                onClick={handlePrev}
              >
                Previous
              </button>
              <button
                className="ui primary button submit-button"
                onClick={handleSubmission}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* <form className="ui form scrolling content" encType="multipart/form-data">
        <h4 className="ui dividing header">Applicant Identity</h4>
        <div className="field">
          <label>Name</label>
          <div className="two fields">
            <div className="field">
              <input
                type="text"
                name="first_name"
                onChange={changeHandler}
                placeholder="First Name"
                required
              />
            </div>
            <div className="field">
              <input
                type="text"
                name="last_name"
                onChange={changeHandler}
                placeholder="Last Name"
                required
              />
            </div>
          </div>
        </div>

        <div className="two fields">
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              onChange={changeHandler}
              placeholder="example@gmail.com"
              required
            />
          </div>
          <div className="field">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              onChange={changeHandler}
              placeholder="ex: 088783625321"
              required
            />
          </div>
        </div>

        <div className="field">
          <label>Resume (PDF)</label>
          <input
            type="file"
            name="resume"
            accept=".pdf"
            onChange={changeHandler}
            placeholder="PDF File"
            required
          />
        </div>

        <h4 className="ui dividing header">Job Details</h4>
        
        <div className="two fields">
          <div className="field">
            <label>Department</label>
            <select
              className="ui search dropdown"
              name="department"
              onChange={changeHandler}
            >
              <option value="" selected disabled>
                Select Department
              </option>
              <option value="backend">Backend</option>
              <option value="frontend">Frontend</option>
              <option value="fullstack">Full Stack</option>
              <option value="mobile">Mobile</option>
            </select>
          </div>

          <div className="field">
            <label>Skill</label>
            <Dropdown
              name="skill" // Tambahkan properti name
              selection
              multiple
              options={skillOptions}
              onChange={changeHandler}
              placeholder="Skills"
              value={formData.skill_id} // Gunakan formData.skill sebagai nilai
            />
          </div>
        </div>

        <div className="three fields">
          <div className="field">
            <label>Experience Required</label>
            <input
              type="text"
              name="experience"
              placeholder=""
              onChange={changeHandler}
            />
          </div>
          <div className="field">
            <label>Current Employer</label>
            <input
              type="text"
              name="employer"
              placeholder=""
              onChange={changeHandler}
            />
          </div>
          <div className="field">
            <label>Current position</label>
            <input
              type="text"
              name="position"
              placeholder=""
              onChange={changeHandler}
            />
          </div>
        </div>
        

        <h4 className="ui dividing header">Interview Details</h4>
        <div className="two fields">
          <div className="field">
            <label>Date of Applied</label>
            <input type="date" name="applied" onChange={changeHandler} />
          </div>
          <div className="field">
            <label>Date of Interview</label>
            <input type="date" name="interview" onChange={changeHandler} />
          </div>
        </div>
        <div className="two fields">
          <div className="field">
            <label>Interviewed By</label>
            <input
              type="text"
              name="interviewer"
              placeholder=""
              onChange={changeHandler}
            />
          </div>
          <div className="field">
            <label>Interview Score</label>
            <input
              type="text"
              name="score"
              placeholder=""
              onChange={changeHandler}
            />
          </div>
        </div>
        <div className="two fields">
          <div className="field">
            <label>Status</label>
            <input
              type="text"
              name="status"
              onChange={changeHandler}
              placeholder=""
            />
          </div>
          <div className="field">
            <label>Notes</label>
            <input
              type="text"
              name="notes"
              onChange={changeHandler}
              placeholder=""
            />
          </div>
        </div>

        <div className="four wide field">
          <button
            className="ui primary button submit-button"
            onClick={handleSubmission}
          >
            {isEditMode ? "Edit" : "Submit"}
          </button>{" "}
        </div>
      </form> */}

      {/* old script from modal applicant.js */}
      {/* <Modal open={isEditFormOpen} onClose={closeEditForm}>
        <Modal.Header>
          Edit data
          <div onClick={closeEditForm} style={{ float: "right" }}>
            <i className=" close icon"></i>
          </div>
        </Modal.Header>
        {selectedApplicant && (
          <Modal.Content>
            <form
              className="ui form scrolling content"
              encType="multipart/form-data"
              method="PATCH"
              onSubmit={handleUpdate}
            >
              <h4 className="ui dividing header">Applicant Identity</h4>
              <div className="field">
                <label>Name</label>
                <div className="two fields">
                  <div className="field">
                    <input
                      type="text"
                      name="first_name"
                      onChange={handleEditChange}
                      placeholder="First Name"
                      defaultValue={applicant.first_name}
                    />
                  </div>
                  <div className="field">
                    <input
                      type="text"
                      name="last_name"
                      onChange={handleEditChange}
                      placeholder="Last Name"
                      value={applicant.last_name}
                    />
                  </div>
                </div>
              </div>

              <div className="two fields">
                <div className="field">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    onChange={handleEditChange}
                    placeholder="example@gmail.com"
                    value={formData.email}
                  />
                </div>
                <div className="field">
                  <label>Phone</label>
                  <input
                    type="text"
                    name="phone"
                    onChange={handleEditChange}
                    placeholder="ex: 088783625321"
                    value={formData.phone}
                  />
                </div>
              </div>

              <div className="field">
                <label>Resume (PDF)</label>
                <input
                  type="file"
                  name="resume"
                  accept=".pdf"
                  onChange={handleEditChange}
                  placeholder="PDF File"
                />
              </div>

              <h4 className="ui dividing header">Job Details</h4>
              <div className="two fields">
                <div className="field">
                  <label>Position Title</label>
                  <input
                    type="text"
                    name="title"
                    onChange={handleEditChange}
                    placeholder="Position Title"
                    value={formData.title}
                  />
                </div>
                <div className="field">
                  <label>Description</label>
                  <input
                    type="text"
                    name="description"
                    onChange={handleEditChange}
                    placeholder="Description"
                    value={formData.description}
                  />
                </div>
              </div>

              <div className="two fields">
                <div className="field">
                  <label>Department</label>
                  <select
                    className="ui search dropdown"
                    name="department"
                    onChange={handleEditChange}
                    defaultValue={formData.department}
                  >
                    <option value="" selected disabled>
                      Select Department
                    </option>
                    <option value="backend">Backend</option>
                    <option value="frontend">Frontend</option>
                    <option value="fullstack">Full Stack</option>
                    <option value="mobile">Mobile</option>
                  </select>
                </div>

                <div className="field">
                  <label>Skill</label>
                  <Dropdown
                    name="skill[]"
                    selection
                    multiple
                    options={skillOptions}
                    onChange={handleEditChange}
                    placeholder="Skills"
                    defaultValue={formData.skill}
                  />
                </div>
              </div>

              <div className="three fields">
                <div className="field">
                  <label>Experience Required</label>
                  <input
                    type="text"
                    name="experience"
                    placeholder=""
                    onChange={handleEditChange}
                    value={formData.experience}
                  />
                </div>
                <div className="field">
                  <label>Current Employer</label>
                  <input
                    type="text"
                    name="employer"
                    placeholder=""
                    onChange={handleEditChange}
                    value={formData.employer}
                  />
                </div>
                <div className="field">
                  <label>Current position</label>
                  <input
                    type="text"
                    name="position"
                    placeholder=""
                    onChange={handleEditChange}
                    value={formData.position}
                  />
                </div>
              </div>

              <h4 className="ui dividing header">Interview Details</h4>
              <div className="two fields">
                <div className="field">
                  <label>Date of Applied</label>
                  <input
                    type="date"
                    name="applied"
                    onChange={handleEditChange}
                    value={formData.applied}
                  />
                </div>
                <div className="field">
                  <label>Date of Interview</label>
                  <input
                    type="date"
                    name="interview"
                    onChange={handleEditChange}
                    value={formData.interview}
                  />
                </div>
              </div>
              <div className="two fields">
                <div className="field">
                  <label>Interviewed By</label>
                  <input
                    type="text"
                    name="interviewer"
                    placeholder=""
                    onChange={handleEditChange}
                    value={formData.interviewer}
                  />
                </div>
                <div className="field">
                  <label>Interview Score</label>
                  <input
                    type="text"
                    name="score"
                    placeholder=""
                    onChange={handleEditChange}
                    value={formData.score}
                  />
                </div>
              </div>
              <div className="two fields">
                <div className="field">
                  <label>Status</label>
                  <input
                    type="text"
                    name="status"
                    onChange={handleEditChange}
                    placeholder=""
                    value={formData.status}
                  />
                </div>
                <div className="field">
                  <label>Notes</label>
                  <input
                    type="text"
                    name="notes"
                    onChange={handleEditChange}
                    placeholder=""
                    value={formData.notes}
                  />
                </div>
              </div>

              <div className="four wide field">
                <button className="ui primary button submit-button">
                  Edit
                </button>
              </div>
            </form>
          </Modal.Content>
        )}
      </Modal> */}
      
    </div>
  );
}

export default Form;
