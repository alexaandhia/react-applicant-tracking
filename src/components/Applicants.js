import React, { useState, useEffect } from "react";
import FormAdd from "./FormAdd";
import Loader from "./Loader";
import { Modal, Dropdown } from "semantic-ui-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ReactPaginate from "react-paginate";
import axios from "axios";

function Applicants() {
  const [applicants, setApplicants] = useState([]);
  const [editingApplicant, setEditingApplicant] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [selectedApplicantId, setSelectedApplicantId] = useState(null);
  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [data, setData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
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
    skill: [],
  });

  const itemsPerPage = 5;
  const pageCount = Math.ceil(applicants.length / itemsPerPage);

  const displayedApplicants = searchResults.slice(
    pageNumber * itemsPerPage,
    (pageNumber + 1) * itemsPerPage
  );

   const BASE_URL = "http://127.0.0.1:8888/api";

  // const handleSearch = async (event) => {
  //   event.preventDefault();

  //   const response = await fetch(
  //     `${BASE_URL}/applicants?${query}&department=${selectedDepartment}`
  //   );
  //   const searchData = await response.json();

  //   setApplicants(searchData.results); // Update the applicants state

  //   // Optionally, you can update the data state if needed
  //   setData(searchData.results);
  // };

  const handleSearchChange = (event) => {
    setQuery(event.target.value);
  };
  
  const handleSearch = async (event) => {
    event.preventDefault();
  
    try {
      const response = await fetch(`http://127.0.0.1:8888/api/search?department=${query}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Data from API:', data); // Tambahkan baris ini untuk melihat data dari API
  
      // Tambahkan property 'id' pada hasil pencarian
      const resultsWithId = data.results.map((result, index) => ({
        ...result,
        id: index + 1,
      }));
  
      setResults(resultsWithId);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/applicants`);
        console.log('Data from /applicants:', response.data); // Tambahkan baris ini
        setApplicants(response.data);
        setSearchResults(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, []);
  


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
  }, []);

  const skillOptions = skills.map((skill) => ({
    key: skill.id,
    text: skill.skill,
    value: skill.id,
  }));

  const handleDepartmentChange = (_, data) => {
    setSelectedDepartment(data.value);
  };

  const handlePageChange = ({ selected }) => {
    setPageNumber(selected);
  };

  const handleDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };
  const handleDocumentLoadError = (error) => {
    console.error("Error loading PDF:", error);
  };

  const openModal = (applicant) => {
    setSelectedApplicant(applicant);
    setSelectedApplicantId(applicant.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedApplicant(null);
    setIsModalOpen(false);
  };

  const openEditForm = (applicant) => {
    setSelectedApplicant(applicant);
    setSelectedApplicantId(applicant.id);
    setFormData({
      first_name: applicant.first_name || "",
      last_name: applicant.last_name || "",
      email: applicant.email || "",
      phone: applicant.phone || "",
      resume: applicant.resume || "",
      description: applicant.description || "",
      title: applicant.title || "",
      department: applicant.department || "",
      employer: applicant.employer || "",
      experience: applicant.experience || "",
      position: applicant.position || "",
      applied: applicant.applied || "",
      interview: applicant.interview || "",
      interviewer: applicant.interviewer || "",
      score: applicant.score || "",
      status: applicant.status || "",
      notes: applicant.notes || "",
      skill: applicant.skill || [],
    });
    setIsEditFormOpen(true);
  };

  const closeEditForm = () => {
    setSelectedApplicant(null);
    setIsEditFormOpen(false);
  };

  const handleEditChange = (event) => {
    console.log("Event:", event);
  console.log("Current formData:", formData);
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

  // const handleUpdate = async () => {
  //     const ApplicantData = new FormData();
  //     ApplicantData.append('resume', selectedFile);

  //     Object.entries(formData).forEach(([key, value]) => {
  //         if (Array.isArray(value)) {
  //             value.forEach((item) => {
  //                 ApplicantData.append(key, item);
  //             });
  //         } else {
  //             ApplicantData.append(key, value);
  //         }
  //     });

  //     const url = `http://127.0.0.1:8888/api/update/${selectedApplicantId}`;

  //     try {
  //         const response = await axios({
  //             method: 'PATCH',
  //             url: url,
  //             data: ApplicantData,
  //             headers: { 'Content-Type': 'multipart/form-data', 'Access-Control-Allow-Origin': '*' },
  //         });

  //         console.log('Response Data:', response.data);

  //         if (response.data.error) {
  //             alert('Update Failed!');
  //         } else {
  //             alert('Update Succeed');
  //         }
  //     } catch (error) {
  //         console.error('Error:', error);
  //     }
  // };

  const handleUpdate = async (event) => {
    event.preventDefault();

    const ApplicantData = new FormData();

    for (const [key, value] of Object.entries(formData)) {
      if (key === "resume" && selectedFile) {
        ApplicantData.append(key, selectedFile);
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          ApplicantData.append(`${key}[${index}]`, item);
        });
      } else {
        ApplicantData.append(key, value);
      }
    }

    const url = `http://127.0.0.1:8888/api/update/${selectedApplicantId}`;

    try {
      const response = await axios({
        method: "PATCH",
        url: url,
        data: ApplicantData,
        headers: { "Content-Type": "application/json" },
      });

      console.log("Response Data:", response.data);

      if (response.status === 200) {
        alert("Edit Succeed");
        window.location.reload();
        // Update state or perform other necessary UI updates here
      } else {
        console.error("Unexpected response status:", response.status);
        alert("Edit Failed: Unexpected response status");
      }
    } catch (error) {
      console.error("Error:", error);

      if (error.response) {
        console.error("Response Data:", error.response.data);
        console.error("Response Status:", error.response.status);
        console.error("Response Headers:", error.response.headers);
        alert("Edit Failed: Server responded with an error");
      } else if (error.request) {
        console.error("No response received from the server");
        alert("Edit Failed: No response received from the server");
      } else {
        console.error("Error setting up the request:", error.message);
        alert("Edit Failed: Error setting up the request");
      }
    }
  };

  // const handleDelete = async () => {
  //   if (selectedApplicantId) {
  //     try {
  //       const response = await axios.delete(
  //         `http://127.0.0.1:8888/api/delete/${selectedApplicantId}`
  //       );
  //       alert("Deleted Succeed!");
  //       window.location.reload();
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  // };

  const handleDelete = async () => {
    if (selectedApplicantId) {
      try {
        const response = await axios.delete(
          `http://127.0.0.1:8888/api/delete/${selectedApplicantId}`
        );
        alert("Deleted Succeed!");
        window.location.reload();
      } catch (error) {
        console.error(error);
        alert("Delete Failed: An error occurred");
      }
    } else {
      // Handle case when no applicant is selected
      alert("Delete Failed: No applicant selected");
    }    
  };
  
  return (
    <div className="content-wrapper p-3">
      {/* //form jangan dulu dipake */}
      <div className="row g-3 p-2">
        <div className="col ">
        </div>
        <form action="" method="GET" onSubmit={handleSearch}>
        <div className="col">
            <select name="department" className="form-control" value={query} onChange={handleSearchChange}>
              <option value selected disabled>
                Search by Department
              </option>
              <option value="backend">Backend</option>
              <option value="frontend">Frontend</option>
              <option value="fullstack">Fullstack</option>3
              <option value="mobile">Mobile</option>
            </select>
        </div>
        <div className="col">
          <div className="select2-purple">
          <Dropdown
  name="skill[]"
  selection
  multiple
  options={skillOptions}
  placeholder="Skills"
  value={skills} onChange={handleSearchChange}
/>

            <div className="col">
              <button type="submit" className="btn btn-default">
                <i className="fas fa-search" />
              </button>
            </div>
          </div>
        </div>
        </form> 
      </div>

      {isLoading ? (
  <Loader />
) : (
  <table
    className="table table-hover"
    style={{ margin: "15px", textAlign: "center" }}
  >
    <thead>
      <tr style={{ width: "" }}>
        <th>#</th>
        <th>Name</th>
        <th>Position Title</th>
        <th>Department</th>
        <th>Email</th>
        <th>Details</th>
      </tr>
    </thead>
    <tbody>
      {(results.length > 0 ? results : displayedApplicants).map((item, index) => (
        <tr key={item.id || index}>
          <td>{item.id || index + 1}</td>
          <td>
            {item.first_name || "-"} {item.last_name || "-"}
          </td>
          <td>{item.title || "-"}</td>
          <td>{item.department || "-"}</td>
          <td>{item.email || "-"}</td>
          <td>
            <button
              className="btn btn-outline-primary m-1"
              data-toggle="modal"
              data-target={`#applicantDetailsModal${item.id || index}`}
              onClick={() => openModal(item, index)}
            >
              Details
            </button>
            <button
              className="btn btn-outline-success m-1"
              data-toggle="modal"
              data-target={`#applicantEdit${item.id || index}`}
              onClick={() => openEditForm(item, index)}
            >
              Edit
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
)}


{/* Modal details */}

 {displayedApplicants.map((applicant, index) => (
        <div
          class="modal fade"
          id={`applicantDetailsModal${index}`}
          key={applicant.id}
        >
          <div class="modal-dialog modal-dialog-scrollable">
            <div class="modal-content">
              <div class="modal-header">
                <h4 class="modal-title">Applicant Details</h4>
                <button
                  type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <h4 className="ui dividing header">Applicant Identity</h4>
                <p>
                  Name: {applicant.first_name || "-"},{" "}
                  {applicant.last_name || "-"}
                </p>
                <p>Email: {applicant.email || "-"}</p>
                <p>Phone: {applicant.phone || "-"}</p>
                <p>
                  Resume:{" "}
                  <a href={applicant.resume || "-"} target="blank">
                    {applicant.first_name || "-"}, {applicant.last_name || "-"}
                    's resume
                  </a>
                </p>
                <object
                  data={applicant.resume || "none"}
                  type="application/pdf"
                  width="70%"
                  height="500px"
                ></object>

                <br />
                <h4 className="ui dividing header">Job Details</h4>
                <p>Position Title: {applicant.title || "-"}</p>
                <p>Description: {applicant.description || "-"}</p>
                <p>Department: {applicant.department || "-"} </p>
                <p>
  Skill:
  <ul>
    {applicant.skills &&
      applicant.skills.map((skill, index) => (
        <li key={index}>{skill.skill}</li>
      ))}
  </ul>
</p>
                <p>Experience Required: {applicant.experience || "-"}</p>
                <p>Current Position: {applicant.position || "-"}</p>
                <br />
                <h4 className="ui dividing header">Interview Details</h4>
                <p>Date of Applied: {applicant.applied || "-"}</p>
                <p>Date of Interview: {applicant.interview || "-"}</p>
                <p>Interviewed By: {applicant.interviewer || "-"}</p>
                <p>Score: {applicant.score || "-"}</p>
                <p>Status: {applicant.status || "-"}</p>
                <p>Notes:{applicant.notes || "-"}</p>
              </div>
              <div class="modal-footer justify-content-between">
                <button
                  type="button"
                  class="btn btn-default"
                  data-dismiss="modal"
                >
                  Close
                </button>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => handleDelete(applicant.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}


      {/* // form edit */}
      {displayedApplicants.map((applicant, index) => (
        <div class="modal fade" id={`applicantEdit${index}`} key={applicant.id}>
          <div class="modal-dialog modal-dialog-scrollable">
            <div class="modal-content">
              <div class="modal-header">
                <h4 class="modal-title">Edit Data</h4>
                <button
                  type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
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
                          defaultValue={applicant.last_name}
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
                        defaultValue={applicant.email}
                      />
                    </div>
                    <div className="field">
                      <label>Phone</label>
                      <input
                        type="text"
                        name="phone"
                        onChange={handleEditChange}
                        placeholder="ex: 088783625321"
                        defaultValue={applicant.phone}
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
                        defaultValue={applicant.title}
                      />
                    </div>
                    <div className="field">
                      <label>Description</label>
                      <input
                        type="text"
                        name="description"
                        onChange={handleEditChange}
                        placeholder="Description"
                        defaultValue={applicant.description}
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
                        defaultValue={applicant.department}
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
                        defaultValue={applicant.skill}
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
                        defaultValue={applicant.experience}
                      />
                    </div>
                    <div className="field">
                      <label>Current Employer</label>
                      <input
                        type="text"
                        name="employer"
                        placeholder=""
                        onChange={handleEditChange}
                        defaultValue={applicant.employer}
                      />
                    </div>
                    <div className="field">
                      <label>Current position</label>
                      <input
                        type="text"
                        name="position"
                        placeholder=""
                        onChange={handleEditChange}
                        defaultValue={applicant.position}
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
                        defaultValue={applicant.applied}
                      />
                    </div>
                    <div className="field">
                      <label>Date of Interview</label>
                      <input
                        type="date"
                        name="interview"
                        onChange={handleEditChange}
                        defaultValue={applicant.interview}
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
                        defaultValue={applicant.interviewer}
                      />
                    </div>
                    <div className="field">
                      <label>Interview Score</label>
                      <input
                        type="text"
                        name="score"
                        placeholder=""
                        onChange={handleEditChange}
                        defaultValue={applicant.score}
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
                        defaultValue={applicant.status}
                      />
                    </div>
                    <div className="field">
                      <label>Notes</label>
                      <input
                        type="text"
                        name="notes"
                        onChange={handleEditChange}
                        placeholder=""
                        defaultValue={applicant.notes}
                      />
                    </div>
                  </div>

                  <div className="four wide field">
                    <button className="ui primary button submit-button">
                      Edit
                    </button>
                  </div>
                </form>
              </div>
              <div class="modal-footer justify-content-between">
                <button
                  type="button"
                  class="btn btn-default"
                  data-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      ))} 

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
                      defaultValue={selectedApplicant.first_name}
                    />
                  </div>
                  <div className="field">
                    <input
                      type="text"
                      name="last_name"
                      onChange={handleEditChange}
                      placeholder="Last Name"
                      defaultValue={selectedApplicant.last_name}
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
                    defaultValue={formData.email}
                  />
                </div>
                <div className="field">
                  <label>Phone</label>
                  <input
                    type="text"
                    name="phone"
                    onChange={handleEditChange}
                    placeholder="ex: 088783625321"
                    defaultValue={formData.phone}
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
                    defaultValue={formData.title}
                  />
                </div>
                <div className="field">
                  <label>Description</label>
                  <input
                    type="text"
                    name="description"
                    onChange={handleEditChange}
                    placeholder="Description"
                    defaultValue={formData.description}
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
                    defaultValue={formData.experience}
                  />
                </div>
                <div className="field">
                  <label>Current Employer</label>
                  <input
                    type="text"
                    name="employer"
                    placeholder=""
                    onChange={handleEditChange}
                    defaultValue={formData.employer}
                  />
                </div>
                <div className="field">
                  <label>Current position</label>
                  <input
                    type="text"
                    name="position"
                    placeholder=""
                    onChange={handleEditChange}
                    defaultValue={formData.position}
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
                    defaultValue={formData.applied}
                  />
                </div>
                <div className="field">
                  <label>Date of Interview</label>
                  <input
                    type="date"
                    name="interview"
                    onChange={handleEditChange}
                    defaultValue={formData.interview}
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
                    defaultValue={formData.interviewer}
                  />
                </div>
                <div className="field">
                  <label>Interview Score</label>
                  <input
                    type="text"
                    name="score"
                    placeholder=""
                    onChange={handleEditChange}
                    defaultValue={formData.score}
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
                    defaultValue={formData.status}
                  />
                </div>
                <div className="field">
                  <label>Notes</label>
                  <input
                    type="text"
                    name="notes"
                    onChange={handleEditChange}
                    placeholder=""
                    defaultValue={formData.notes}
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

      <div className="pagination pagination-sm">
        <ReactPaginate
          previousLabel={"prev"}
          nextLabel={"next"}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageChange}
          containerClassName={"pagination"}
          subContainerClassName={"pages pagination"}
          activeClassName={"active"}
          className="pagination"
        />
      </div>

     

      
    </div>
  );
}

export default Applicants;
