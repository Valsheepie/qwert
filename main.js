function checkAuth(redirectIfNotLogged = true) {
  firebase.auth().onAuthStateChanged(user => {
    if (!user && redirectIfNotLogged) {
      window.location.href = "login.html";
    }
  });
}

function logout() {
  firebase.auth().signOut()
    .then(() => window.location.href = "login.html")
    .catch(error => console.error("Error al tancar sessió:", error));
}

function getUserId() {
  const user = firebase.auth().currentUser;
  return user ? user.uid : null;
}

function getUserName() {
  const user = firebase.auth().currentUser;
  return user ? user.displayName : null;
}

function uploadNote(file, centro, materia, curso) {
  if (!file) return alert("Selecciona un fitxer");

  const uid = getUserId();
  const fileName = `${uid}_${Date.now()}_${file.name}`;
  const storageRef = firebase.storage().ref(`apuntes/${centro}/${materia}/${curso}/${fileName}`);

  return storageRef.put(file)
    .then(snapshot => {
      alert("Apunt pujat correctament!");
      return snapshot;
    })
    .catch(err => {
      console.error("Error al pujar:", err);
    });
}

function loadFilteredNotes(containerId, centro, materia, curso) {
  const container = document.getElementById(containerId);
  container.innerHTML = "Carregant...";

  const ref = firebase.storage().ref(`apuntes/${centro}/${materia}/${curso}`);
  ref.listAll()
    .then(result => {
      container.innerHTML = "";
      if (result.items.length === 0) {
        container.innerHTML = "<p>No hi ha apunts disponibles.</p>";
      }

      result.items.forEach(itemRef => {
        itemRef.getDownloadURL().then(url => {
          const link = document.createElement("a");
          link.href = url;
          link.textContent = itemRef.name;
          link.target = "_blank";
          container.appendChild(link);
          container.appendChild(document.createElement("br"));
        });
      });
    })
    .catch(err => {
      console.error("Error carregant apunts:", err);
    });
}

function loadUserNotes(containerId) {
  const uid = getUserId();
  const container = document.getElementById(containerId);
  container.innerHTML = "Carregant...";

  const rootRef = firebase.storage().ref("apuntes");

  rootRef.listAll()
    .then(result => {
      const folders = result.prefixes;
      return Promise.all(folders.map(folder => folder.listAll()));
    })
    .then(nested => {
      container.innerHTML = "";
      nested.flat().forEach(entry => {
        entry.items.forEach(itemRef => {
          if (itemRef.name.startsWith(uid)) {
            itemRef.getDownloadURL().then(url => {
              const link = document.createElement("a");
              link.href = url;
              link.textContent = itemRef.name;
              link.target = "_blank";
              container.appendChild(link);
              container.appendChild(document.createElement("br"));
            });
          }
        });
      });
    })
    .catch(err => {
      console.error("Error carregant apunts de l'usuari:", err);
    });
}
