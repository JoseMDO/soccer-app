let leagueObjects;

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '2662e1daedmsh48d309a33dda788p1d1bddjsn1c9fd5ab4bb0',
		'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
	}
};

async function start() {
    try {
        const response = await fetch('https://api-football-v1.p.rapidapi.com/v3/countries', options);
        const result = await response.json();
        console.log(result);
        createCountryList(result.response);
    } catch (error) {
        console.error(error);
    }
}

async function loadLeagues(country) {
    try {
        const response = await fetch(`https://api-football-v1.p.rapidapi.com/v3/leagues?country=${country}`, options);
        const result = await response.json();
        console.log(result);
        leagueObjects = result.response.map(league => ({name: league.league.name, id: league.league.id}));
        createLeagueList(result.response);
    } catch (error) {
        console.error(error);
    }
}

async function loadLeagueResults(id) {
    try {
        const response = await fetch(`https://api-football-v1.p.rapidapi.com/v3/standings?season=2022&league=${id}`, options);
        const result = await response.json();
        console.log(result);
        displayLeagueResults(result.response);
    } catch (error) {
        console.log(error)
    }
}


start();

function createCountryList(countryList) {
    const countryNameList = countryList.map(country => country.name);
    document.getElementById("leagues").innerHTML = `
    <select onchange= "loadLeagues(this.value)">
        <option>Select The League</option>
        ${countryNameList.map(function (country) {
            return `<option>${country}</option>`
        }).join('')}
    </select>
    `;
}


function createLeagueList(leagueList) {
    const leagueListNames = leagueList.map(league => league.league.name);
    const leagueIdNumber = leagueList.map(league => league.league.id);
    console.log(leagueObjects);
    document.getElementById("leagues").innerHTML = `
    <select onchange = "loadLeagueResults(findLeagueId(this.value))">
        <option>Select The League</option>
        ${leagueListNames.map(function (league) {
            return `<option>${league}</option>`
        }).join('')}
    </select>
    `;
}

function findLeagueId(leagueName) {
    const matchingleague = leagueObjects.find(league => league.name === leagueName);
    const matchingId = matchingleague.id;
    console.log(matchingId);
    return matchingId
}

function displayLeagueResults(leagueName) {
    const teamNames = 
    document.getElementById('results').innerHTML = 
    `
    <ol>
        ${leagueName[0].league.standings[0].map(function (teams) {
            return `<li>${teams.team.name}</li>`
        }).join('')}
    </ol>
    `
}