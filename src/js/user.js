import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js';
import { firebaseConfig } from './config.js';
import { getFirestore, doc, getDoc} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";


const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

onAuthStateChanged(auth, async (user) => {
  if (user) {

    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      let punoIme = ""; 
      let godine = 0;
      let score = 0;
      let spol = "";
      if (userSnap.exists()) {
        const data = userSnap.data();
        godine = data.godine;
        score = data.score;
        punoIme = `${data.first} ${data.last}`;
        spol = data.spol;
      }

      const infoEl = document.getElementById("user-info");
      infoEl.innerHTML = 
            `Ime i prezime: ${punoIme} || ` +
            `Godine: ${godine || "-"} || ` +
            `Spol: ${spol || "-"} || ` +
            `Username: ${user.displayName} || ` +
            `Email: ${user.email} || ` +
            `Rezultat testa: ${score || "-"}`;
          

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
