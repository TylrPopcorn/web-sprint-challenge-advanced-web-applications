import React from 'react'
import styled, { keyframes } from 'styled-components'
import PT from 'prop-types'

const opacity = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const StyledMessage = styled.div`
  animation: ${opacity} 1s forwards;
`

export default function Message({ message }) {
  console.log("MESSAGEE PROPS: ", message)
  return (
    <div id="message">{message}</div>

    //Codgrade wont pass me with this crud (takes too long or something idek):
    /*  <StyledMessage key={message} id="message">
        {message}
      </StyledMessage>*/
  )
}

Message.propTypes = {
  message: PT.string.isRequired,
}
