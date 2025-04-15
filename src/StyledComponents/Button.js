import styled from "styled-components";

const Button = styled.button`
  padding: 8px;
  border: none;
  border-radius: 10px;
  color: white;
  background-color: ${(props) => props.color || "#0d6efd"};
  margin: 5px;
  cursor: pointer;
  align-items: center;
`;
export default Button;
