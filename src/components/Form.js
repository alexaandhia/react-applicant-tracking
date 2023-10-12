import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dropdown } from 'semantic-ui-react';
import Applicants from './Applicants';

function Form({ isEditMode, selectedApplicant, selectedSkills, onSubmit }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [skills, setSkills] = useState([]);
  const [formData, setLocalFormData] = useState({
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
  });
  
  useEffect(() => {
    const apiUrl = 'http://127.0.0.1:8888/api/skill';
  
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setSkills(data); 
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);
  

  const changeHandler = (event) => {
    const { name, value, files } = event.target;

    if (name === 'resume') {
      setSelectedFile(files[0]);
      setIsFilePicked(true);
    } else {
      setLocalFormData({ ...formData, [name]: value });
    }
  };

  const skillOptions = skills.map((skill) => ({
    key: skill.id,
    text: skill.skill,
    value: skill.id,
  }));

  const handleSubmission = async (event) => {
    event.preventDefault();
    const ApplicantData = new FormData();
    ApplicantData.append('resume', selectedFile);
  
    Object.keys(formData).forEach((key) => {
      ApplicantData.append(key, formData[key]);
    });
  
    await axios
      .post('http://127.0.0.1:8888/api/add', ApplicantData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((response) => {
        // Tambahkan console.log di sini untuk memeriksa respons
        console.log('Response Data:', response.data);
  
        if (response.data.error) {
          alert(response.data.error);
        } else {
          alert(isEditMode ? 'Edit Succeed' : 'Add Suceed');
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error('Error:', error);
  
        alert(isEditMode ? 'Edit Failed!' : 'Add Failed!');
      });
  };
  
   
  
  return (
    <div>

      <h2 className="header" >Add Data</h2>
    <form className="ui form scrolling content" encType="multipart/form-data" isEditMode={isEditMode} >
  
      
  <h4 className="ui dividing header">Applicant Identity</h4>
  <div className="field">
    <label>Name</label>
    <div className="two fields">
      <div className="field">
        <input type="text" name="first_name" onChange={changeHandler} placeholder="First Name" value={formData.first_name} />
      </div>
      <div className="field">
        <input type="text" name="last_name" onChange={changeHandler} placeholder="Last Name" value={formData.last_name}/>
      </div>
    </div>
  </div>

  <div className="two fields">
    <div className="field">
      <label>Email</label>
      <input type="email" name="email" onChange={changeHandler} placeholder="example@gmail.com"/>
    </div>
    <div className="field">
      <label>Phone</label>
      <input type="text" name="phone" onChange={changeHandler} placeholder="ex: 088783625321"/>
    </div>
  </div>

  <div className="field">
    <label>Resume (PDF)</label>
    <input type="file" name="resume" accept=".pdf"  onChange={changeHandler} placeholder="PDF File"/>
  </div> 

  <h4 className="ui dividing header">Job Details</h4>
  <div className="two fields">
    <div className="field">
      <label>Position Title</label>
      <input type="text" name="title" onChange={changeHandler}  placeholder="Position Title"/>
    </div>
    <div className="field">
      <label>Description</label>
      <input type="text" name="description" onChange={changeHandler}  placeholder="Description"/>
    </div>
  </div>

  <div className="two fields">
    <div className="field">
      <label>Department</label>
      <select className="ui search dropdown" name="department" onChange={changeHandler}>
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
            onChange={changeHandler}
            placeholder="Skills"
            value={selectedSkills}
          />

</div>
  </div> 
  

  <div className="three fields">
    <div className="field">
      <label>Experience Required</label>
      <input type="text" name="experience" placeholder="" onChange={changeHandler}/>
    </div>
    <div className="field">
      <label>Current Employer</label>
      <input type="text" name="employer" placeholder="" onChange={changeHandler}/>
    </div>
    <div className="field">
      <label>Current position</label>
      <input type="text" name="position" placeholder="" onChange={changeHandler}/>
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
      <input type="text" name="interviewer" placeholder="" onChange={changeHandler} />
    </div>
    <div className="field">
      <label>Interview Score</label>
      <input type="text" name="score" placeholder="" onChange={changeHandler} />
    </div>
  </div>
  <div className="two fields">
    <div className="field">
      <label>Status</label>
      <input type="text" name="status" onChange={changeHandler}  placeholder=""/>
    </div>
    <div className="field">
      <label>Notes</label>
      <input type="text" name="notes" onChange={changeHandler}  placeholder=""/>
    </div>
  </div>

  <div className="four wide field">
  <button className="ui primary button submit-button" onClick={handleSubmission}>{isEditMode ? "Edit" : "Submit"}</button>  </div>
</form>

    </div>
  );
}

export default Form;
