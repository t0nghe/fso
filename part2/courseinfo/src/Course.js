import React from 'react';

const Header = (props) => {
    return (
      <h2>{props.name}</h2>
    )
  }
  
  const Total = (props) => {
    const sum = props.courses.reduce( (acc, item)=> acc+item.exercises, 0)
    return(
      <strong>total of {sum} exercises</strong>
    ) 
  }
  
  const Part = (props) => {
    return (
      <p>
        {props.part.name} {props.part.exercises}
      </p>    
    )
  }
  
  const Content = (props) => {
    // console.log("Inside Content:", props)
    return <div>
        {props.courses.map(
          item => <Part part={item} key={item.id} />
        )}
      </div>
  }
  
  const Course = (props) => {
    return <div>
      <Header name={props.course.name} />
      <Content courses={props.course.parts} />
      <Total courses={props.course.parts} />
    </div>
  }

export default Course