import { useEffect, useState } from "react"
import { getRepos } from "../utils/github"
import Dashboard from "./Dashboard"
import { githubLogOut, getCurrentUser } from "../utils/firebase"
import styled, { ThemeProvider } from 'styled-components'
import Header from "../components/Header.js";

import { lightTheme, darkTheme } from '../components/themes/themes'
import { useDarkTheme } from '../components/themes//toggle/UseDarkTheme'
import ThemeToggle from "../components/themes/toggle/toggleTheme"

const Wrapper = styled.div`
margin: 0;
display: flex;
flex-direction: column;
width: 100vw;
min-height: 100vh;
max-height: fit-content;
background: ${({ theme }) => theme.body};
color: ${({ theme }) => theme.fontColor};


&>h1 {
    text-align: center;
    font-size: 4rem;
    margin-bottom: 0;
    margin-top: 100px;
}
&>h3 {
    margin-top: 0;
    text-align: center;
    font-size: 1.6rem;
}

@media (max-width:1200px) {

    
    &>h1 {
        font-size: 2rem;
    }
    &>h3 {
        font-size: 1rem;
        
        
    }
}

`;

const Buttons = styled.div`
    width: fit-content;
    z-index: 10;

&>button {
    position: relative;
    padding: 8px 12px;
    outline: none;
    width: fit-content;
    z-index: 10;
    margin-left: 1rem;

    @media (max-width: 768px) {
       padding: 2px 4px;
       font-size: 0.6rem;
    }
}
`;

const RepoList = styled.div`
margin: 0 auto;
width: 90%;
display: flex;
flex-flow: row wrap;
justify-content: center;



@media (max-width:900px) {
    
    width: 90%;
    }
`;

/* const RepoList = styled.div`
margin: 0 auto;
padding: 1rem;
width: 90%;
height: 80vh;
display: flex;
flex-flow: row wrap;
justify-content: center;
overflow-y: auto;

// glassmorph effect
    box-sizing: border-box;
    // width: 250px;
    // height: 250px;
    border: 2px solid rgba(0, 0, 0, .15);
    border-radius: 5px 5px 5px 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, .25), inset 0 0 2px 0px white;
    background: rgba(0, 0, 0, .0125);
    backdrop-filter: blur(13px);
    -webkit-backdrop-filter: blur(3px);

`; */

const Card = styled.div`
display: flex;
  height: 280px;
  width: 200px;
  background-color: ${({ theme }) => theme.primaryCards};
  border-radius: 10px;
  box-shadow: -1rem 0 3rem #000;
/*   margin-left: -50px; */
  transition: 0.4s ease-out;
  position: relative;
  left: 0px;

  &:hover {
    transform: translateY(-20px);
  transition: 0.4s ease-out;
  
  }

 /* &:not(:first-child) {
    margin-left: -50px;
  } */

  &:hover ~ & {
    position: relative;
    left: 50px;
    transition: 0.4s ease-out;
  }

  @media (max-width:900px) {
    height: 160px;
    width: 100px;
        
    }
}
  `;


const Title = styled.div`
color: ${({ theme }) => theme.fontColor};
font-weight: 600;
position: absolute;
left: 20px;
top: 15px;

@media (max-width:1200px) {
    left: 10px;
    font-size: 0.8rem;
    word-break: break-all;
    }

`;

const Bar = styled.div`
position: absolute;
  top: 100px;
  left: 20px;
  height: 5px;
  width: 150px;

  @media (max-width:1200px) {
    left: 10px;
    width: 90px;
        
    }

  `;

const EmptyBar = styled.div`
  background-color: #2e3033;
  width: 90%;
  height: 100%;

  `;

const FilledBar = styled.div`
  position: absolute;
  top: 0px;
  z-index: 3;
  width: 3px;
  height: 100%;
  background: rgb(0,154,217);
  background: linear-gradient(90deg, rgba(0,154,217,1) 0%, rgba(217,147,0,1) 65%, rgba(255,186,0,1) 100%);
  transition: 0.6s ease-out;

  ${Card}:hover & {
    width: 120px;
    transition: 0.4s ease-out;
  }
 
  `;


/* const RepoPreview = styled.div`
    width: 20%;
    padding: 0.5rem 1rem;
    margin: 1rem 1rem;
    border: 1px solid #e1e2e3;

    // glassmorph styling for "buttons"
    border: 2px solid rgba(0, 0, 0, .15);
    // border-radius: 25px 25px 25px 25px;
    box-shadow: 0 0 10px rgba(0, 0, 0, .25), inset 0 0 2px 0px white;
    background: rgba(0, 0, 0, .0125);
    backdrop-filter: blur(13px);
    -webkit-backdrop-filter: blur(3px);
    
    text-transform: uppercase;

    &>h3 {
        text-align: center;
    }
    @media (max-width:1200px) {

        width: 80%;
        &>h3 {
            font-size: 1rem;
            word-break: break-all;
            
        }
    }

&:hover {
    box-shadow: 2px 3px 6px rgba(223, 217, 217, 0.603);
}
`; */

const Overview = () => {

    const [selectedRepo, setSelectedRepo] = useState()
    const [repos, setRepos] = useState()
    const [admin, setAdmin] = useState()

    useEffect(async () => {
        await getCurrentUser()
            .then(res => {
                getRepos(res.username)
                    .then(res => {
                        setRepos(res)
                    })
                setAdmin(res.admin)
            })
        /*  */
    }, [])

    const [theme, themeToggler] = useDarkTheme();

    const themeMode = theme === 'light' ? lightTheme : darkTheme;

    return (
        <ThemeProvider theme={themeMode}>
            <Header gridArea="header" members={[""]}>
                <Buttons>
                    <button onClick={githubLogOut}>Log Out</button>
                    {selectedRepo ? <button onClick={() => setSelectedRepo()}>Back to Overview</button> : null}
                </Buttons>
                <ThemeToggle theme={theme} toggleTheme={themeToggler} />
            </Header>
            {
                selectedRepo ? <Dashboard repo={selectedRepo}></Dashboard>
                    : repos ?
                        <Wrapper>
                            <h1>Repository Overview</h1>
                            <h3>Select a repository {`&`} continue to dashboard or log out</h3>
                            <RepoList >
                                {
                                    repos.map(repo => {
                                        return (
                                            <Card onClick={() => setSelectedRepo(repo.url)}>
                                                <Title>{repo.name}</Title><Bar><EmptyBar></EmptyBar><FilledBar></FilledBar></Bar>
                                            </Card>

                                        )

                                    })
                                }
                            </RepoList>
                        </Wrapper>
                        : null
            }
        </ThemeProvider>
    )



}

export default Overview
