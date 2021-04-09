import InfoBox from "../components/InfoBox.js";
import QuotaBar from "../components/QuotaBar.js";
import Header from "../components/Header.js";
import Card from "../components/Card.js";
import TrelloColumn from "../components/TrelloColumn.js";
import Activity from "../components/Activity.js"
import WeeklyQuota from '../components/WeeklyQuota'
import { useEffect, useState } from 'react';
import { getUsers, createUser, removeUser, githubLogOut } from "../utils/firebase.js"
import { getLanguageData } from "../utils/github.js"
import { getTrelloBoard, postNewCard, getBoardLists } from "../utils/trello.js";



import { Bar, Pie, Line } from 'react-chartjs-2'
import styled from 'styled-components'
/* import { ThemeProvider } from 'styled-components'
import { lightTheme, darkTheme } from '../components/themes/themes'
import  {useDarkTheme} from '../components/themes//toggle/UseDarkTheme'
import { GlobalStyle } from '../components/themes/GlobalStyle'
import ThemeToggle from "../components/themes/toggle/toggleTheme" */


const Grid = styled.div`
  box-sizing: border-box;

  height: 100vh;
  width: 100vw;
  display: grid;

  grid-gap: 5px;

  grid-template-areas:
    "header header header"
    "activity languages burndown"
    "ideas uncompleted-tasks completed-tasks"
    "ideas uncompleted-tasks completed-tasks"
    "sprint-time sprint-time sprint-time";

    /* mobile view */

    @media (max-width: 768px) {
        margin: 2.5%;
        padding: 2%;
        max-width: 95%; 
        display: flex;
        flex-direction: column;
        
        grid-gap: 5px;
      }
`;


const Dashboard = ({ languages }) => {
/* 
  const [theme, themeToggler, mountedComponent] = useDarkTheme(); */
  const [username, setUsername] = useState('')
  useEffect(() => {
    getUsers()
  }, [])

  /* const themeMode = theme === 'light' ? lightTheme : darkTheme;


  if(!mountedComponent) return <div/> */


    // postNewCard('603e3f1761dcdc39c5540536', 'Hello from the other side', 'sven')
    getBoardLists('P6EjDUbm')

  const data = {
    labels: languages ? Object.keys(languages) : [],
    datasets: [{
      label: '# of Votes',
      data: languages ? Object.values(languages) : [],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1
    }]
  }

  return (
    <>
    <Grid className="App">
      <Header gridArea="header" members={["beppe", "jeppe", "beppson"]}>
        {/*<input type="text" value={repoCreator} onChange={event => setRepoCreator(event.target.value)}/>*/}
        {/*<button onClick={doIt}>pressy</button>*/}
      </Header>

      <InfoBox gridArea="activity">
        <Activity />
      </InfoBox>

      <InfoBox gridArea="languages">
        <Pie data={getLanguageData()} />
      </InfoBox>
{/* 
      <InfoBox gridArea="weekly-quota">
        <QuotaBar color="#F9FD53" percent="38" />
        <QuotaBar color="#C39AE3" percent="81" />
        <QuotaBar color="#F3A0A0" percent="65" />
        <QuotaBar color="#6BBD57" percent="15" />
        <QuotaBar color="#87C0E0" percent="97" />
      </InfoBox> */}

     {/*  <InfoBox gridArea="total-contribution">
        <Bar data={data} />
      </InfoBox> */}

      <InfoBox gridArea="burndown">
        <Line
          data={{
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            datasets: [
              {
                label: "First dataset",
                data: [33, 53, 85, 41, 44, 65],
                fill: true,
                backgroundColor: "rgba(75,192,192,0.2)",
                borderColor: "rgba(75,192,192,1)",
              },
              {
                label: "Second dataset",
                data: [33, 25, 35, 51, 54, 76],
                fill: false,
                borderColor: "#742774",
              },
            ],
          }}
        />
      </InfoBox>

      <InfoBox gridArea="sprint-time"></InfoBox>

      <TrelloColumn gridArea="ideas">
        <Card>
          <p>Hello!</p>

        </Card>
      </TrelloColumn>

      <TrelloColumn gridArea="uncompleted-tasks">
      </TrelloColumn>

      <TrelloColumn gridArea="completed-tasks">
        <WeeklyQuota />
      </TrelloColumn>

      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        type="text"
      />
      <button onClick={() => createUser(username)}>create user</button>
      <button onClick={() => removeUser(username)}>remove user</button>
      <button onClick={githubLogOut}>Log out</button>
    </Grid>
    </>
  );
};

export default Dashboard;
