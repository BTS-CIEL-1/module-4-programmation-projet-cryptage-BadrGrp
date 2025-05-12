
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

// Fonction pour le chiffrement RSA
function crypterAsym() {
  const text = document.getElementById('textInput').value;
  const publicKey = document.getElementById('publicKeyInput').value;

  // Création de l'objet JSEncrypt
  const encrypt = new JSEncrypt();
  
  // Définir la clé publique
  encrypt.setPublicKey(publicKey);
  
  // Chiffrement du texte
  const encrypted = encrypt.encrypt(text);
  
  if (encrypted) {
    document.getElementById("resultat").value = encrypted;
  } else {
    alert('Erreur lors du chiffrement.');
  }
}

// Fonction pour le déchiffrement RSA
function dechiffrerAsym() {
  const encryptedText = document.getElementById("resultat").value;
  const privateKey = document.getElementById('privateKeyInput').value;
  
  // Création de l'objet JSEncrypt
  const decrypt = new JSEncrypt();
  
  // Définir la clé privée
  decrypt.setPrivateKey(privateKey);
  
  // Déchiffrement du texte
  const decrypted = decrypt.decrypt(encryptedText);
  
  if (decrypted) {
    document.getElementById("textInput").value = decrypted;
  } else {
    alert('Erreur lors du déchiffrement.');
  }
}
