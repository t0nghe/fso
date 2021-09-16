import React, {useEffect, useState} from "react"
import WeatherReport from "./Weather"
import axios from "axios"

const Filter = (props) => {
  const [letters, setLetters] = useState("")

  return <div>Find countries: <input value={letters} onChange={(event)=>{setLetters(event.target.value); props.upstream(event.target.value)}} /></div>
}

const FilteredCountryList = (props) => {

  const initialHidden = {}
  for (let key of props.list) {
    initialHidden[key.name] = true;
  }

  const [isHidden, setIsHidden] = useState(initialHidden);

  const toggleDisplay = (key) => {
    const newHidden = {...isHidden}
    newHidden[key] = !newHidden[key]

    setIsHidden(
      newHidden
    )
  }

  return <ul>{props.list.map(
    item=> { const itemKey=item.name;
      return (<li key={itemKey}>
      <SingleCountry country={item} isHidden={isHidden[itemKey]} />
      { isHidden[itemKey] ? <button value={itemKey} onClick={(e)=> toggleDisplay(e.target.value)}>Show</button> : <button value={itemKey} onClick={(e)=> toggleDisplay(e.target.value)}>Hide</button> }
    </li>)
    }
  )}</ul>
}

const SingleCountry = (props) => {
  const {name, capital, population, languages, flag} = props.country

  if (props.isHidden === true) {
    return <span>{name}</span>
  } else {
    return <div><h1>{name}</h1>
    Capital: {capital}<br />
    Population: {population}<br />
    Languages: <ul>{languages.map( (item)=> <li key={name+item.name}>{item.name}</li>)}</ul>
    <div>
    Flag: <br /><img src={flag} style={{width: 300, height: "auto"}} alt={name} /></div>
    <WeatherReport city={capital} country={name} />
    </div>
  }
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filterBy, setFilterBy] = useState("")
  
  useEffect(
    () => {
      axios.get("https://restcountries.eu/rest/v2/all").then( (response)=> {
        setCountries(response.data)
      } )
    }
  , [])

  const filteredCountries = countries.filter(
    (item) => {return (item.name.toLowerCase().indexOf(filterBy.toLowerCase()) !== -1)}
  )

  return (
    <div>
      <Filter upstream={setFilterBy} />
      {(filteredCountries.length > 10)?
        "Too many matches. Specify another filter.":
        (filteredCountries.length === 1)?
          <SingleCountry country={filteredCountries[0]} isHidden={false} />:
          <FilteredCountryList list={filteredCountries} />}
    </div>
  );
}

export default App;
