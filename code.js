console.log("tried");

var i = 0;
var id = "MTG_INSTR$"+i;
var prof = document.getElementById(id);

while(prof!=null){  
    prof.innerHTML = "Professor #" + i++;

    id = "MTG_INSTR$"+i;
    prof = document.getElementById(id);
}