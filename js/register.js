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

cont_section.classList.add('in-progress', 'opacity-20');

$(document).ready(function () {

    // toggle mobile menu
    // $('[data-toggle="toggle-nav"]').on('click', function () {
    //     $(this).closest('nav').find($(this).attr('data-target')).toggleClass('hidden');
    //     return false;
    // });


    if(window.innerWidth<767)
        $('#nav-items').hide();
    $('[data-toggle="toggle-nav"]').on('click', function () {
        $('#nav-items').toggle(250);
        return false;
    });

    // feather icons

    var user_name = localStorage.getItem("efocus_name"); 
    if(user_name) {
        user_nav_tab.style.display = "block";
        signin_nav_tab.style.display = "none";
        avatar.innerHTML = getInitial(user_name);
    }
    else{
        user_nav_tab.style.display = "none";
        signin_nav_tab.style.display = "block";
        
    }
});

var query_par = new URLSearchParams(window.location.search);
var event_name = query_par.get("event_name");
var event_categ = query_par.get("categ");
var isWorkshop = event_categ=="workshops";
var isGaming = event_categ=="gaming";
var isProjectOrPaper = (event_name=="PAPER PRESENTATION") || (event_name=="PROJECTINA");
var memb_cnt = 1;
var event_cost;
var supported_passes, supported_passes_pretty;
var reg_wa_link_txt;

var max_memb_cnt_obj = {
    "CODE CARNIVAL" : 1,
    "RUN TIME ERROR" : 1,
    "MR AND MISS EFOCUS": 1,
    "VALORANT": 5,
    "BGMI": 4,
    "FIFA": 2,
    "SIGNAL SYNC": 2,
    "NETWORKS": 2,
    "DIGI-LOGI":2,
    "MARVEL QUIZ": 2,
    "VOICE OVER": 1,
    "CASE CHALLENGE": 2,
    "TECHNICAL GD": 1,
    "MATH MAVERICK": 2,
    "E2INFOSYSTEMS PLACEMENT DRIVE": 1,
    "MBIT WIRELESS PLACEMENT DRIVE": 1,
    "ZUMMIT INFOLABS INTERN DRIVE": 1,
    "E-CON SYSTEMS PLACEMENT DRIVE": 1

}

var max_memb_cnt = (max_memb_cnt_obj[event_name]) || 3;
if(max_memb_cnt == 1)
    mem_btn.classList.add('hidden');

if(!(isWorkshop || isGaming)){
    supported_passes = {"tech_events":['gold','silver','tech'], 
            "non_tech_events":['gold','silver', 'non_tech'], 
            "premium_events":['gold','premium'], "placements": ['gold', 'silver', 'premium', 'tech']}

    supported_passes_pretty = {'gold': 'Gold Pass', 'silver': 'Silver Pass', 'tech': 'Tech Pass', 'non_tech': 'Non-Tech Pass', 'premium':'Premium Pass'}
    var bg_class = {'gold': 'gold white', 'silver': 'silver black', 'tech': 'bg-white red', 'non_tech': 'bg-white red', 'premium':'bg-white red'}
    var supported_pass_div_cont_inner = supported_passes[event_categ].map((e,i)=>(`<a href="/#pricing" class=" ${bg_class[e]} no-underline br-4 m-1 px-2">${supported_passes_pretty[e]}</a>`)).join('');
    supported_pass_div_cont.innerHTML = supported_pass_div_cont_inner;
}else{
    if(isWorkshop){
        mem_btn.classList.add('hidden');
        date_time_div.classList.remove('hidden');
    }
    supported_pass_div.classList.add('hidden'); 
    entry_cost_div.classList.remove('hidden');
    
}

if(event_name=='HOPE CIRCUIT'){
    supported_pass_div.classList.add('hidden'); 
    entry_cost_div.classList.add('hidden');
}

var email_enc = localStorage.getItem('efocus_id');


if (email_enc) {
    memb1_name_txt.value = atob(email_enc);
    signin_div.classList.add("hidden")
}
else {
    reg_form.classList.add("hidden")
}


fetch("assets/data/event_details.json", { cache: 'no-cache' }).then((res) => res.json()).then((event_data) => {

    

    event_name_div.innerHTML = event_name;
    event_desc_div.innerHTML = event_data[event_categ][event_name]["long_desc"];
    reg_wa_link_txt = event_data[event_categ][event_name]["whatsapp"];


    var prize_amt = event_data[event_categ][event_name]["prize"];

    var isClosed = event_data[event_categ][event_name]["closed"];
    
    if(prize_amt){
        prize_badge_div.innerHTML = '₹ ' + prize_amt;
        prize_worth_badge.style.display='block';

    }

    if(isWorkshop || isGaming){   
        event_cost = event_data[event_categ][event_name]["cost"] || "1";
        entry_cost_span.innerHTML = event_cost + (isGaming?' / head':'');

        var old_cost = event_data[event_categ][event_name]["old_cost"];
        if(old_cost) {
            old_cost_amount.innerHTML = old_cost;
            old_cost_span.classList.remove('hidden');
        }

        if(isWorkshop){
            date_txt.innerHTML = event_data[event_categ][event_name]["date"];
            time_txt.innerHTML = event_data[event_categ][event_name]["time"];
        }
    }
    // img_name = event_data[event_categ][event_name]["img"];
    event_img.src = "https://3-bro-grammers.github.io/efocus2k22-assets/images/events/" + event_name + ".jpg";
    organiser_list.innerHTML = event_data[event_categ][event_name]["organisers"].map(e => (`
        <tr><td class="font-weight-bold red">${e[0]}</td><td><a class='ml-2' href="https://wa.me/+91${e[1]}" target="_blank"><i class='fab fa-whatsapp fs-m3'></i></a></td><td>${e[1]}</td></tr>
    `)).join(" ");
    // if (event_data[event_categ][event_name]["result"])
    //     show_results(event_data[event_categ][event_name]["result"]);
    // else {
    //     reg_nav.innerHTML = "REGISTER";
    //     if (!event_data[event_categ][event_name]["closed"]) {
    //         document.getElementById("inputs").reset();
    //         document.getElementById("inputs").style.display = "block";
    //         reg_title.innerHTML = "Register Now";

    //     }
    //     else {
    //         reg_closed.style.display = "block";
    //         reg_title.innerHTML = "Registrations Closed";
    //     }
    // }

    feather.replace();
    
    

        


    var db = firebase.database();

    db.ref(`users/${email_enc}/registered/${event_name}`).once('value', (snap) => {
        var data = snap.val();
        if (data==null) {

            if(isClosed){
                reg_closed.classList.remove('hidden');
                signin_div.classList.add("hidden");
                cont_section.classList.remove('in-progress', 'opacity-20');
                reg_form.classList.add("hidden")
            }

            cont_section.classList.remove('in-progress', 'opacity-20');
            return;
        }

        mem_inc_btn.classList.add('hidden');
        reg_btn.classList.add('hidden')

        data.team.forEach((e, i) => {
            var email_txt = document.getElementById(`memb${i + 1}_name_txt`)
            email_txt.value = atob(e);
            email_txt.disabled = true;
            document.getElementById(`member${i + 1}`).classList.remove('hidden');
            memb_cnt = i+1;
        })

        db.ref(`events/${event_categ}/${event_name}/${data.team[0]}/paid`).once('value', (paid_snap) => {
            var paid_val = paid_snap.val();

            if (paid_val == 0) {
                pay_process.classList.remove('hidden');
                db.ref(`events/${event_categ}/${event_name}/${data.team[0]}/paid`).on('value',(paid_snap_upd)=>{
                    var paid_val_upd = paid_snap_upd.val();
                    if(paid_val_upd == 0)
                        return;    
                    pay_process.classList.add('hidden');
                    if (paid_val_upd == 1) {
                        reg_done.classList.remove('hidden');
                        reg_wa_link.href = reg_wa_link_txt;
                    } else {
                        pay_fail.classList.remove('hidden');
                    }
                    db.ref(`events/${event_categ}/${event_name}/${data.team[0]}/paid`).off('value');
                })
            } else if (paid_val == 1) {
                reg_done.classList.remove('hidden');
                reg_wa_link.href = reg_wa_link_txt;
            } else {
                pay_fail.classList.remove('hidden');
            }
            cont_section.classList.remove('in-progress', 'opacity-20');
        })
    })

    show_results(event_data[event_categ][event_name]["result"]);

})


async function register_clk() {

    var db = firebase.database();
    var team_emails_enc = [email_enc];
    var team_emails = [atob(email_enc)];
    

    for (var i = 2; i <= memb_cnt; i++) {
        var memb_email = document.getElementById(`memb${i}_name_txt`).value;
        team_emails.push(memb_email);

        var memb_email_enc = btoa(memb_email)
        if(team_emails_enc.indexOf(memb_email_enc)!=-1 || memb_email_enc==''){
            Swal.fire({
                title: 'EFocus Registration',
                text: `Please check the Mail Id`,
            })    
            return;    
        }
        team_emails_enc.push(memb_email_enc);
    }


    var team_memb_names = (await Promise.all(team_emails_enc.map((e,i)=>getRegisteredName(e, db))));
    if (!team_memb_names.every((e)=>e)){
        Swal.fire({
            title: 'EFocus Registration',
            text: `Please ensure all your Team Members have signed up`,
        })    
        return;
    };


    if(event_name == "HOPE CIRCUIT"){
        if (!(await Promise.all(team_emails_enc.map((e,i)=>checkMIT(e, db)))).every((e)=>e)){
           Swal.fire({
               title: 'EFocus Registration',
               text: `Event only for MIT Students`,
               confirmButtonColor: '#3085d6',
               confirmButtonText: 'OK',
           });
           return;
       };
   }

    if(!(isWorkshop || isGaming || isProjectOrPaper || event_name=="HOPE CIRCUIT" )){

        if (!(await Promise.all(team_emails_enc.map((e,i)=>haveValidPass(e, db)))).every((e)=>e)){
            Swal.fire({
                title: 'EFocus Registration',
                text: `Please purchase any of the eligible passes to register for the events`,
                showDenyButton: true,
                confirmButtonColor: '#3085d6',
                denyButtonColor: 'green',
                confirmButtonText: 'OK',
                denyButtonText: 'Purchase Passes'
            }).then((result)=>{
                if(result.isDenied){
                    location.href = "/#pricing"
                } 
            })
            return;
        };
    }


    if(isProjectOrPaper){

        if (!(await Promise.all(team_emails_enc.map((e,i)=>haveValidPass(e)))).some((e)=>e)){
            Swal.fire({
                title: 'EFocus Registration',
                text: `Please ensure atleast one of your Team Members have valid Passes`,
            })
            return;
        };
    }

    var db_update = {};

    team_emails_enc.forEach((e, i) => {
        db_update[`users/${e}/registered/${event_name}/team`] = team_emails_enc;
    })

    db_update[`events/${event_categ}/${event_name}/${email_enc}/memb`] = team_emails_enc;
    db_update[`events/${event_categ}/${event_name}/${email_enc}/paid`] = (isWorkshop || isGaming)?0:1;

    Swal.fire({
        title: 'EFocus Registration',
        text: `Register for event ${event_name}`,
        showCancelButton: true,
        confirmButtonText: (isWorkshop || isGaming)? 'Proceed To PAY*' : 'Confirm',
        confirmButtonColor: 'green',
        backdrop: 'rgba(0,0,0,0.8)',
        footer: (isWorkshop || isGaming)? '*Transaction charges apply' : '',
        showLoaderOnConfirm: true,
        preConfirm: () => {

            if(!(isWorkshop || isGaming)){
                return Promise.all([db.ref().update(db_update), 
                    fetch("https://k04rx2nfda.execute-api.us-east-2.amazonaws.com/default/efocus-event-reg",{
                        method:'post',
                        body:JSON.stringify({
                            mails: team_emails,
                            names: team_memb_names,
                            event_categ: event_categ,
                            event_name: event_name,
                            event_cost: event_cost
                        })
                    })
                ]);
            }else{
                return db.ref().update(db_update);
            }
        }
    }).then((result) => {
        
        
        if (result.isConfirmed) {
            if(!(isWorkshop || isGaming)){
                reg_btn.classList.add('hidden');
                reg_done.classList.remove('hidden');
                reg_wa_link.href = reg_wa_link_txt;
                return;
            }

            redirect_payment();

        }
    })



}

async function getRegisteredName(email_enc, db){
    return new Promise((resolve,reject)=>{
        db.ref(`registered/${email_enc}`).once('value').then((snap)=>{
            if(snap.exists())
                resolve(snap.val())
            else
                resolve(false);
        });
    })
    

}

async function checkMIT(email_enc, db){
    return new Promise((resolve,reject)=>{
        db.ref(`users/${email_enc}/data/college`).once('value').then((snap)=>{
            if(!snap.exists()){
                resolve(false);
                return;
            }

            resolve(snap.val() == "Madras Institute of Technology");
        });
    })
    

}


async function haveValidPass(email_enc, db){
    return new Promise((resolve,reject)=>{
        db.ref(`users/${email_enc}/pass`).once('value').then((snap)=>{
            if(!snap.exists()){
                resolve(false);
                return;
            }
    
            var val = snap.val();
            var purchased_pass = [];
            Object.keys(val).forEach((e,i)=>{
                if(val[e] == 1 || val[e] == "MIT" ) purchased_pass.push(e);
            })
            resolve(purchased_pass.filter((x) => supported_passes[event_categ].includes(x)).length>0); //union of purchased pass and valid pass
        });
    })
    

}



function retry_clk() {


    if (memb1_name_txt.value != atob(email_enc)) {

        Swal.fire({
            title: 'EFocus Registration',
            text: `Please Retry from the Team Leader's Account`
        })

        return;
    }

    var team_emails_enc = [email_enc];

    for (var i = 2; i <= memb_cnt; i++) {
        team_emails_enc.push(btoa(document.getElementById(`memb${i}_name_txt`).value));
    }

    var db = firebase.database();

    var db_update = {};

    db_update[`events/${event_categ}/${event_name}/${email_enc}/paid`] = 0;

    Swal.fire({
        title: 'EFocus Registration',
        text: `Register for event ${event_name}`,
        showCancelButton: true,
        confirmButtonText: 'Proceed To PAY*',
        confirmButtonColor: 'green',
        backdrop: 'rgba(0,0,0,0.8)',
        footer: (isWorkshop || isGaming)? '*Transaction charges apply' : '',
        showLoaderOnConfirm: true,
        preConfirm: () => {
            return db.ref().update(db_update);
        }
    }).then((result) => {

        if (result.isConfirmed) {
            redirect_payment();
        }
    })

}

function redirect_payment(){
    var user_name = localStorage.getItem('efocus_name');
    var user_mob = localStorage.getItem('efocus_mob');

    pay_key.value = 'mtrzVr';
    pay_txnid.value = event_name + 'zz' + Date.now();

    // var total_cost = isGaming?(parseFloat(event_cost)*1.025*memb_cnt).toFixed(2):(parseFloat(event_cost)*1.025).toFixed(2);
    var total_cost = (parseFloat(event_cost)*1.025*(isGaming?memb_cnt:1)).toFixed(2);
    pay_prodInfo.value = event_categ + "@@" + event_name + '@@' + total_cost;
    pay_amount.value = total_cost;
    pay_email.value = memb1_name_txt.value;
    pay_fname.value = user_name;
    pay_surl.value = location.href;
    pay_furl.value = location.href;
    pay_phone.value = user_mob;
    sha512(`mtrzVr|${pay_txnid.value}|${pay_amount.value}|${pay_prodInfo.value}|${user_name}|${memb1_name_txt.value}|||||||||||T7hdY1JYEIvELJBbH8bsfSYT60zw8Yd3`).then(hash => {
        pay_hash.value = hash;
        pay_submit.click();
    })
}


function getInitial(name) {
    var arr = name.split(' ');
    // if  name has single word set first and last char as initials
    return (arr[0].charAt(0) + (arr.length == 1 ? (arr[0].charAt(arr[0].length - 1)) : (arr[arr.length - 1]).charAt(0))).toUpperCase();
}

function change_member_cnt(inc) {

    if ((memb_cnt == 1 && !inc) || (memb_cnt == max_memb_cnt && inc)) {
        return;
    }
    memb_cnt = inc ? (memb_cnt + 1) : (memb_cnt - 1);
    for (i = 2; i <= max_memb_cnt; i++) {
        document.getElementById(`member${i}`).classList.remove('flex');
        document.getElementById(`member${i}`).classList.add('hidden');
    }

    for (i = 2; i <= memb_cnt; i++) {
        document.getElementById(`member${i}`).classList.add('flex');
        document.getElementById(`member${i}`).classList.remove('hidden');

    }

    memb_cnt_span.innerHTML = memb_cnt;


}






function sha512(str) {
    return crypto.subtle.digest("SHA-512", new TextEncoder("utf-8").encode(str)).then(buf => {
        return Array.prototype.map.call(new Uint8Array(buf), x => (('00' + x.toString(16)).slice(-2))).join('');
    });
}

function sign_in_clk(){
    location.href = `signin.html?from=${encodeURIComponent(location.href)}`;
}


function show_results(event_result) {
    if(!event_result) return;

    reg_nav.innerHTML = "Results";
    // reg_title.innerHTML = "Results";
    document.getElementById("results_cont").style.display = "block";

    winner_dept.innerHTML = event_result[0][0][2];
    runner_dept.innerHTML = event_result[1][0][2];
    winner_dept.innerHTML = event_result[0][0][2];
    runner_dept.innerHTML = event_result[1][0][2];
    winner_year.innerHTML = event_result[0][0][3];
    runner_year.innerHTML = event_result[1][0][3];
    if (event_result[2]) {
        runner2_dept.innerHTML =event_result[2][0][2];
        runner2_year.innerHTML = event_result[2][0][3];

        var runner2_div_txt = "";


        event_result[2].forEach((memb, i) => {

            runner2_div_txt += `<div class="flex flex-column">
                <div class="fw-bold">${memb[0]}</div>
                <div>${memb[1]}</div>
            </div>`
        });

        runner2_div_list.innerHTML = runner2_div_txt;


    }else{
        runner2_div_main.style.display = "none";
    }


    var winner_div_txt = "";
    event_result[0].forEach((memb, i) => {

        winner_div_txt += `<div class="flex flex-column">
            <div class="fw-bold">${memb[0]}</div>
            <div>${memb[1]}</div>
        </div>`
    });

    winner_div_list.innerHTML = winner_div_txt;

    var runner_div_txt = "";


    event_result[1].forEach((memb, i) => {

        runner_div_txt += `<div class="flex flex-column">
                <div class="fw-bold">${memb[0]}</div>
                <div>${memb[1]}</div>
            </div>`
    });

    runner_div_list.innerHTML = runner_div_txt;

    if (event_name == "MR AND MISS EFOCUS") {
        winner_title.innerHTML = "Mr. EFocus"
        runner_title.innerHTML = "Ms. EFocus"

        runner_div_list.classList.add('winner_div_list')
        runner_div_main.classList.remove('runner-div')
        runner_div_main.classList.add('winner-div')

        runner_icon.style.color = "gold";

        runner2_div_main.style.display = "none";
    }

    // if (results_cont.offsetHeight > results_cont.offsetWidth) {
    //     document.querySelector('.results-back').style.width = "auto";
    //     document.querySelector('.results-back').style.height = "100%";

    // }
}

setTimeout(() => {
    document.querySelectorAll('.results-back').forEach((e)=>e.style.top = "100%");
}, 30000)

setTimeout(() => {
if(location.hash == "#results"){
    document.getElementById('_winner_announce').scrollIntoView();
}
},1000)