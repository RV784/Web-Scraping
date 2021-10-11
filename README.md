-Hi, this web-scraping project as the name suggests , is taking out chunks of data from the website - "https://www.espncricinfo.com/series/icc-cricket-world-cup-2019-1144415/match-results" and stores it into one nicely laid out Excel sheet, and seperate results in form of pdf. 

-Although Excel sheet is already in the repo, You can delete it ans run the program again to see it take form in real time!


# Web-Scraping
npm libraries needed :- 
("minimist"),
("axios"),
("jsdom"),
("excel4node"),
("pdf-lib"),
("fs")

-- Run using - node 1_CricinfoExtractor.js --excel=Worldcup.csv --dataFolder=data --source=https://www.espncricinfo.com/series/icc-cricket-world-cup-2019-1144415/match-results 
