
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    var i = 0;
    var id = "MTG_INSTR$" + i;
    var prof = document.getElementById(id);
    var ids = JSON.parse(message);
    var names = []
    var unique = []
    var buttonId = "button_";

    while (prof != null) {

        i++;

        let profName = prof.innerHTML;

        console.log(profName)

        let profLink = "http://ratemyprofessors.com/ShowRatings.jsp?tid=" + ids[profName] + "&amp;showMyProfs=true";

        if(profName != 'Staff'){ // only adds non Staff names links to the names array which contains duplicates
            names.push(profLink);
        }

         prof.innerHTML = prof.innerHTML + "<br><button type='button' title=\"I am a tooltip!\"  id=\"" + buttonId + i + "\" onclick=\" window.open('" + profLink + "','_blank')\" >RMP</button><br>";
		//Fixme: look into 
        id = "MTG_INSTR$" + i;
        prof = document.getElementById(id);
    }



    unique = names.filter(function(elem, index, self) { // removes duplicates from names array
        return index === self.indexOf(elem);
    })

    for(var i=0; i<unique.length;i++){ // for each index in unique array, open a tab. (opens an error tab for proessors not in RMP ids.txt files) 
        var redirectWindow = window.open(unique[i], '_blank');
        redirectWindow.location;
        console.log(unique[i]);
    }
    
});

