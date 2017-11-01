/*
* Bind needed Libraries in HTML
* */
export default function() {
    console.log('IN Dependencies !!!!!!!!!');
    let scriptJquery = document.createElement('script');
    let scriptAnnyang = document.createElement('script');
    let scriptSpeechKitt = document.createElement('script');
    scriptJquery.src = '//ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js';
    scriptAnnyang.src = '//cdnjs.cloudflare.com/ajax/libs/annyang/2.6.0/annyang.min.js';
    scriptSpeechKitt.src = '//cdnjs.cloudflare.com/ajax/libs/SpeechKITT/0.3.0/speechkitt.min.js';
    document.getElementsByTagName('head')[0].appendChild(scriptJquery);
    //document.getElementsByTagName('head')[0].appendChild(scriptAnnyang);
    document.getElementsByTagName('head')[0].appendChild(scriptSpeechKitt);
}