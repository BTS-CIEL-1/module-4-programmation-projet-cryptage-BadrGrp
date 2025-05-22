
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

function decrypter() {
  const text = document.getElementById('textInput').value;
  const shift = parseInt(document.getElementById('shiftInput').value);
  let result = '';

  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    if (c >= 65 && c <= 90) {
      // Lettres majuscules
      result += String.fromCharCode(((c - 65 - shift + 26) % 26) + 65);
    } else if (c >= 97 && c <= 122) {
      // Lettres minuscules
      result += String.fromCharCode(((c - 97 - shift + 26) % 26) + 97);
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
  
        document.getElementById("resultat").value = texteDecode;
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
      document.getElementById("resultat").value = texteDechiffre;
    } catch (err) {
      alert("Erreur de déchiffrement RSA : " + err.message);
    }
  }



async function envoyer() {
  const email = document.getElementById('emailInput').value;
  const texte = document.getElementById('resultat').value;
  const shift = document.getElementById('shiftInput')?.value;
  const cle = document.getElementById("textInput2")?.value;
  const clePublique = document.getElementById("clePublique")?.value;

  if (!email || !texte) {
    alert("Veuillez remplir tous les champs requis.");
    return;
  }

  let subject = "Message chiffré";
  let text = "";

  if (shift && shift !== "") {
    // Chiffrement César
    subject += " (César)";
    text = `Votre message chiffré avec la méthode César :\n\n${texte}\n\nDécalage utilisé : ${shift}`;
  } else if (cle && cle !== "") {
    // Chiffrement symétrique
    subject += " (Symétrique)";
    text = `Votre message chiffré avec une clé symétrique :\n\n${texte}\n\nClé utilisée : ${cle}`;
  } else if (clePublique && clePublique !== "") {
    // Chiffrement RSA
    subject += " (RSA)";
    text = `Votre message chiffré avec RSA :\n\n${texte}\n\nClé publique utilisée :\n${clePublique}`;
  } else {
    // Chiffrement inconnu
    subject += " (Inconnu)";
    text = `Message chiffré :\n\n${texte}`;
  }

  const result = await window.electronAPI.sendMail({ to: email, subject, text });

if (result.success) {
  document.getElementById('message').innerText = "message envoyé";
} else {
  document.getElementById('erreur').innerText = "message envoyé";
}
}

async function inserer() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".txt,.pdf"; // Tu peux ajouter d'autres extensions ici
  input.click();

  input.onchange = async () => {
    const file = input.files[0];
    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();

    if (ext === "txt") {
      const reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById("textInput").value = e.target.result;
      };
      reader.readAsText(file);
    } else if (ext === "pdf") {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      const pdfjsLib = window['pdfjs-dist/build/pdf'];
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.worker.min.js';

      const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;
      let text = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map(item => item.str).join(' ');
        text += pageText + "\n";
      }

      document.getElementById("textInput").value = text;
    } else {
      alert("Format non pris en charge. Seuls les fichiers .txt et .pdf sont supportés.");
    }
  };
}

