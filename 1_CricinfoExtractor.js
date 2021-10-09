

// node 1_CricinfoExtractor.js --excel=Worldcup.csv --dataFolder=data --source=https://www.espncricinfo.com/series/icc-cricket-world-cup-2019-1144415/match-results 

let minimist = require("minimist");
let axios = require("axios");
let jsdom = require("jsdom");
let excel = require("excel4node");
let pdf = require("pdf-lib");
let fs = require("fs");
//const { exec } = require("child_process");

let args = minimist(process.argv);

// donwload using axios
// read using jsdom
// make excel using excel4node
// make pdf using pdf-lib

let responseKaPromise = axios.get(args.source);
responseKaPromise.then(function(response){
    let html = response.data;

    let dom = new jsdom.JSDOM(html);
    let document = dom.window.document;

    let matches = [];
    let matchScoreDivs = document.querySelectorAll("div.match-score-block");
    for(let i = 0; i < matchScoreDivs.length; i++){
        let match = {
        };

        let namePs = matchScoreDivs[i].querySelectorAll("p.name");
        match.t1 = namePs[0].textContent;
        match.t2 = namePs[1].textContent;

        let scoreSpans = matchScoreDivs[i].querySelectorAll("div.score-detail > span.score");
        if(scoreSpans.length == 2){
            match.t1s = scoreSpans[0].textContent;
            match.t2s = scoreSpans[1].textContent;
        } else if(scoreSpans.length == 1){
            match.t1s = scoreSpans[0].textContent;
            match.t2s = "";
        } else {
            match.t1s = "";
            match.t2s = "";
        }

        let spanResult = matchScoreDivs[i].querySelector("div.status-text > span");
        match.result = spanResult.textContent;

        matches.push(match);
        // console.log(i);
    }

    // console.log(matches);
    let teams = [];

        for(let i = 0 ; i < matches.length ; i++){
            populateTeams(teams, matches[i]); //puts individual team in teams array if missing
        }

        for(let i = 0 ; i < matches.length ; i++){
            putMatchesInAppropriateTeam(teams, matches[i]); //puts individual team in teams array if missing
        }

    //console.log(JSON.stringify(teams));
    let teamsJSON = JSON.stringify(teams);
    fs.writeFileSync("teams.json", teamsJSON, "utf-8");   

    //Here I'll create excel file 
    createExcelfile(teams);
    

}).catch(function(err){
    console.log(err);
})

function populateTeams(teams, match){ // from matches array to teams array
    // let t1idx = teams.findIndex(function(team){   //A loop runs on teams array, and returns each team to function
    //     if(team.name == match.t1){   //we check team's name is similar to t1 team of match array's element or not
    //         return true;
    //     } else {
    //         return false;
    //     }
    // });
    let t1idx = -1;
    for(let i = 0 ; i < teams.length ; i++){
        if(teams[i].name == match.t1){
            t1idx = i;
            break;
        }
    }

    if(t1idx == -1){
        let team = {
            name: match.t1,
            matches:[]
        };
        teams.push(team);
    }

    
    let t2idx = -1;
    for(let i = 0 ; i < teams.length ; i++){
        if(teams[i].name == match.t2){
            t2idx = i;
            break;
        }
    }
    if(t2idx == -1){
        let team = {
            name: match.t2,
            matches:[]
        };
        teams.push(team);
    }

    
}

function putMatchesInAppropriateTeam(teams, match){
    let t1idx = -1;
    for(let i = 0 ; i < teams.length ; i++){
        if(teams[i].name == match.t1){
            t1idx = i;
            break;
        }
    }

    let team1 = teams[t1idx];
    //console.log(team1);
    team1.matches.push({
        vs: match.t2,
        selfScore: match.t1s,
        oppScore: match.t2s,
        result: match.result
    });
     

    let t2idx = -1;
    for(let i = 0 ; i < teams.length ; i++){
        if(teams[i].name == match.t2){
            t2idx = i;
            break;
        }
    }

    let team2 = teams[t2idx];
    team2.matches.push({
        vs: match.t1,
        selfScore: match.t2s,
        oppScore: match.t1s,
        result: match.result
    });

}

function createExcelfile(teams){
    let wb = new excel.Workbook();

    for(let i = 0 ; i < teams.length ; i++){
        let sheet = wb.addWorksheet(teams[i].name);
        
        sheet.cell(1,1).string("VS");
        sheet.cell(1,2).string("Self score");
        sheet.cell(1,3).string("Opp Score");
        sheet.cell(1,4).string("Results");

        for(let j = 0 ; j < teams[i].matches.length ; j++){
            sheet.cell(j+3,1).string(teams[i].matches[j].vs);
            sheet.cell(j+3,2).string(teams[i].matches[j].selfScore);
            sheet.cell(j+3,3).string(teams[i].matches[j].oppScore);
            sheet.cell(j+3,4).string(teams[i].matches[j].result);
        } 
    }
    wb.write(args.excel);
}


//Rajat Verma ----