import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dropdown } from 'semantic-ui-react';
import { useParams, Link, useNavigate } from 'react-router-dom';


function Edit ({ isEditMode, onSubmit,}){
  const { id } = useParams(); 
  const [selectedApplicantId, setSelectedApplicantId] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [editingApplicant, setEditingApplicant] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    resume: '',
    description: '',
    title: '',
    department: '',
    employer: '',
    experience: '',
    position: '',
    applied: '',
    interview: '',
    interviewer: '',
    score: '',
    status: '',
    notes: '',
    skill: [],
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  
  useEffect(() => {
    axios.get("http://127.0.0.1:8888/api/applicants")
      .then((response) => {
        setApplicants(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const editMode = (applicant) => {
    console.log("Selected Applicant:", applicant);
    setEditingApplicant(applicant);
    setSelectedApplicantId(applicant.id);
    setSelectedSkills(applicant.skill || []);
    
  };


  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
;

  
const handleUpdate = async (event) => {
  event.preventDefault();
  const ApplicantData = new FormData();

  Object.entries(formData).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        ApplicantData.append(key, item);
      });
    } else {
      ApplicantData.append(key, value);
    }
  });

  const url = `http://127.0.0.1:8888/api/applicants/update/${id}`;

  try {
    const response = await axios({
      method: 'PUT',
      url: url,
      data: ApplicantData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    console.log('Response Data:', response.data);

    if (response.data.error) {
      alert('Edit Failed!');
    } else {
      alert('Edit Succeed');
      window.location.reload(); 
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Edit Failed');
  }
};

  const skillOptions = skills.map((skill) => ({
    key: skill.id,
    text: skill.skill,
    value: skill.id,
  }));

    return(
        <div>

    <form className="ui form scrolling content" encType="multipart/form-data" onSubmit={handleUpdate} >
  
      
  <h4 className="ui dividing header">Applicant Identity</h4>
  <div className="field">
    <label>Name</label>
    <div className="two fields">
      <div className="field">
      <input type="text" name="first_name" onChange={handleEditChange} placeholder="First Name" value={selectedApplicant.first_name}/>
      </div>
      <div className="field">
      <input type="text" name="last_name" onChange={handleEditChange} placeholder="Last Name" value={selectedApplicant.last_name} />
      </div>
    </div>
  </div>

  <div className="two fields">
    <div className="field">
      <label>Email</label>
      <input type="email" name="email" onChange={handleEditChange} placeholder="example@gmail.com" value={selectedApplicant.email}/>
    </div>
    <div className="field">
      <label>Phone</label>
      <input type="text" name="phone" onChange={handleEditChange} placeholder="ex: 088783625321" value={selectedApplicant.phone}/>
    </div>
  </div>

  <div className="field">
    <label>Resume (PDF)</label>
    <input type="file" name="resume" accept=".pdf"  onChange={handleEditChange} placeholder="PDF File"/>
  </div> 

  <h4 className="ui dividing header">Job Details</h4>
  <div className="two fields">
    <div className="field">
      <label>Position Title</label>
      <input type="text" name="title" onChange={handleEditChange}  placeholder="Position Title"/>
    </div>
    <div className="field">
      <label>Description</label>
      <input type="text" name="description" onChange={handleEditChange}  placeholder="Description"/>
    </div>
  </div>

  <div className="two fields">
    <div className="field">
      <label>Department</label>
      <select className="ui search dropdown" name="department" onChange={handleEditChange}>
      <option value="" selected disabled>Select Department</option>
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
          />

</div>
  </div> 
  

  <div className="three fields">
    <div className="field">
      <label>Experience Required</label>
      <input type="text" name="experience" placeholder="" onChange={handleEditChange}/>
    </div>
    <div className="field">
      <label>Current Employer</label>
      <input type="text" name="employer" placeholder="" onChange={handleEditChange}/>
    </div>
    <div className="field">
      <label>Current position</label>
      <input type="text" name="position" placeholder="" onChange={handleEditChange}/>
    </div>
  </div>

  <h4 className="ui dividing header">Interview Details</h4>
  <div className="two fields">
    <div className="field">
      <label>Date of Applied</label>
      <input type="date" name="applied" onChange={handleEditChange} />
    </div>
    <div className="field">
      <label>Date of Interview</label>
      <input type="date" name="interview" onChange={handleEditChange} />
    </div>
  </div>
  <div className="two fields">
    <div className="field">
      <label>Interviewed By</label>
      <input type="text" name="interviewer" placeholder="" onChange={handleEditChange} />
    </div>
    <div className="field">
      <label>Interview Score</label>
      <input type="text" name="score" placeholder="" onChange={handleEditChange} />
    </div>
  </div>
  <div className="two fields">
    <div className="field">
      <label>Status</label>
      <input type="text" name="status" onChange={handleEditChange}  placeholder=""/>
    </div>
    <div className="field">
      <label>Notes</label>
      <input type="text" name="notes" onChange={handleEditChange}  placeholder=""/>
    </div>
  </div>

  <div className="four wide field">
  <button className="ui primary button submit-button" onClick={handleUpdate}>Edit</button>
  </div>
</form>


    </div>
    );
}

export default Edit;