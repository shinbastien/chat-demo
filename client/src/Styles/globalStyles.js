import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
    *{
        box-sizing: border-box;
    }
    html{
        font-size: 16px;
        width: 100%;
        &:lang(ko) {
            font-family: 'Do Hyeon', sans-serif;
        }
        &:lang(en){
            font-family: 'Lobster', cursive;
        }
    }
    body{
        background-color: ${(props) => props.theme.bgColor};
        width: 100%;
    }
    a{
        text-decoration: none;
    }
    input:focus{
        outline: none;
    }
`;

export default GlobalStyles;
