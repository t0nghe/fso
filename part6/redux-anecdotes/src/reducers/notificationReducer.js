let timer = null

const initialState = 'Please take note: This is a notification. And it is working.'

export const notificationReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET":
            return action.text
        case "REMOVE":
            return null
        default:
            return state
    }
}

export const setNotification = (text, time) => {
    const ms = time * 1000 // Convert 

    if (timer != null) {
        clearTimeout(timer)
    }
    return async dispatch => {
        dispatch({
            type: 'SET',
            text
        })
        timer = setTimeout(() => {
            dispatch(removeNotification())
        }, ms)
    }
}

export const removeNotification = () => {
    return { type: 'REMOVE'}
}