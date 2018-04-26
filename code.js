chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

    if(message.function == "createLinks"){
        console.log("hi");
        ids = JSON.parse(message.information);
        createLinks(ids);
        return;
    }
    else if(message.function == "openTabs"){
        openTabs();
    }

       
});

function createLinks(ids){
    console.log(ids);
    var i = 0;
    var id = "MTG_INSTR$" + i;
    var prof = document.getElementById(id);
    const buttonId = "button_";
    var names = [];

    if(prof.innerHTML.length > 30){
        return;
    }

    while (prof != null) {

        i++;

        let profName = prof.innerHTML;

        let profLink = "http://ratemyprofessors.com/ShowRatings.jsp?tid=" + ids[profName] + "&amp;showMyProfs=true";

        if(profName != 'Staff'){ // only adds non Staff names links to the names array which contains duplicates
            names.push(profLink);
        }

        prof.innerHTML = prof.innerHTML + "<br><button type='button' title=\"I am a tooltip!\"  id=\"" + buttonId + i + "\" onclick=\" window.open('" + profLink + "','_blank')\" >RMP</button><br>";
		//Fixme: look into 
        id = "MTG_INSTR$" + i;
        prof = document.getElementById(id);
    }

    //Saving information to temporary memory
    chrome.storage.sync.set({'professors': names}, function(){
        console.log("set professors");
    });

}
 function scrapeRMP(){
    let grades = document.getElementsByClassName("grade");
    let scrapedInfo = "Overall Quality: " + grades[0].innerHTML + "\n" + "Would Take Again: " + grades[1].innerHTML.replace(/\s/g,'') + "\n" + "Difficulty: " + grades[2].innerHTML.replace(/\s/g,'');
    
    return scrapedInfo;
 }
function openTabs(){

    var names = [];

    var unique = [];

    //Here is how you access the temporary memory to get the latest array of professor links
    chrome.storage.sync.get('professors', function(result){
        
        names = result.professors;

        unique = names.filter(function(elem, index, self) { // removes duplicates from names array
            return index === self.indexOf(elem);
        })

        for(var i=0; i<unique.length;i++){ // for each index in unique array, open a tab. (opens an error tab for proessors not in RMP ids.txt files) 
            var redirectWindow = window.open(unique[i], '_blank');
            redirectWindow.location;
        }

    });

}
