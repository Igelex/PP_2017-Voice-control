/*
* Bind needed Libraries in HTML
* */
export default function () {
    let script = document.createElement('script');
    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js';
    document.getElementsByTagName('head')[0].appendChild(script);
}