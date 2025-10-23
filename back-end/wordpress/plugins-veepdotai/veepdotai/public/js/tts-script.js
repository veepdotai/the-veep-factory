  function getVoices() {
    let voices = speechSynthesis.getVoices();
    if(!voices.length){
      // some time the voice will not be initialized so we can call spaek with empty string
      // this will initialize the voices 
      let utterance = new SpeechSynthesisUtterance("");
      speechSynthesis.speak(utterance);
      voices = speechSynthesis.getVoices();
    }
    return voices;
  }
  
  function speak(text, voice, rate, pitch, volume) {
    let voiceContext = new SpeechSynthesisUtterance();
    voiceContext.volume = volume; // From 0 to 1
    voiceContext.rate = rate; // From 0.1 to 10
    voiceContext.pitch = pitch; // From 0 to 2
    voiceContext.text = text;
    voiceContext.lang = 'fr-FR';
    voiceContext.lang = 'Thomas';
    voiceContext.voice = voice;
    
    // pass the SpeechSynthesisUtterance to speechSynthesis.speak to start speaking 
    speechSynthesis.speak(voiceContext);  
  }
  
  function start() {
    console.log('Focus');
 
    if ('speechSynthesis' in window) {
        let voices = getVoices();
        let rate = 1, pitch = 1, volume = 1;
        let text = "Bonjour, pouvez-vous me raconter la naissance de votre projet ?";
        speak(text, voices[0], rate, pitch, volume );
    } else {
        console.log(' Speech Synthesis Not Supported 😞'); 
    }
  }

  const inputTxt = document.getElementsByName('txt');
  /*
  inputTxt.onfocus = function () {
    console.log('Focus');
    jc();
  };
  */
  