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

personal_details_div.classList.add('in-progress');
registrations_div.classList.add('in-progress');
passes_div.classList.add('in-progress');

$(document).ready(function () {

    // toggle mobile menu
    // $('[data-toggle="toggle-nav"]').on('click', function () {
    //     $(this).closest('nav').find($(this).attr('data-target')).toggleClass('hidden');
    //     return false;
    // });

    if (window.innerWidth < 767)
        $('#nav-items').hide();
    $('[data-toggle="toggle-nav"]').on('click', function () {
        $('#nav-items').toggle(250);
        return false;
    });

    // feather icons
    feather.replace();

    var user_name = localStorage.getItem("efocus_name");
    avatar.innerHTML = getInitial(user_name);
    var user_id = localStorage.getItem("efocus_id");
    var db = firebase.database();
    db.ref(`users/${user_id}`).once('value', function (s) {
        
        var fetchdata = s.val();
        var userdata = fetchdata.data;
        var passes = fetchdata.pass;
        var userevents, pass_txt = "";
        name_txt.value = userdata.name;
        mobile_txt.value = userdata.mobile;
        email_txt.value = atob(user_id);
        college_txt.value = userdata.college;

        personal_details_div.classList.remove('in-progress');

        var categ_inner = "";
        if (fetchdata.registered) {
            userevents = Object.keys(fetchdata.registered);
            fetch("assets/data/event_details.json").then((res) => res.json()).then((event_data) => {
                for (event_categ in event_data) {
                    for (let cur_event of userevents) {
                        if (event_data[event_categ].hasOwnProperty(cur_event)) {

                            categ_inner += `<div class="pointer bg-red-lightest-10 p-5 br-8 m-3 relative pb-10" onclick="location.href = 'register.html?event_name=${cur_event}&categ=${event_categ}';")">
                                        <img src="https://3-bro-grammers.github.io/efocus2k22-assets/images/events/${cur_event}.jpg" style="width: 17rem">        
                                        <p class="fw-800 fs-m1 red-lightest opacity-80 italic ls-wider">${cur_event}</p>
                                        <div class="fs-s1 red-lightest">${event_data[event_categ][cur_event]["short_desc"]}</div>
                                        <div class='absolute' style='bottom:10px; right:10px'><span id="pay_stat_${cur_event}"></span></div>
                                    </div>`

                            var  team_lead = fetchdata.registered[cur_event]['team'][0];
                            db.ref(`events/${event_categ}/${cur_event}/${team_lead}/paid`).once('value', (pay_stat_snap)=>{
                                var val = pay_stat_snap.val();
                                document.getElementById(`pay_stat_${cur_event}`).innerHTML = (val==1)?"<span class='green'>REGISTERED</span>":((val==0)?"<span class='yellow'>Registration PROCESSING</span>":"<span class='gray'>Registration FAILED</span>")
                            })
                        }
                    }
                }
                document.getElementById("events").innerHTML = categ_inner;
                registrations_div.classList.remove('in-progress');
            })
        }
        else {
            categ_inner += `<div>
                                <img src="https://3-bro-grammers.github.io/efocus2k22-assets/images/empty.png" style="height: 20rem;">
                                <div class="white text-center fs-m2">Explore our <a href="events.html" class="no-underline hover-underline red">events</a></div>
                            </div>`
            document.getElementById("events").innerHTML = categ_inner;
            registrations_div.classList.remove('in-progress');
        }
        var haspass = false;
        if (passes) {
            for (var x of Object.keys(passes)) {
                if (passes[x] == 1 || passes[x] == "MIT") {
                    haspass = true;
                    document.getElementById(x).style.display= 'flex';
                }
            }
            passes_div.classList.remove('in-progress');
        }

        if(!haspass) {
            pass_txt = `<div>
                                <img src="https://3-bro-grammers.github.io/efocus2k22-assets/images/nopass.png" style="height: 20rem;">
                                <div class="white text-center fs-m2">No passes purchased <span>:(</span></div>
                                <div class="white text-center fs-m2">Grab your <a href="/#pricing" class="no-underline hover-underline red">Passes</a></div>
                            </div>`
            document.getElementById("passes").innerHTML = pass_txt;
            passes_div.classList.remove('in-progress');
        }
    });

});

function getInitial(name) {
    var arr = name.split(' ');
    // if  name has single word set first and last char as initials
    return (arr[0].charAt(0) + (arr.length == 1 ? (arr[0].charAt(arr[0].length - 1)) : (arr[arr.length - 1]).charAt(0))).toUpperCase();
}
var txt_boxes = ["name_txt", "mobile_txt", "college_txt"];

function edit_data() {
    txt_boxes.forEach(element => {
        document.getElementById(element).disabled = false;
    });
    document.getElementById(txt_boxes[0]).focus();
    edit_icon.style.display = "none";
    save_icon.style.display = "block";
}

function save_data() {  
    txt_boxes.forEach(element => {
        document.getElementById(element).disabled = true;
        save_icon.style.display = "none";
        edit_icon.style.display = "block";
    });
    var db = firebase.database();
    var user_id = localStorage.getItem("efocus_id");
    db.ref(`users/${user_id}/data`).update({
        name: name_txt.value,
        college: college_txt.value,
        mobile: mobile_txt.value,
    }).then(() => {
        localStorage.setItem('efocus_name', name_txt.value);
        location.reload();
    })
}

function logout() {
    localStorage.removeItem('efocus_name');
    localStorage.removeItem("efocus_id");
    localStorage.removeItem('efocus_mob');
    location.href = '/';
}