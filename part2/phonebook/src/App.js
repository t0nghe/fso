import React, { useState, useEffect } from 'react'
import comm  from "./Comm"

const Filter = (props) => {
  const [letters, setLetters] = useState("")

  const handleLetters = (event) => {
      setLetters(event.target.value);
      props.handleFilterBy(event.target.value)
  }

  return (<div>Filter shown with <input value={letters} onChange={handleLetters} /></div>)
}

// As of 19:10 AddingPerson functions well.
const AddingPerson = (props) => {
  const [name, setName] = useState("")
  const [number, setNumber] = useState("")

  const sendingData = () => {
    if (name && number) {
      const newData = {"name": name, "number": number};
      props.handleAdd(newData);
    } else {
      console.log("Something is missing.")
    }
  }

  return <div>
    name: <input value={name} onChange={(e)=>{setName(e.target.value)}} /><br />
    number: <input value={number} onChange={(e)=>{setNumber(e.target.value)}} /><br />
    <button onClick={()=> {
      sendingData();
      setName("");
      setNumber("")
    }}>add</button>
  </div>;
}

const PeopleToDisplay = (props) => {

  const letters = props.filterBy.toLowerCase()
  console.log("<PeopleToDisplay> letters", letters)
  console.log("<PeopleToDisplay> props", props)
  let display;

  console.log(props.allPeople)
  display = props.allPeople.filter(
    (item)=>{
     return item.name.toLowerCase().includes(letters)
    }
  );
  console.log(display)
  

  return <ul>
      {display.map(
        (item) => <li key={item.name+item.number}>{item.name} {item.number} <button onClick={()=>{
          props.handleDeletion(item.id, item.name);
      }}>delete</button></li>
      )}
    </ul>
}

const Message = (props) => {
  return <div style={props.info[1]}>{props.info[0]}</div>
}

const App = () => {

  const error = {
    color: "red",
    background: "lightgrey",
    fontSize: "20px",
    borderStyle: "solid",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px"
  }

  const success = {
    color: "green",
    background: "lightgrey",
    fontSize: "20px",
    borderStyle: "solid",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px"
  }

  const nomsg = {
    display: "none"
  }

  const [ persons, setPersons ] = useState([])
  const [ filterBy, setFilterBy ] = useState("")
  const [ msgText, setMsgText ] = useState(["", nomsg])
  console.log("persons in <App>", persons)
  console.log("filterBy in <App>", filterBy)



  useEffect(
    ()=>{
      comm.listRecords().then( (x)=> {
        console.log(x);
        setPersons(x)
      })
    }
    , []
  )

  const deleteById = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
    comm.deleteRecord(id).then(
      (res) => {
      setPersons(persons.filter( (item)=> {return item.id !== id }));
      setMsgText([`Record of ${name} is deleted.`, success]);
          setTimeout(() => {
            setMsgText(['', nomsg])
          }, 5000);
        }
    ).catch(
      (e) => { setMsgText([`Infomation of ${name} has already been removed from server`, error]);
      setTimeout(() => {
        setMsgText(['', nomsg])
      }, 5000)
     }
    )
  }
  }

  const addRecord = (newData) => {
    const filtered = persons.filter( (item) => {return item.name === newData.name})

    if (filtered.length === 0) {
      comm.createRecord(newData).then(
        (res) => {
          setPersons([...persons, res]);
          setMsgText([`Record of ${res.name} is added.`, success]);
          setTimeout(() => {
            setMsgText(['', nomsg])
          }, 5000)
        }
      )
    } else if (window.confirm(`${filtered[0].name} exists. Update?`)) {
      comm.updateRecord(filtered[0].id, newData).then(
        res => {
          const filtered = persons.filter( (item)=> {
            return item.id !== res.id 
          });
          setPersons(
            [...filtered, res]
          );
          setMsgText([`Record of ${res.name} is updated.`, success]);
          setTimeout(() => {
            setMsgText(['', nomsg])
          }, 5000)
        }
      )
    }
  }

  return (<div>
    <h2>Phonebook</h2>
    <Message info={msgText} />
      <Filter handleFilterBy={setFilterBy} />
    <h3>Add a new</h3>
        <AddingPerson handleAdd={addRecord} />
      <h3>Numbers</h3>
      <PeopleToDisplay filterBy={filterBy} allPeople={persons} handleDeletion={deleteById} />
  </div>
  )
}

export default App


