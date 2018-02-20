const form = document.querySelector('form');
form.addEventListener('submit', updateText);

function updateText(e){
    e.preventDefault();

    const find = document.querySelector('#find').value;
    const replace = document.querySelector('#replace').value;
    console.log(find + replace);

    chrome.tabs.executeScript({
        file: 'code.js'
    });
}
