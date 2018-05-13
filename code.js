
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    
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
    else if(message.function == "openTabs"){
        openTabs();
    }

       
});

function createLinks(ids){
    var i = 0;
    var id = "MTG_INSTR$" + i;
    var prof = document.getElementById(id);
    const linkId = "link_";
    var names = [];
    var profNames = [];
    var buttonId = "button_"

    if(prof.innerHTML.length > 30){
        return;
    }

    while (prof != null) {

        i++;

        let profName = prof.innerHTML;

        let current_id = ids[profName]

        let profLink = "http://ratemyprofessors.com/ShowRatings.jsp?tid=" + current_id + "&amp;showMyProfs=true";

        // if(profName != 'Staff'){ // only adds non Staff names links to the names array which contains duplicates (used for openTabs function to filter array)
        //     profNames.push(profName);
        //     names.push(profLink);
        // }

        // if(profName === 'Staff'){ (helps to move on to next button to update if profName is Staff)
        //     let current_button = buttonId + i;
        //     id = "MTG_INSTR$" + i;
        //     prof = document.getElementById(id);  
        //     continue;
        // }

        let current_button = buttonId + i       

        prof.innerHTML = "<a title=\"I am a tooltip!\" id="+current_button+" href= "+profLink+" rel=\"noopener noreferrer\" target=\"_blank\" prof="+ids[profName]+">"+profName+"</a>";
        
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

    chrome.storage.sync.set({'professorNames': profNames},function(){
        console.log("set professor names");
    });

}

 function scrapeRMP(){
    let grades = document.getElementsByClassName("grade");
    let scrapedInfo = "Overall Quality: " + grades[0].innerHTML + "\n" + "Would Take Again: " + grades[1].innerHTML.replace(/\s/g,'') + "\n" + "Difficulty: " + grades[2].innerHTML.replace(/\s/g,'');
    
    return scrapedInfo;
 }
function clickButton(i){
    var baseMultiplier = 2000;
    var button = document.getElementById('button_'+i);
    setTimeout(function(){button.click();},baseMultiplier*i);
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
            console.log(redirectWindow);
        }

        

    });
    // var nameMemory = new Set();
    // var i = 0;
    // var id = "MTG_INSTR$" + i;
    // var prof = document.getElementById(id);
    // var buttonId = "button_"
    

    // while(prof != null){
    //     var profName = prof.innerHTML;
    //     i++;
    //      if( (i+1) >= 10 ){
    //           profName = prof.innerHTML.substring(172);
    //      }
    //      else{
    //           profName = prof.innerHTML.substring(173);
    //      }
    //      console.log(profName);
    //      if(nameMemory.has(profName) == false){
    //         clickButton(i);
    //         nameMemory.add(profName);
    //      }
    //     //Fixme: look into 
    //     id = "MTG_INSTR$" + i;
    //     prof = document.getElementById(id);
    // }

    // console.log(nameMemory);
    // var currentButt = document.getElementById(buttond+i++);
    // var nextButt = document.getElementById(buttond+3);
    // console.log(id.innerHTML);
    // currentButt.click();
    // i = i+2;
    // console.log('button' + i);
    // setTimeout(function(){nextButt.click();},1500);
    

}

function openNewTab(e){

    let id = e.target.id;
    let name = e.target.innerHTML;
    let title = e.target.title;

    if(title == "I am a tooltip!"){
        let object = {'last': name};
        localStorage.setItem('last', name);
    }
    else{
        localStorage.setItem('last', 'N/A');
    }

    
}

function updateButtonTitle(prof_id, new_title){
    var name = localStorage.getItem("last");
    var i = 1;    
    var buttonId = "button_"

    if(name == "N/A"){
        return;
    }

    else{
        console.log("Prof name to be searched: " + name);
        console.log(new_title);

        
        var currentButton = document.getElementById(buttonId+i++);

        while(currentButton != null){
            if(currentButton.innerHTML == name){
                currentButton.title = new_title;
                let grade = new_title.substring(17,20);
                floatGrade = parseFloat(grade);
                if(floatGrade >= 3.5){
                    currentButton.innerHTML = currentButton.innerHTML + " " + "<span style = 'color: #0BB112;'><b>" +grade+ "</b></span>";
                    
                }
                if(floatGrade >= 2.5 && grade < 3.5){
                    currentButton.innerHTML = currentButton.innerHTML + " " + "<span style = 'color: #ECE505;'><b>" +grade+ "</b></span>";
                    
                }
                if(floatGrade < 2.5){
                    currentButton.innerHTML = currentButton.innerHTML + " " + "<span style = 'color: #CF3602;'><b>" +grade+ "</b></span>";
                    
                }
               
            }

            currentButton = document.getElementById(buttonId+i++);
        }

        localStorage.setItem('last', 'N/A');
    }
    
    
}