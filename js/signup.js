
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


function college_radio_clk() {
    college_txt.disabled = mit_yes.checked
    college_txt.value = mit_yes.checked ? "Madras Institute of Technology" : "";
}

const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

function signup_clk() {
    /*********************
    //TODO : Validation
    **********************/
    signup_btn.disabled = true;
    loader.style.display = 'block';
    error.style.display = 'none';
    var inputs = ['name_txt', 'pswd_txt', 'college_txt', 'dept_txt', 'year_sel', 'mob_txt'];

    //null check
    for (element of inputs) {
        if (document.getElementById(element).value.length < 1) {
            signup_btn.disabled = false;
            loader.style.display = 'none';
            error.innerText = 'Required fields cannot be empty.';
            error.style.display = 'block';
            return;
        }
    }
    var valid = true;
    var error_msg = "";

    //validate email
    if (!validateEmail(email_txt.value)) {
        valid = false;
        error_msg = "Invalid E-mail address";
    }

    //phn no validation
    if (mob_txt.value.length != 10) {
        valid = false;
        error_msg = "Phone no. should be 10 digits";
    }

    //Pswd Validation
    if (pswd_txt.value.length < 5) {
        valid = false;
        error_msg = "Use a Stronger Password";
    }

    var db = firebase.database();
    var email_encoded = btoa(email_txt.value);
    db.ref("registered").once('value', function (s) {
        if ((s.hasChild(email_encoded))) {
            valid = false;
            error_msg = 'User Already Signed Up please Signin';
        }
    }).then(() => {
        if (!valid) {
            signup_btn.disabled = false;
            loader.style.display = 'none';
            error.innerText = error_msg
            error.style.display = 'block';
            return;
        }
        else {
            db.ref(`registered`).update({
                [email_encoded] : name_txt.value
            });

            db.ref(`users/${email_encoded}/data`).update({
                name: name_txt.value,
                pswd: btoa(pswd_txt.value),
                college: college_txt.value,
                dept: dept_txt.value,
                year: year_sel.value,
                mobile: mob_txt.value,
            }).then(() => {
                localStorage.setItem('efocus_id', email_encoded)
                localStorage.setItem('efocus_name', name_txt.value)
                localStorage.setItem('efocus_mob', mob_txt.value)
                location.href = "/";
                signup_btn.disabled = false;
                loader.style.display = 'none';
            });

        }
    });

}