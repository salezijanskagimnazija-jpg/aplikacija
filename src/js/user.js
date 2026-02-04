import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js';
import { firebaseConfig } from './config.js';
import { getFirestore, doc, getDoc} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";


const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

function splitGoogleName(displayName) {
  if (!displayName) return {
    first: '',
    last: '' };
  const parts = displayName.trim().split(' ');
  
  if (parts.length === 1) {
    return { first: parts[0], last: '' };
  }
  const last = parts.pop(); // prezime :DD
  const first = parts.join(' '); // ime (ostatak) :DD
  
  return { first, last };
}

function uzmiInicijale(fullName){
  if (!fullName || fullName.trim() === '') return '';
  const imena = fullName.trim().split(' ');
  
  if imena.length === 0) return '';
  const imeInicijal = imena[0].charAt(0).toUpperCase();
  const prezimeInicijali = imena.length > 1 ? imena[imena.length - 1].charAt(0).toUpperCase() : '';

  return `${imeInicijal}${prezimeInicijal}`;
}

onAuthStateChanged(auth, async (user) => {
  if (user) {

    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      let punoIme = ""; 
      let godine = 0;
      let score = 0;
      let spol = "";

      const googleName = splitGoogleName(user.displayName);
      let firstName = googleName.first;
      let lastName = googleName.last;
      
      if (userSnap.exists()) {
        const data = userSnap.data();¸8
        godine = data.godine;
        score = data.score;
        punoIme = `${data.first} ${data.last}`;
        spol = data.spol;
      }

      
      if (data.first) firstName = data.first;
      if (data.last) lastName = data.last;
      
      if (data.first && data.last) {
          punoIme = `${data.first} ${data.last}`.trim();
        }
      
      if (!punoIme && user.email) {
        punoIme = user.email.split('@')[0];
      }

      
      const inicijali = uzmiInicijale(punoIme);
      
      const infoEl = document.querySelector('.user-info p');
      infoEl.innerHTML = 
            `Ime i prezime: ${punoIme} || ` +
            `Godine: ${godine || "-"} || ` +
            `Spol: ${spol || "-"} || ` +
            `Username: ${user.displayName} || ` +
            `Email: ${user.email} || ` +
            `Rezultat testa: ${score || "-"}`;

      document.getElementById("fullName").innerText = punoIme;
      document.getElementById("ageNum").innerText = godine;
      document.getElementById("pick").innerText = score;

      const inicijaliElement = document.getElementById("inicijali");
      if (inicijaliElement) {
        inicijaliElement.innerHTML = inicijali;
      }
      console.log("Inicijali korisnika: ", inicijali);

    } catch (error) {
      console.error("Greška u dohvatu podataka: ", error);
    }

  }
});

const logout = document.getElementById("logout-btn");
if (logout) {
  logout.addEventListener("click", async () => {
    try {
      await signOut(auth);
      window.location.assign("index.html");
    } catch (error) {
      console.error("Greška:", error);
    }
  });
}
