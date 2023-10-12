import React, { useState, useEffect } from "react";
import Form from "./Form";
import Loader from "./Loader";
import { Modal, Pagination, PaginationItem } from "semantic-ui-react";
import ReactPaginate from 'react-paginate';
import { Document, Page, pdfjs } from "react-pdf";
import axios from "axios";

function Applicants() {
  const [applicants, setApplicants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedApplicantId, setSelectedApplicantId] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const itemsPerPage = 5; 
  const [currentPage, setCurrentPage] = useState(0);
  const [formData, setLocalFormData] = useState({
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
  });



  useEffect(() => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
  
    fetch("http://127.0.0.1:8888/api/applicants")
      .then((response) => response.json())
      .then((data) => {
        setApplicants(data.slice(startIndex, endIndex));
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false);
      });
  }, [currentPage]);

  const handlePageChange = (selected) => {
    setCurrentPage(selected.selected);
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
    setIsEditFormOpen(true);
    setIsEditMode(true);
    setLocalFormData({
      first_name: applicant.first_name,
      last_name: applicant.last_name,
      email: applicant.email,
      phone: applicant.phone,
      title: applicant.title,
      description: applicant.description,
      department: applicant.department,
      experience: applicant.experience,
      position: applicant.position,
      applied: applicant.applied,
      interview: applicant.interview,
      interviewer: applicant.interviewer,
      score: applicant.score,
      status: applicant.status,
      notes: applicant.notes,
    });
  };

  const closeEditForm = () => {
    setIsEditFormOpen(false);
  };

  
  
  const handleDelete = async () => {
    if (selectedApplicantId) {
      try {
        const response = await axios.delete(`http://127.0.0.1:8888/api/delete/${selectedApplicantId}`);
        alert('Deleted Succeed!');
        window.location.reload();
      } catch (error) {
        console.error(error);
      }
    }
  };
  
  

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <table
          className="ui celled table"
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
          {applicants.map((applicant, index) => (
  <tr key={applicant.id}>
    <td>{index + 1}</td>
    <td>
      {applicant.first_name || "-"} {applicant.last_name || "-"}
    </td>
    <td>{applicant.title || "-"}</td>
    <td>{applicant.department || "-"}</td>
    <td>{applicant.email}</td>
    <td>
      <button
        className="mini ui blue button"
        onClick={() => openModal(applicant, index)}
      >
        Details
      </button>
    </td>
  </tr>
))}
          </tbody>
        </table>
      )}

<ReactPaginate
  previousLabel={'Previous'}
  nextLabel={'Next'}
  breakLabel={'...'}
  pageCount={Math.ceil(applicants.length / itemsPerPage)}
  marginPagesDisplayed={2}
  pageRangeDisplayed={5}
  onPageChange={handlePageChange}
  containerClassName={'pagination'}
  subContainerClassName={'pages pagination'}
  activeClassName={'active'}
/>



      
      

      <Modal open={isModalOpen} onClose={closeModal}>
        <Modal.Header>
          Applicant Details
          <div onClick={closeModal} style={{ float: "right" }}>
            <i className=" close icon"></i>
          </div>
        </Modal.Header>
        <Modal.Content>
          {selectedApplicant && (
            <div>
              <h4 className="ui dividing header">Applicant Identity</h4>
              <p>
                Name: {selectedApplicant.first_name || "-"},{" "}
                {selectedApplicant.last_name || "-"}
              </p>
              <p>Email: {selectedApplicant.email || "-"}</p>
              <p>Phone: {selectedApplicant.phone || "-"}</p>
              <p>Resume: {selectedApplicant.resume || "-"}</p>

              <br />
              <h4 className="ui dividing header">Job Details</h4>
              <p>Position Title: {selectedApplicant.title || "-"}</p>
              <p>Description: {selectedApplicant.description || "-"}</p>
              <p>Department: {selectedApplicant.department || "-"} </p>
              <p>Experience Required: {selectedApplicant.experience || "-"}</p>
              <p>Current Position: {selectedApplicant.position || "-"}</p>
              <br />
              <h4 className="ui dividing header">Interview Details</h4>
              <p>Date of Applied: {selectedApplicant.applied || "-"}</p>
              <p>Date of Interview: {selectedApplicant.interview || "-"}</p>
              <p>Interviewed By: {selectedApplicant.interviewer || "-"}</p>
              <p>Score: {selectedApplicant.score || "-"}</p>
              <p>Status: {selectedApplicant.status || "-"}</p>
              <p>Notes:{selectedApplicant.notes || "-"}</p>
            </div>
          )}
        </Modal.Content>
        <Modal.Actions>
          <button
            className="ui inverted red button"
            onClick={() => handleDelete(selectedIndex)}
          >
            Delete
          </button>
          <button className="ui inverted green button" onClick={openEditForm}>
            Edit
          </button>
        </Modal.Actions>
      </Modal>

      <Modal open={isEditFormOpen} onClose={closeEditForm}>
        <Modal.Header>Edit Data</Modal.Header>
        <Modal.Content>
          {selectedApplicant && isEditFormOpen ? (
            <Form
            applicant={selectedApplicant}
            isEditMode={isEditMode}
            selectedSkills={selectedSkills}
            onSubmit={() => {
              closeEditForm();
              setIsEditFormOpen(false);
              }}
            />
          ) : (
            <div>
              {/* Tampilan lainnya (seperti yang sudah Anda miliki sebelumnya) */}
            </div>
          )}
        </Modal.Content>
      </Modal>
    </div>
  );
}



export default Applicants;
