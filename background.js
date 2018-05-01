var prof_id;
var last_tabID;

chrome.tabs.onUpdated.addListener(function(){
    
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabArr) {
        let id = tabArr[0].id;
        if(last_tabID == id){
            console.log("repeat")
            return;
        }
        else{
            console.log("different");
            last_tabID = id;
        }
        let url = tabArr[0].url
       
        if(url.length >= 61){

            if(url.substring(0,28) == "https://cmsweb.cms.csulb.edu"){
                localStorage.setItem("myCSULB_tabID", id);
            }
            else if(url.substring(0,69) == "http://www.ratemyprofessors.com/ShowRatings.jsp?showMyProfs=true&tid="){
                prof_id = url.substring(69);
                console.log(prof_id);
                console.log(localStorage.getItem("myCSULB_tabID"));

                chrome.tabs.executeScript(id, { file: 'code.js' }, function () {
                    chrome.tabs.sendMessage(id, {function: "scrapeRMP"}, function(rsp){
                        
                        let prof_info = rsp.info;
                        // let prof_info = rsp.info;
                        if(prof_info == "N/A"){

                        }
                        else if(prof_id == undefined){

                        }
                        else{
                            other_id = parseInt(localStorage.getItem("myCSULB_tabID"))
                            console.log("myCSULB is at: " + other_id);
                            chrome.tabs.executeScript(other_id, { file: 'code.js' }, function () {
                                console.log("Sending message");
                                chrome.tabs.sendMessage(other_id, {function: "updateTitle", professorID: prof_id, info: prof_info});
                            });
                        }
                    });
                });
            }
        }
    });

});




