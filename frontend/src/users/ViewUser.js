import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {jsPDF} from "jspdf";
import exportFromJSON from 'export-from-json'

export default function ViewUser() {
    const [user, setUser] = useState({
        id : "",
        name: "",
        username: "",
        email: "",
    });

    let credentials = useLocation();
    let cred = credentials.state;
    //const { username,password } = cred;

    useEffect(() => {
        loadUser();
    }, [cred.username,cred.password]);

    const loadUser = (async ()=> {
        try {
            //console.log(cred);
            const result = await axios.post(`http://localhost:8080/user/login`,{
                username : cred.username,
                password : cred.password
            })
            //console.log(result.data);

            setUser(result.data);
        } catch (error) {
            console.error("Error logging In : ",error);
        }
    })

    /*const loadUser = (async () => {
        //console.log(username,password);
        const result = await axios.get(`http://localhost:8080/user/${cred.username}/${cred.password}`);
        setUser(result.data);
    });*/
    
    const handleDownload = async (downloadType) => {
        try {

            const response = await axios.post(`http://localhost:8080/user/login/download`,{
                username : cred.username,
                password : cred.password
            })

            //const response = await axios.get(`http://localhost:8080/user/${cred.username}/${cred.password}/download`);
            const data = response.data;

            const downloadData = {
                id : data.id,
                name : data.name,
                username : data.username,
                email : data.email
            }

            if(downloadType === "pdf"){

                const doc = new jsPDF();
                const text = `User\nID: ${data.id}\nName: ${data.name}\nUsername: ${data.username}\nEmail: ${data.email}\n\n`;
                doc.text(text, 10, 50);
                doc.save(`${data.username}.pdf`);

            } else if(downloadType === "txt"){
               
                const fileName = `${cred.username}`;
                const exportType =  exportFromJSON.types.txt;

                exportFromJSON({ data : JSON.parse(JSON.stringify(downloadData)), fileName, exportType }); 

            } else if(downloadType === "csv"){
                
                const fileName = `${cred.username}`;
                const exportType =  exportFromJSON.types.csv;

                exportFromJSON({ data:[JSON.parse(JSON.stringify(downloadData))], fileName, exportType }); 
                
            } else if(downloadType === "xls"){
                
                const fileName = `${cred.username}`;
                const exportType =  exportFromJSON.types.xls;

                exportFromJSON({ data:[JSON.parse(JSON.stringify(downloadData))], fileName, exportType }); 
                
            }

        } catch (error) {
            console.error('Error downloading the file', error);
        }
    };

    return (
        <div className="container" >
            <div className="row">
                <div className="col-md-6  border rounded p-4 mt-2 shadow" style={{backgroundColor: 'orange', width: '100%' , height:'100%'}}>
                    <h2 className="text-center m-4">User Details</h2>

                    <div className="card" >
                        <div className="card-header">
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">
                                    <b>User ID: </b>
                                    {user.id}
                                </li>
                                <li className="list-group-item">
                                    <b>Name: </b>
                                    {user.name}
                                </li>
                                <li className="list-group-item">
                                    <b>UserName: </b>
                                    {user.username}
                                </li>
                                <li className="list-group-item">
                                    <b>Email: </b>
                                    {user.email}
                                </li>
                            </ul>
                        </div>
                    </div>
                    <Link className="btn btn-success my-2 mx-2" to={"/"}>
                        Logout
                    </Link>
                    <button type='button' className='btn btn-dark mx-2' onClick={() => handleDownload("pdf")}>
                        Download(pdf)
                    </button>
                    <button type='button' className='btn btn-dark mx-2' onClick={() => handleDownload("txt")}>
                        Download(txt)
                    </button>
                    <button type='button' className='btn btn-dark mx-2' onClick={() => handleDownload("csv")}>
                        Download(csv)
                    </button>
                    <button type='button' className='btn btn-dark mx-2' onClick={() => handleDownload("xls")}>
                        Download(xls)
                    </button>
                </div>
            </div>
        </div>
    );
}