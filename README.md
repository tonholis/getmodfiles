#Get Modified Files

I created this script for personal use, but could be useful to the community,
It lists all modified files on a given folder and a given start date.

##How to run?

1. npm install 
2. Run the the script in the terminal like:

	`node getmodfiles.js <path> <start-date> <output-type>`
		
	`<path>`

    Absolute path for search

    
    `<start-date>`

    Start date in format: **yyyy-mm-dd** 

	
	`<output-type>`

    * 'text' will generate a text report with a list of modified files - DEFAULT

    * 'copy' will generate a 'copy' folder with the modified files

    * 'both' will generate a text report and a copy folder
