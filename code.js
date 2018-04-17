
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    var i = 0;
    var id = "MTG_INSTR$" + i;
    var prof = document.getElementById(id);
    var ids = JSON.parse(message);

    var buttonId = "button_";

    while (prof != null) {

        i++;

        let profName = prof.innerHTML;

        console.log(profName)

        let profLink = "http://ratemyprofessors.com/ShowRatings.jsp?tid=" + ids[profName] + "&amp;showMyProfs=true";


        prof.innerHTML = prof.innerHTML + "<br><button type='button' title=\"I am a tooltip!\"  id=\"" + buttonId + i + "\" onclick=\" window.open('" + profLink + "','_blank')\" >RMP</button><br>";
		//Fixme: look into 
        id = "MTG_INSTR$" + i;
        prof = document.getElementById(id);
    }
});

