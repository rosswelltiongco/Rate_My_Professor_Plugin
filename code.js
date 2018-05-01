
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    
    var names = [];

    if(message.function == "createLinks"){
        ids = JSON.parse(message.information);
        createLinks(ids);
        return;
    }
    else if(message.function == "scrapeRMP"){
        let newTitle = scrapeRMP();
        let response = {info: newTitle}
        console.log(response);
        sendResponse(response);
    }
    else if(message.function == "updateTitle"){
        let professor_id = message.professorID;
        let professor_info = message.info;

        updateButtonTitle(professor_id, professor_info);
    }
    
    
    var unique = [];

    //Here is how you access the temporary memory to get the latest array of professor links
    chrome.storage.sync.get('professors', function(result){
        names = result.professors;
        //You actually need to put the rest of the code in here because this code is asynchronous
    });


    unique = names.filter(function(elem, index, self) { // removes duplicates from names array
        return index === self.indexOf(elem);
    })

    for(var i=0; i<unique.length;i++){ // for each index in unique array, open a tab. (opens an error tab for proessors not in RMP ids.txt files) 
        var redirectWindow = window.open(unique[i], '_blank');
        redirectWindow.location;
        console.log(unique[i]);
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

        let current_id = ids[profName]

        let profLink = "http://ratemyprofessors.com/ShowRatings.jsp?tid=" + current_id + "&amp;showMyProfs=true";

        if(profName != 'Staff'){ // only adds non Staff names links to the names array which contains duplicates
            names.push(profLink);
        }

        let current_button = buttonId + i

        prof.innerHTML = prof.innerHTML + "<br><button type='button' title=\"I am a tooltip!\"  id=\"" + current_button + "\" name=\""+profLink+"\">RMP</button><br>";
        
        //Add event listener to button
        let button = document.getElementById(current_button);
        button.addEventListener('click', openNewTab);

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
    });
    
    
    unique = names.filter(function(elem, index, self) { // removes duplicates from names array
        return index === self.indexOf(elem);
    })

    for(var i=0; i<unique.length;i++){ // for each index in unique array, open a tab. (opens an error tab for proessors not in RMP ids.txt files) 
        var redirectWindow = window.open(unique[i], '_blank');
        redirectWindow.location;
        console.log(unique[i]);
    }
}

function openNewTab(e){

    window.open(e.target.name);
    let id = e.target.id
    let object = {'last': id};
    localStorage.setItem('last', id);
}

function updateButtonTitle(id, new_title){
    
    console.log("Prof id to be searched: " + id);
    console.log(new_title);

    let button_id = localStorage.getItem("last");

    console.log(new_title.substring(17,20));

    let button = document.getElementById(button_id);
    button.title = new_title;
}
