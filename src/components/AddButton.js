import React, {useState} from "react";
import { Modal } from "semantic-ui-react";
import Form from "./Form";
import Skill from "./Skill";

function AddButton(){

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isFormMode, setIsFormMode] = useState(false);
    const [isSkillOpen, setIsSkillOpen] = useState(false);
    const [isSkillMode, setIsSkillMode] = useState(false);

    const openForm = (applicant) => {
        setIsFormOpen(true);
        setIsFormMode(true);
      };

    const closeForm = () => {
        setIsFormOpen(false);
      };

      const openSkill = (applicant) => {
        setIsSkillOpen(true);
        setIsSkillMode(true);
      };

    const closeSkill = () => {
        setIsSkillOpen(false);
      };



    return(
        <div>
        <Modal.Actions>
        <button className="ui inverted green button" onClick={openForm}>Add Data</button>
        <button className="ui inverted blue button" onClick={openSkill}>Add Skill</button>
        </Modal.Actions>

        <Modal open={isFormOpen} onClose={closeForm}>
        <Modal.Header>Create Data
        <div onClick={closeForm} style={{ float: "right" }}>
            <i className=" close icon"></i>
          </div>
        </Modal.Header>
        <Modal.Content>
            <Form
              isFormMode={isFormMode}
              onSubmit={() => {
                closeForm();
                setIsFormOpen(false);
              }}
            />
        </Modal.Content>
      </Modal>

      <Modal open={isSkillOpen} onClose={closeSkill}>
        <Modal.Header>Create Data
        <div onClick={closeSkill} style={{ float: "right" }}>
            <i className=" close icon"></i>
          </div>
        </Modal.Header>
        <Modal.Content>
            <Skill
              isSkillMode={isSkillMode}
              onSubmit={() => {
                closeSkill();
                setIsSkillOpen(false);
              }}
            />
        </Modal.Content>
      </Modal>
        </div>

    );
}

export default AddButton;