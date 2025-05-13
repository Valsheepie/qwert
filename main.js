const firebaseConfig = {
  apiKey: "AIzaSyAl3a_MpU3JviVdf4oEyaP3RWrYeSf6wDM",
  authDomain: "apuntaja.firebaseapp.com",
  projectId: "apuntaja",
  storageBucket: "apuntaja.firebasestorage.app",
  messagingSenderId: "956916894313",
  appId: "1:956916894313:web:ecee75cde8feaee455f0f8"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const storage = firebase.storage();

document.getElementById("login-btn").addEventListener("click", () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then(result => alert("Benvingut/da " + result.user.displayName))
    .catch(error => console.error(error));
});

function uploadNote() {
  const file = document.getElementById("upload").files[0];
  if (!file) return alert("Selecciona un arxiu");

  const storageRef = storage.ref('apuntes/' + file.name);
  storageRef.put(file).then(snapshot => {
    alert("Apunt pujat amb èxit");
    mostrarApunts();
  });
}


function mostrarApunts() {
  const galeria = document.getElementById("galeria");
  galeria.innerHTML = "";

  const listRef = storage.ref('apuntes/');
  listRef.listAll().then(res => {
    res.items.forEach(itemRef => {
      itemRef.getDownloadURL().then(url => {
        const img = document.createElement("img");
        img.src = url;
        img.width = 200;
        galeria.appendChild(img);
      });
    });
  });
}

window.onload = mostrarApunts;