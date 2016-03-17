var editor;
window.onload = function () {

    editor = com.wiris.jsEditor.JsEditor.newInstance({
    'language': 'en'
    });
    editor.insertInto(document.getElementById('editorContainer'));

    MathJax.Hub.Config({
        CommonHTML : {
            scale: 200
        },
        "HTML-CSS": {
            preferredFont: "TeX"
        }
    });
}