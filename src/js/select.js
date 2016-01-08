//http://stackoverflow.com/questions/1173194/select-all-div-text-with-single-mouse-click

function selectText(containerid) {
    if (window.getSelection) {
        var range = document.createRange();
        range.selectNode(document.getElementById(containerid));
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
    } else if (document.selection) {
        var range = document.body.createTextRange();
        range.moveToElementText(document.getElementById(containerid));
        range.select();
    }  
}