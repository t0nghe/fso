import React from 'react'
import { connect } from 'react-redux'

const Notification = (props) => {
  const notification = props.notification
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  return (
    <div style={style}>
      {notification}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    notification: state.notification
  }
}

const ConnectedNotificaton = connect(mapStateToProps)(Notification)
export default ConnectedNotificaton