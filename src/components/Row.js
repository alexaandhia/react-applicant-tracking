import React from "react";

function Row (){

    return(
        <table className="ui celled table" style={{ margin: "50px", padding: "", textAlign: "center"}}>
            <thead>
                <tr style={{ width: ""}}>
                    <th>#</th>
                    <th>Name</th>
                    <th>Position Title</th>
                    <th>Department</th>
                    <th>Email</th>
                    <th>Details</th>
                </tr>
            </thead>
            <tbody>
                <td>1</td>
                <td>Name</td>
                <td>Position Title</td>
                <td>Department</td>
                <td>Email</td>
                <td><button className="mini ui blue button" >Details</button></td>
            </tbody>
        </table>
    );
}

export default Row;