
const firebaseConfig = {
  apiKey: "AIzaSyAYof_D_yveejzgdZ46xfvC3wWapEoOGjg",
  authDomain: "efocus2k22.firebaseapp.com",
  databaseURL: "https://efocus2k22-default-rtdb.firebaseio.com",
  projectId: "efocus2k22",
  storageBucket: "efocus2k22.appspot.com",
  messagingSenderId: "124545227692",
  appId: "1:124545227692:web:cc99cae3be1f1a170d3809",
  measurementId: "G-GTYVGBHQ88"
};

// Initialize Firebase
if (!firebase.apps.length) {
  const app = firebase.initializeApp(firebaseConfig);
  const analytics = firebase.analytics()
}


var passwordInput = document.getElementById('pswd_txt'),
    toggle = document.getElementById('btnToggle'),
    icon =  document.getElementById('eyeIcon');

function togglePassword() {
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    icon.classList.add("fa-eye-slash");
    //toggle.innerHTML = 'hide';
  } else {
    passwordInput.type = 'password';
    icon.classList.remove("fa-eye-slash");
    //toggle.innerHTML = 'show';
  }
}

toggle.addEventListener('click', togglePassword, false);

function signin_clk() {
  
  signin_btn.disabled = true;
  loader.style.display = 'block';
  error.style.display = 'none';
  var db = firebase.database();
  error.innerText = 'Incorrect Password.';

  if (email_txt.value.length < 1 || pswd_txt.value.length < 1) {
    signin_btn.disabled = false;
    loader.style.display = 'none';
    error.innerText = 'Required fields cannot be empty.';
    error.style.display = 'block';
    return;
  }

  var found = true;
  var email_encoded = btoa(email_txt.value);
  var pswd_encoded = btoa(pswd_txt.value);
  db.ref("registered").once('value', function (s) {
    found = (s.hasChild(email_encoded));

  }).then(() => {

    if (!found) {
      signin_btn.disabled = false;
      loader.style.display = 'none';
      error.innerText = 'No user found please Sign Up';
      error.style.display = 'block';
      return;
    }
    else {
      db.ref(`users/${email_encoded}/data`).once("value", snap => {
        var data = snap.val()
        if (pswd_encoded == data.pswd) {
          localStorage.setItem('efocus_id', email_encoded)
          localStorage.setItem('efocus_name', data.name)
          localStorage.setItem('efocus_mob', data.mobile)

          var searchParms = new URLSearchParams(location.search);
          location.href = searchParms.get("from")??"/";
        }
        else {
          error.style.display = 'block';
        }
      }).then(
        () => {
          signin_btn.disabled = false;
          loader.style.display = 'none';
        }
      );
    }
  });
}