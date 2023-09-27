let leagueObjects;
let countryNameList;

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
        createCountryList(result.response);
    } catch (error) {
        console.error(error);
    }
}


function createCountryList(countryList) {
    countryNameList = countryList.map(country => country.name);
    document.getElementById("leagues-select").innerHTML = `
    <select class="select-menu" onchange= "loadLeagues(this.value)">
        <option>Select The Country</option>
        ${countryNameList.map(function (country) {
            return `<option>${country}</option>`
        }).join('')}
    </select>
    `;
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


function createLeagueList(leagueList) {
    const leagueListNames = leagueList.map(league => league.league.name);
    const leagueIdNumber = leagueList.map(league => league.league.id);
    document.getElementById("leagues-select").innerHTML = `
    <select class="select-menu" onchange = "loadLeagueResults(findLeagueId(this.value))">
        <option>Select The League</option>
        <option>Back to Countries</>
        ${leagueListNames.map(function (league) {
            return `<option>${league}</option>`
        }).join('')}
    </select>
    `;
}


async function loadLeagueResults(id) {
    if (id != -1) {
        try {
            const response = await fetch(`https://api-football-v1.p.rapidapi.com/v3/standings?season=2022&league=${id}`, options);
            const result = await response.json();
            console.log(result);
            displayLeagueResults(result.response);
        } catch (error) {
            console.log(error)
        }
    } else {
        document.getElementById('results').innerHTML = `<div></div>`
    }
}


function findLeagueId(leagueName) {
    if (leagueName == "Back to Countries") {
        start();
        return -1
    } else {
        const matchingleague = leagueObjects.find(league => league.name === leagueName);
        const matchingId = matchingleague.id;
        //console.log(matchingId);
        return matchingId
    }
}

function displayLeagueResults(leagueName) {
    if (leagueName.length == 1) {
        document.getElementById('results').innerHTML = 
        `
        <ol class= "league-list">
            ${leagueName[0].league.standings[0].map(function (teams) {
                return `<li class="list-item">${teams.team.name} <img src="${teams.team.logo}"></li>`
            }).join('')}
        </ol>
        }
        `
    } else {
       document.getElementById('results').innerHTML = `
        <div class="no-standings">No League Standings for this League. Not a Traditional League.</div>
        ` 
    }
}


start();