import styled from 'styled-components'
import { Bar, Pie, Line } from 'react-chartjs-2'

import InfoBox from "./components/InfoBox.js";
import QuotaBar from "./components/QuotaBar.js";
import Header from "./components/Header.js";
import Card from "./components/Card.js";
import TrelloColumn from "./components/TrelloColumn.js";

import { useEffect, useState } from 'react';
import Github from "./Github.js";
import { getUsers, createUser, removeUser } from "./Firebase"
import { GITHUB_ACCESS_TOKEN } from "./constants"

const Grid = styled.div`
      box-sizing: border-box;

      height: 100vh;
      width: 100vw;
      display: grid;

      grid-gap: 5px;

      grid-template-areas: 
          "header header header header"
          "languages burndown activity total-contribution"
          "ideas uncompleted-tasks completed-tasks total-contribution"
          "ideas uncompleted-tasks completed-tasks weekly-quota"
          "sprint-time sprint-time sprint-time weekly-quota";`

const data = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [{
    label: '# of Votes',
    data: [12, 19, 3, 5, 2, 3],
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

function App() {

  const [repos, setRepos] = useState([])
  const [githubUsername, setGithubUsername] = useState('')
  const [languages, setLanguages] = useState()
  const [collaborators, setCollaborators] = useState([])

  const [username, setUsername] = useState('')
  useEffect(() => {
    getUsers()
  }, [])

  const fetchRepos = (githubUsername) => {
    setRepos([])
    setLanguages()
    setCollaborators([])
    fetch(`https://api.github.com/users/${githubUsername}/repos`)
      .then(response => {
        return response.json()
      })
      .then(json => {
        json.map(repo => {
          setRepos(repos => [...repos, repo])
        })
      })
  }

  const getLanguages = (githubUsername, repo) => {
    fetch(`https://api.github.com/repos/${githubUsername}/${repo}/languages`)
      .then(res => {
        return res.json()
      })
      .then(json => {
        setLanguages(json)
      })
  }

  const getCollaborators = (githubUsername, repo) => {
    fetch(`https://api.github.com/repos/${githubUsername}/${repo}/collaborators`, {
      method: "GET",
      headers: {
        "Content-type": "application/json;charset=UTF-8",
        "authorization": `token ${GITHUB_ACCESS_TOKEN}`
      }
    }).then(res => {
      return res.json()
    }).then(json => {
      setCollaborators(json)
      console.log(collaborators);
    })
  }

  useEffect(() => {
    console.log(languages);
  }, [languages])

  return (
    <Grid className="App">

      <Header gridArea="header" members={["beppe", "jeppe", "beppson"]}>
        {/*<input type="text" value={repoCreator} onChange={event => setRepoCreator(event.target.value)}/>*/}
        {/*<button onClick={doIt}>pressy</button>*/}
      </Header>

      <InfoBox gridArea="languages">
        <Pie data={data} />
      </InfoBox>

      <InfoBox gridArea="weekly-quota">
        <QuotaBar color="#F9FD53" percent="38" />
        <QuotaBar color="#C39AE3" percent="81" />
        <QuotaBar color="#F3A0A0" percent="65" />
        <QuotaBar color="#6BBD57" percent="15" />
        <QuotaBar color="#87C0E0" percent="97" />
      </InfoBox>

      <InfoBox gridArea="total-contribution">
        <Bar data={data} />
      </InfoBox>

      <InfoBox gridArea="burndown">
        <Line data={{
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets: [
            {
              label: "First dataset",
              data: [33, 53, 85, 41, 44, 65],
              fill: true,
              backgroundColor: "rgba(75,192,192,0.2)",
              borderColor: "rgba(75,192,192,1)"
            },
            {
              label: "Second dataset",
              data: [33, 25, 35, 51, 54, 76],
              fill: false,
              borderColor: "#742774"
            }
          ]
        }} />
      </InfoBox>

      <InfoBox gridArea="activity">
        <Line data={{
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets: [
            {
              label: "First dataset",
              data: [33, 53, 85, 41, 44, 65],
              fill: true,
              backgroundColor: "rgba(75,192,192,0.2)",
              borderColor: "rgba(75,192,192,1)"
            },
            {
              label: "Second dataset",
              data: [33, 25, 35, 51, 54, 76],
              fill: false,
              borderColor: "#742774"
            }
          ]
        }} />
      </InfoBox>

      <InfoBox gridArea="sprint-time">

      </InfoBox>

      <TrelloColumn gridArea="ideas">
        <Card>
          <p>Hello!</p>
        </Card>
      </TrelloColumn>

      <TrelloColumn gridArea="uncompleted-tasks">

      </TrelloColumn>

      <TrelloColumn gridArea="completed-tasks">

      </TrelloColumn>


      {/*<ul>*/}
      {/*    {*/}
      {/*        repos.map(item => {*/}
      {/*            return (*/}
      {/*                <li><a href="http://www.google.com">{item.name}</a></li>*/}
      {/*            )*/}
      {/*        })*/}
      {/*    }*/}
      {/*</ul>*/}
      {/*{*/}
      {/*    Object.entries(repos)*/}
      {/*}*/}
      <input type="text" value={githubUsername} onChange={e => setGithubUsername(e.target.value)} />
      <button onClick={() => fetchRepos(githubUsername)}>fetch repos</button>
      <Github repos={repos} getLanguages={getLanguages} getCollaborators={getCollaborators} githubUsername={githubUsername} languages={languages} collaborators={collaborators} />
      <input value={username} onChange={e => setUsername(e.target.value)} type="text" />
      <button onClick={() => createUser(username)}>create user</button>
      <button onClick={() => removeUser(username)}>remove user</button>
    </Grid>
  );
}

export default App;
