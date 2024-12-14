
import React from 'react';
import styled, { keyframes } from 'styled-components';

const typing = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

const blinkCaret = keyframes`
  from, to { border-color: transparent; }
  50% { border-color: black; }
`;

const TypeWriterText = styled.div`
  font-size: ${(props) => props.fontSize || '24px'};
  font-family: monospace;
  white-space: nowrap;
  overflow: hidden;
  border-right: 0.15em solid black;
  width: 0;
  animation: 
    ${typing} ${(props) => props.duration || '4s'} steps(40, end) ${(props) => props.delay || '0s'} forwards, 
    ${blinkCaret} 0.75s step-end infinite;
`;

const TypeWriter = ({ text, fontSize, duration, delay }) => {
  return <TypeWriterText fontSize={fontSize} duration={duration} delay={delay}>{text}</TypeWriterText>;
};

export default TypeWriter;
