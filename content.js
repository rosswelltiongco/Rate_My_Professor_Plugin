const form = document.querySelector('form');
form.addEventListener('submit', updateText);

function updateText(e) {
    e.preventDefault();

    var information = "";


    

    chrome.runtime.getPackageDirectoryEntry(function (root) {
        root.getFile("ids.txt", {}, function (fileEntry) {
            fileEntry.file(function (file) {
                var reader = new FileReader();
                reader.onloadend = function (e) {
                    information = this.result;
                    
                };
                reader.readAsText(file);
            });
        });
    });

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabArr) {
        let id = tabArr[0].id;
        chrome.tabs.executeScript(id, { file: 'code.js' }, function () {
            chrome.tabs.sendMessage(id, {function: "createLinks", information: information});
        });
    });


}