# LingView 

The [initial LingView project](https://github.com/BrownCLPS/LingView) was developed at Brown University [(Pride, Tomlin and AnderBois 2020)](http://hdl.handle.net/10125/24916) as part of the A'ingae Language Documentation initiative. It is a web interface for displaying pre-existing ELAN and FLEx files, optionally with time-synced video and audio. Users can toggle the level of detail they’d like displayed at any given time. LingView also provides a search function that allows users to quickly look through tiers and find time-stamped instances of strings of interest. 

This fork of the project provides a way to display Kanien'kéha language documentation in a more user-friendly interface. It supplies some introductory context regarding the language and a glossary. The code in this repository can be used to set up a local instance of LingView or as a jumping off point for hosting your own website. 

We can offer technical support should you encounter any issues with your ELAN files. Unfortunately, the same is not true for the FLEx file format since it was not used during the development of this fork. In such a case, it would be best to get in touch with the original team.  

Front-end code written with [ReactJS](https://reactjs.org/). 

## Kanien'kéha LingView 
If you are an end-user looking to access the Kanien'kéha LingView website produced as a final project for LING 415/610 at McGill University, Fall 2023, it can be found [here](https://kanienkeha-lingview.lingspace.org/#/). It displays the captioned video “Teharenhsáhkhwa”.  

## Setting up an offline instance of LingView 
1. Install Node.js and NPM from [nodeJs.org/en/download.](nodeJs.org/en/download). Select the appropriate installer package to download and run. The version should be at least 16.

If you are unsure what architecture your computer uses, you can check by following these steps.  

If you are running Windows: Open Settings > About Look at "Device specifications". The information of interest will be listed under "system type".  

If you are running macOS: Open Apple Menu > About this mac  
Look at "Chip" or "Processor". An Intel chip is x64 while an Apple silicon chip like M1, M2, M3, M4 is ARM64. 

2. Clone the repository.

You can either install [git](https://git-scm.com/install/) or [Github Desktop.](https://desktop.github.com/download/)

If you have chosen to download git: Open File Explorer or Finder and navigate to the location in your file directory where you would like to clone the repository. Right-click (or Control-click) and select "Open in Terminal" Run the command: git clone https://github.com/BrownCLPS/LingView.git 

If you chosen to download Github Desktop (which provides a user-friendly interface): Open the application and sign into your Github account. Select the option "Clone a Repository from the Internet..." then click on the URL tab. Paste https://github.com/BrownCLPS/LingView.git into the “Repository URL or GitHub username and repository” field. For “Local path”, click “Choose...” and select the folder where you would like to clone the repository folder. Select “for my own purposes” when asked “how are you planning to use this fork”  

3. Installing the node packages.

In File Explorer or Finder, navigate to your root directory (the cloned LingView repository). Right-click (or Control-click) and select "Open in Terminal". Run the command: npm install  

This will install all the node modules required by our program. 

Add your own pre-existing transcription files to the appropriate data folder. Ensure that your media files share names with their associated transcription files for LingView to be able to properly link them and display them together. 

The first time you use the site, and after each time you make changes, you'll need to rebuild the LingView site. To do so, type the command npm run quick-build in the repository's root directory. To view the website in your browser, open the index.html file. 

## Setting up an online instance of LingView
1. Sign into your GitHub account, or create a GitHub account at https://github.com/. 
2. Fork the LingView repository at https://github.com/austinwkraft/LingView. Make sure to uncheck the “Copy the main branch only” option.
3. Configure your new (forked) repository for publishing through GitHub Pages. This process, done through the “Settings” > “Pages” tab of the repository you’ve forked, will allow you to create the domain name for the website. Select “gh-pages” as the source branch.
4. In the repository’s directory, go to the “data” subdirectory. Add any pre-existing ELAN .eaf files to the “elan_files” subdirectory. Add any pre-existing FLEx files to the “flex_files” subdirectory. Note that LingView supports both ELAN and FLEx files. In the development of Kanien’kéha LingView, we have only used ELAN files.
5. One option for hosting files smaller than 2GB is to attach them as assets to a Github “release”. Scroll to the “releases” section in the right sidebar of your online Github repository. Create a new release. Upload your large file to the section of the release notes “Attach binaries by dropping them here or selecting them”. You’ll be able to get the permanent online address of your file by right- or control-clicking on the file and copying the link.  
6. Also within the “data” subdirectory, add any associated media files to the “media_files” subdirectory. Note that a media file and its associated transcription file must have the same filename. For example, if you use an ELAN transcription file “cooking_story.eaf” then the associated .mp3 audio file should have the name “cooking_story.mp3”. The matching names are LingView’s way of pairing the appropriate files. If your media files are larger than 25mb, you will not be able to upload them directly to your repository. This is often the case for video files. You can instead create a file with a custom .videourl extension. It should be a file whose body consists only of the link to your video.
7. Ensure that the build and deploy actions run after adding these new files.
8. Visit the web address associated with this LingView repository, using the domain name you established in step 3.
9. Continue to customize the files according to your project and interests. In getting started, visit “jsx” > “App”. In this subdirectory, you can edit the included JavaScript files to, for instance, update the content of the “About” page. Second, you can change colours and other display settings in the “css” subdirectory, in the “main.css” file. 

## Resources
For an overview of the software, its potential uses, and the circumstances and design principles of its creation, see the original [paper](http://hdl.handle.net/10125/24916).

For how-to's and troubleshooting, check their [wiki](https://github.com/BrownCLPS/LingView/wiki). 

If you encounter any issues with LingView or have any feedback for improvement, please send correspondence to the following email address: austin.kraft\[at]mail.mcgill.ca 
