
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    var i = 0;
    var id = "MTG_INSTR$"+i;
    var prof = document.getElementById(id);
    var ids = JSON.parse(message);

    while(prof!=null){

        i++;

        let profName = prof.innerHTML;

        console.log(profName)

        let profLink = "http://ratemyprofessors.com/ShowRatings.jsp?tid=" + ids[profName] + "&amp;showMyProfs=true";


        prof.innerHTML = "<a class=\"PSLONGEDITBOX\" id=\"MTG_INSTR$0\" href= "+profLink+" rel=\"noopener noreferrer\" target=\"_blank\">"+profName+"</a>";

        id = "MTG_INSTR$"+i;
        prof = document.getElementById(id);
    }
});

