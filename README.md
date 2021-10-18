
# Web-Scraping

// the purpose of this project is to extract information of worldcup 2019 from cricinfo and present
// that in the form of excel and pdf scorecards
// the real purpose is to learn how to extract information and get experience with js.

run the command "node 1_CricinfoExtractor.js --excel=Worldcup.csv --dataFolder=data --source=https://www.espncricinfo.com/series/icc-cricket-world-cup-2019-1144415/match-results" to see the prject take out data and form Excel sheet, and Pdf results in real time.


npm libraries used :- 
minimist, 
 axios,
 jsdom,
 excel4node,
 pdf-lib,
 fs

-- Run using - node 1_CricinfoExtractor.js --excel=Worldcup.csv --dataFolder=data --source=https://www.espncricinfo.com/series/icc-cricket-world-cup-2019-1144415/match-results 
