import React, {useState} from 'react'

const Button = (props) => {
  return (<>
  <button onClick={()=>props.handleClick('good')}>good</button>
  <button onClick={()=>props.handleClick('neutral')}>neutral</button>
  <button onClick={()=>props.handleClick('bad')}>bad</button>
  </>)
}

// displaying the statistics is extracted into its own Statistics component.
// display stats only once feedback has been gathered
const Statistics = (props) => {
  // console.log(props.data)
  const {good, neutral, bad} = props.data
  const all = good+neutral+bad;
  const average= ((good - bad) / all).toPrecision(1)
  let positive=(good*100/all)
  if (positive%1===0) {
    positive = positive.toFixed(0)
  } else {
    positive = positive.toFixed(1)
  }

  if (all === 0) {
    return <div>No feedback given</div>
  } else {
  return <table><tbody>
    <Statistic text="good" value={good} />
    <Statistic text="neutral" value={neutral} />
    <Statistic text="bad" value={bad} />
    <Statistic text="all" value={all} />
    <Statistic text="average" value={average} />
    <Statistic text="positive" value={positive.toString()+"%"} />
    </tbody></table>
  }
}

const Statistic = (props) => {
  return (
    <tr><td>{props.text}</td><td>{props.value}</td></tr>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [feedback, setFeedback] = useState(
    {good: 0, neutral: 0, bad: 0}
  )

  const handleClick = (opinion) => {
    switch (opinion) {
      case "good":
        setFeedback(
          {...feedback,
            good: feedback.good +1
          }
        )
        break;
        case "neutral":
          setFeedback(
            {...feedback,
              neutral: feedback.neutral +1
            }
          )
          break;
          case "bad":
            setFeedback(
              {...feedback,
                bad: feedback.bad +1
              }
            )
            break;
          default:
            break;
    }
    
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={handleClick} />
      <h1>statistics</h1>
      <Statistics data={feedback} />
    </div>
  )
}
export default App;

