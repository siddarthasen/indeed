import './App.css';
import data from './resume.csv';
import { csv } from 'd3';
import React, {useEffect, useState} from 'react';
import axios from 'axios';

function App() {

  const [filteredData, setFilteredData] = useState([]);
  const [job, setJob] = useState('');
  const [location, setLocation] = useState('');
  const [display, setDisplay] = useState('');
  
  /**
    Initialize CSV
  */
  useEffect(() => {
    csv(data).then(data => {
      setFilteredData(data)
    })
  }, [])

  /**
    Filter results and send to API
  */
  var submit = (e) => {
    setDisplay('')
    // filter by job first
    let temp = filteredData.filter(each => each.Job === job);
    if (temp.length === 0) {
      setDisplay("No jobs found");
      return;
    }

    temp = temp.filter(each => each.Location === location);
    if (temp.length === 0) {
      setDisplay("No Location found");
      return;
    }
    setDisplay('')
    // send {job, location} to API
    
    axios.post('/api', {job: job, location: location})
      .then(res => {
        console.log(res.data);
        difficulty(parseInt(temp[0].Resume), parseInt(res.data.total))
      })      
  }
  /**
    Calculates RESUMES divided by JOBS
    Sets DISPLAY to "Easy", "Medium", "Hard"
  */
  const difficulty = (resumes, jobs) => {
    let num = resumes / jobs;
    if (num <= 1) {
      setDisplay('Hard')
    } else if (num <= 2) {
      setDisplay('Medium')
    } else {
      setDisplay('Easy')
    }

  }

  return (
    <div >
        <label for="job">Job:</label>
        <input type="text" id="job" onChange={(e) => setJob(e.target.value)} ></input>
        <label for="loc">Location:</label>
        <input type="text" id="loc" name="loc" onChange={(e) => setLocation(e.target.value)}></input>
        <button type="button" onClick={submit}>Click Me!</button>

        <h3>{display}</h3>
    </div>
  );
}

export default App;
