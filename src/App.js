import React, { useCallback, useEffect, useState } from 'react';
import Axios from 'axios';

// census front-end
// writer: John Chang 
// date: Dec 10, 2021
function App() {
  // census data list
  const [census, setCensus] = useState([])
  // error state
  const [error, setError] = useState(false)
  // page loading state
  const [loaded, setLoaded] = useState(false)
  // data rank state
  const [rank, setRank] = useState(0)
  // page state
  const [page, setPage] = useState(1)
  // total number of records 
  const [total, setTotal] = useState(0)
  // age filter for API
  const [age, setAge] = useState('any')
  // education filter for API
  const [education, setEducation] = useState('any')
  // country filter for API
  const [country, setCountry] = useState('any')

  // add new census record
  const addRecord = useCallback((newRecord) => {
    census.push(newRecord);
    setCensus(census);
  }, [census])

  // click previous pagination button
  const clickPrev = () => {
    if (page > 1) {
      setRank(rank - 10)
    } else {
      setRank(0)
    }
  }

  // click next pagination button
  const clickNext = () => {
    if (page < total) {
      setRank(rank + 10)
    }
  }

  // select age filter
  const selectAge = (e) => {
    setAge(e.target.value)
    setRank(0)
  }

  // select education filter
  const selectEducation = (e) => {
    setEducation(e.target.value)
    setRank(0)
  }

  // select country filter
  const selectCountry = (e) => {
    setCountry(e.target.value)
    setRank(0)
  }

  // create census record
  const createRecord = (rec, id) => {
    let record = {
      id: 0,
      age: "",
      workclass: "",
      fnlwgt: "",
      education: "",
      maritalStatus: "",
      occupation: "",
      relationship: "",
      race: "",
      sex: "",
      hoursPerWeek: "",
      nativeCountry: "",
      capital: "",
      income: ""
    }
    record.id = id
    record.age = rec['age']
    record.workclass = rec['workclass']
    record.fnlwgt = rec['fnlwgt']
    record.education = rec['education']
    record.maritalStatus = rec['marital-status']
    record.occupation = rec['occupation']
    record.relationship = rec['relationship']
    record.race = rec['race']
    record.sex = rec['sex']
    record.hoursPerWeek = rec['hours-per-week']
    record.nativeCountry = rec['native-country']
    record.capital = rec['capital']
    record.income = rec['income']
    return record
  }

  // use effect calling API with parameters
  useEffect(() => {
    Axios.get(`http://127.0.0.1:5000/census_income?file_name=us-census-income&rank=${rank}&age=${age}&education=${education}&country=${country}`).then((res) => {
      if (res.status === 200) {
        setError(false)
        census.length = 0
        let id = rank + 1
        res.data.records.forEach(rec => {
          let record = createRecord(rec, id)
          addRecord(record)
          id += 1
        })
        if (census.length > 0) {
          setLoaded(true)
        }
        setPage(res.data.page)
        setTotal(res.data.pages)
      } else {
        setError(true)
      }
    }).catch(
      error => {
        setError(true)
      }
    )
  }, [census, rank, age, education, country, addRecord])

  return (
    <div>
      <form>
        <div className="form-group">
          <label htmlFor="FormControlSelect1">Select Age</label>
          <select className="form-control" id="exampleFormControlSelect1" onChange={selectAge}>
            <option value="any">Any</option>
            <option value="over50">Older than 50 years old</option>
            <option value="less50">Less than 50 years old</option>
            <option value="less30">Less than 30 years old</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="FormControlSelect2">Select Education</label>
          <select className="form-control" id="FormControlSelect2" onChange={selectEducation}>
            <option value="any">Any</option>
            <option value="bachelor">Bachelors</option>
            <option value="master">Masters</option>
            <option value="college">Some-college</option>
            <option value="grad">HS-grad</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="FormControlSelect3">Select Native Country</label>
          <select className="form-control" id="FormControlSelect3" onChange={selectCountry}>
            <option value="any">Any</option>
            <option value="us">US</option>
            <option value="can">Canada</option>
            <option value="mex">Mexico</option>
          </select>
        </div>
      </form>
      {
        error
          ?
          <div className='no-data-error'>Data currently unavailable</div>
          :
          <div className="table-responsive">
            <table className="adjust table">
              <thead className="thead-dark">
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">age</th>
                  <th scope="col">education</th>
                  <th scope="col">occupation</th>
                  <th scope="col">country</th>
                  <th scope="col">capital</th>
                  <th scope="col">income</th>
                </tr>
              </thead>
              <tbody>
                {
                  loaded
                    ?
                    census.map(rec => {
                      return (
                        <tr key={rec.id}>
                          <td>{rec.id}</td>
                          <td>{rec.age}</td>
                          <td>{rec.education}</td>
                          <td>{rec.occupation}</td>
                          <td>{rec.nativeCountry}</td>
                          <td>{rec.capital}</td>
                          <td>{rec.income}</td>
                        </tr>
                      );
                    })
                    :
                    <tr></tr>
                }
              </tbody>
            </table>
            <nav aria-label="Page navigation">
              <ul className="align pagination">
                <li className="page-item">
                  <button className="page-link" aria-label="Previous" onClick={clickPrev}>
                    <span aria-hidden="true">&laquo;</span>
                    <span className="sr-only">Previous</span>
                  </button>
                </li>
                {
                  <li className="page-item"><button className="page-link">{page}</button></li>
                }
                <li className="page-item">
                  <button className="page-link" aria-label="Next" onClick={clickNext}>
                    <span aria-hidden="true">&raquo;</span>
                    <span className="sr-only">Next</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
      }
    </div>
  );
}
export default App;
