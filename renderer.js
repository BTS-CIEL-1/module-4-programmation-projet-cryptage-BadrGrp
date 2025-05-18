
function crypter() {
    const text = document.getElementById('textInput').value;
    const shift = parseInt(document.getElementById('shiftInput').value);
    let result = '';
  
    for (let i = 0; i < text.length; i++) {
      const c = text.charCodeAt(i);
      if (c >= 65 && c <= 90) {
        result += String.fromCharCode(((c - 65 + shift) % 26) + 65);
      } else if (c >= 97 && c <= 122) {
        result += String.fromCharCode(((c - 97 + shift) % 26) + 97);
      } else {
        result += text[i];
      }
    }
  
    document.getElementById("resultat").value = result;
  }
  

  function symetrique() {
    const texte = document.getElementById("textInput").value;
    const cle = document.getElementById("textInput2").value;
    let resultat = "";
  
    for (let i = 0; i < texte.length; i++) {
      const charCode = texte.charCodeAt(i) ^ cle.charCodeAt(i % cle.length);
      resultat += String.fromCharCode(charCode);
    }
  
    document.getElementById("resultat").value = btoa(resultat); // Encodage base64
  }
  
  function dechiffrerSymetrique() {
    const texteCrypte = document.getElementById("resultat").value;
    const cle = document.getElementById("textInput2").value;
  
    let texteDecode = "";
    try {
      const donnees = atob(texteCrypte); // Décodage base64
  
      for (let i = 0; i < donnees.length; i++) {
        const charCode = donnees.charCodeAt(i) ^ cle.charCodeAt(i % cle.length);
        texteDecode += String.fromCharCode(charCode);
      }
  
      document.getElementById("textInput").value = texteDecode;
    } catch (e) {
      alert("Erreur lors du déchiffrement. Vérifiez le texte ou la clé.");
    }
  }

  async function genererCles() {
    const resultat = await window.electronAPI.genererCles();
    document.getElementById("resultat").value = resultat;
  }
  
  async function chiffrer() {
    const texte = document.getElementById("textInput").value;
    const clePublique = document.getElementById("clePublique").value;
  
    try {
      const messageChiffre = await window.electronAPI.chiffrerTexte(texte, clePublique);
      document.getElementById("resultat").value = messageChiffre;
    } catch (err) {
      alert("Erreur de chiffrement RSA : " + err.message);
    }
  }
  
  async function dechiffrer() {
    const messageChiffre = document.getElementById("resultat").value;
    const clePrivee = document.getElementById("clePrivee").value;
  
    try {
      const texteDechiffre = await window.electronAPI.dechiffrerTexte(messageChiffre, clePrivee);
      document.getElementById("textInput").value = texteDechiffre;
    } catch (err) {
      alert("Erreur de déchiffrement RSA : " + err.message);
    }
  }
  