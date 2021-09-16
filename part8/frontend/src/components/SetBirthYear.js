import React, { useState } from 'react'
import Select from 'react-select'

export const SetBirthYear = ({handleSubmit, allAuthors}) => {
  const [selected, setSelected] = useState(null)
  const [newValue, setNewValue] = useState('')
  const options = allAuthors.map(
    item => {
      const name = item.name
      return {value: name, label: name}
    }
  )
  
  let selectedBirthYear
  if (selected) {
    selectedBirthYear = allAuthors.find(item=> item.name===selected.value).born
    if (!selectedBirthYear) {
      selectedBirthYear = "Not known"
    }
  } else {
    selectedBirthYear = 'notselected'
  }

  const editBirthYear = <>Born on: {selectedBirthYear}<div>Change their birth year:<br /><input type="text" value={newValue} onChange={(e)=>{setNewValue(e.target.value)}} /><br /><button onClick={()=>{ handleSubmit([selected.value, parseInt(newValue)]); setNewValue('') }}>Submit</button></div></>

  return <div><Select options={options} defaultValue={selected} onChange={setSelected} /><br />{selectedBirthYear === 'notselected'? <>Select an author first</>:editBirthYear}
  </div>
}