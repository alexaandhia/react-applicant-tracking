import React, { useState } from "react";
import axios from "axios";

function Skill() {
  const [formData, setFormData] = useState({ skill: "" });
  const [isFormOpen, setIsFormOpen] = useState(true); 
  const handleSubmission = (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    const apiUrl = `http://127.0.0.1:8888/api/skillAdd`;

    const method = 'POST';

    fetch(apiUrl, {
      method: method,
      body: formDataToSend,
    })
      .then((response) => response.json())
      .then(() => {
        alert('add skill succeed!');
        setIsFormOpen(false);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div>
      {isFormOpen ? (
        <div>
          <h2 className="header">Add Skill</h2>
          <form className="ui form scrolling content">
            <div className="field">
              <label>Skill Name</label>
              <input
                type="text"
                name="skill"
                placeholder="Type Skill Name..."
                onChange={(e) =>
                  setFormData({ ...formData, skill: e.target.value })
                }
              />
            </div>
            <button
              type="submit"
              className="ui primary button submit-button"
              onClick={handleSubmission}
            >
              Submit
            </button>
          </form>
        </div>
      ) : (
        <div>
          {/* Tampilkan pesan bahwa form sudah berhasil ditutup */}
          <p></p>
        </div>
      )}
    </div>
  );
}

export default Skill;
