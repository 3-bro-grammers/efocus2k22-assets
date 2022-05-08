function counter() {
    const second = 1000,
          minute = second * 60,
          hour = minute * 60,
          day = hour * 24;
      let today = new Date(),
        dd = String(today.getDate()).padStart(2, "0"),
        mm = String(today.getMonth() + 1).padStart(2, "0"),
        yyyy = today.getFullYear(),
        nextYear = yyyy + 1,
        dayMonth = "5/7/",
        birthday = dayMonth + yyyy;
    
    today = mm + "/" + dd + "/" + yyyy;
    if (today > birthday) {
      birthday = dayMonth + nextYear;
    }
    
    const countDown = new Date(birthday).getTime(),
        x = setInterval(function() {    
  
          const now = new Date().getTime(),
                distance = countDown - now;
  
          document.getElementById("days").innerText = Math.floor(distance / (day)),
            document.getElementById("hours").innerText = Math.floor((distance % (day)) / (hour)),
            document.getElementById("minutes").innerText = Math.floor((distance % (hour)) / (minute)),
            document.getElementById("seconds").innerText = Math.floor((distance % (minute)) / second);
  
          if (distance < 0) {
            document.getElementById("headline").innerText = "It's my birthday!";
            document.getElementById("countdown").style.display = "none";
            document.getElementById("content").style.display = "block";
            clearInterval(x);
          }
        }, 0)
    }

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


window.onresize = ()=>{
    if(window.innerWidth>767){
        $('#nav-items').show();
    }else{
        $('#nav-items').hide();
    }
}

var email_enc;
var pass_name_pretty = {'non_tech': 'Efocus Non Tech Events Pass', 'tech': 'Efocus Tech Events Pass', 'premium': 'Efocus Premium Events Pass', 'gold': 'Efocus Gold Pass', 'silver': 'Efocus Silver Pass'}
// var pass_cost = {'non_tech': '1', 'tech': '1', 'premium': '1', 'gold': '1', 'silver': '1'}
var pass_cost = {'non_tech': '149', 'tech': '199', 'premium': '299', 'gold': '399', 'silver': '249'}
    

$(document).ready(function () {

    // toggle mobile menu
    
        
    // $('[data-toggle="toggle-nav"]').on('click', function () {
    //     $(this).closest('nav').find($(this).attr('data-target')).toggleClass('hidden');
    //     return false;
    // });
    alert_div.classList.add('hidden')
    if(window.innerWidth<767)
        $('#nav-items').hide();
    $('[data-toggle="toggle-nav"]').on('click', function () {
        $('#nav-items').toggle(250);
        return false;
    });

    // feather icons
    feather.replace();

    if(location.hash){
        document.querySelector(location.hash).scrollIntoView()
    }

    // smooth scroll
    // var scroll = new SmoothScroll('a[href*="#"]');

    // // tiny slider
    // $('#slider-1').slick({
    //     infinite: true,
    //     prevArrow: $('.prev'),
    //     nextArrow: $('.next'),
    // });

    $('#sponsor_slider').slick({
        dots: false,
        arrows: false,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 2,
        autoplay: true,
        autoplaySpeed: 1000,
        pauseOnHover: false,
        responsive: [{
            breakpoint: 768,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }, ]
    });
    email_enc = localStorage.getItem("efocus_id"); 

    if(email_enc) {
        signin_nav_tab.style.display = "none";
        user_nav_tab.style.display = "block";
        avatar.innerHTML = getInitial(localStorage.getItem("efocus_name"));

        var db=firebase.database();
        _pricing.classList.add('in-progress');
        db.ref(`users/${email_enc}`).once('value', snap=>{

            var a_val = snap.val();
            if(a_val['data']['college']=="Madras Institute of Technology"){
                mit_pass.classList.remove('hidden');
            }
            var val = a_val['pass'];
            if(!val){
                _pricing.classList.remove('in-progress');
                return;
            }
                
            Object.keys(val).forEach((e,i)=>{
                document.getElementById(`${e}_buy`).classList.add('hidden');
                var paid_val = val[e];
                if (paid_val == 0) {
                    document.getElementById(`${e}_process`).classList.remove('hidden');
                    db.ref(`users/${email_enc}/pass/${e}`).on('value',(paid_snap_upd)=>{
                        var paid_val_upd = paid_snap_upd.val();
                        if(paid_val_upd == 0)
                            return;    
                        document.getElementById(`${e}_process`).classList.add('hidden');
                        if (paid_val_upd == 1) {
                            document.getElementById(`${e}_paid`).classList.remove('hidden');
                            alert_div.classList.remove('hidden');
                            //alert_div2.classList.add('hidden');  
                        } else {
                            document.getElementById(`${e}_fail`).classList.remove('hidden');
                        }
                        db.ref(`users/${email_enc}/pass/${e}`).off('value');
                    })
                } else if (paid_val == 1) {
                    document.getElementById(`${e}_paid`).classList.remove('hidden');
                    alert_div.classList.remove('hidden');
                    //alert_div2.classList.add('hidden');  
                } else if (paid_val == "MIT") {
                    document.getElementById(`mit_pass_claim`).classList.add('hidden');
                    document.getElementById(`mit_pass_claim_input`).classList.add('hidden');
                    document.getElementById(`mit_pass_claimed`).classList.remove('hidden');

                    alert_div.classList.remove('hidden');
                    //alert_div2.classList.add('hidden');  
                }
                 else {
                    document.getElementById(`${e}_fail`).classList.remove('hidden');
                }
                    
            })

            _pricing.classList.remove('in-progress');
        })
        info_modal.classList.remove('hidden');
    }
    else{
        user_nav_tab.style.display = "none";
        signin_nav_tab.style.display = "block";
    }

});

async function claim_mit(){
    if(!ref_no.value || !reg_no.value){
        Swal.fire('EFocus Registration', 'Please check the DOB and Reg. No.',  'error');
        return;
    }
    
    mit_pass_claim.classList.add('loading')

    var ref_check = await (await fetch("https://f6gjtou26a.execute-api.us-east-2.amazonaws.com/default/verify-mit",{
        method: 'post',
        body: JSON.stringify({
            dob: ref_no.value,
            reg_no: reg_no.value
        })
    })).json();
    // console.log(ref_check);    

    if(ref_check){
        var db=firebase.database();
        db.ref(`users/${email_enc}`).update({
            ['pass/gold']:'MIT',
            ['data/reg_no']:reg_no.value
        }).then(()=>{ 
            Swal.fire('EFocus Registration', 'Free Gold Pass Claimed. Go Ahead and Register for your events.',  'success');
            document.getElementById(`mit_pass_claim`).classList.add('hidden');
            document.getElementById(`mit_pass_claim_input`).classList.add('hidden');
            document.getElementById(`mit_pass_claimed`).classList.remove('hidden');
            mit_pass_claim.classList.remove('loading');
        })
        
    }else{
        Swal.fire('EFocus Registration', 'Please check the DOB and Reg. No.',  'error');
        mit_pass_claim.classList.remove('loading');
    }
}

function view_event(event_tab){
    location.href = `events.html#${event_tab}`;
}

function getInitial(name){
    var arr = name.split(' ');
    // if  name has single word set first and last char as initials
    return (arr[0].charAt(0) + (arr.length == 1 ? (arr[0].charAt(arr[0].length-1)) : (arr[arr.length - 1]).charAt(0))).toUpperCase();
}

function buy_pass(pass_name){
    
    if(email_enc){

        if(pass_name == 'combo'){
            modal_combo.classList.remove('hidden')

            email1_txt.value = atob(email_enc);
            return;
        }

        var db_update = {};
        db_update[`users/${email_enc}/pass/${pass_name}`] = 0;

        Swal.fire({
            title: 'EFocus Registration',
            text: `Buy ${pass_name_pretty[pass_name]}`,
            showCancelButton: true,
            confirmButtonText: 'Proceed To PAY*',
            confirmButtonColor: 'green',
            backdrop: 'rgba(0,0,0,0.8)',
            footer: '*Transaction charges apply',
            showLoaderOnConfirm: true,
            preConfirm: () => {
                var db=firebase.database();
                return db.ref().update(db_update);
            }
        }).then((result) => {
    
            if (result.isConfirmed) {
                var user_name = localStorage.getItem('efocus_name');
                var user_mob = localStorage.getItem('efocus_mob');
    
                pay_key.value = 'mtrzVr';
                pay_txnid.value = pass_name + 'zz' + Date.now();
                
                pay_prodInfo.value = "pass@@" + pass_name + '@@' + pass_cost[pass_name];
    
                pay_amount.value = (parseFloat(pass_cost[pass_name])*1.025).toFixed(2);
                pay_email.value = atob(email_enc);
                pay_fname.value = user_name;
                pay_surl.value = `${location.origin}/#pricing`;
                pay_furl.value = `${location.origin}/#pricing`;
                pay_phone.value = user_mob;
                sha512(`mtrzVr|${pay_txnid.value}|${pay_amount.value}|${pay_prodInfo.value}|${pay_fname.value}|${pay_email.value}|||||||||||T7hdY1JYEIvELJBbH8bsfSYT60zw8Yd3`).then(hash => {
                    pay_hash.value = hash;
                    pay_submit.click();
                })
    
            }
        })
    }else{

        //not signed in

        Swal.fire({
            title: 'EFocus Registration',
            text: `Please Sign In to buy Passes`,
            showCancelButton: true,
            confirmButtonText: 'Sign In',
            confirmButtonColor: 'green',
            backdrop: 'rgba(0,0,0,0.8)',
        }).then((result) => {
    
            if (result.isConfirmed) {
                location.href='/signin.html'
            }
        })  
    }
}

async function get_3_pass_clk(){
    var error = null;
    
    
    if(!email2_txt.value || !email3_txt.value){
        error = "Please fill in the Mail IDs";
    }else{

        var db=firebase.database();

        var team_memb_names = (await Promise.all([email2_txt.value, email3_txt.value].map((e,i)=>getRegisteredName(btoa(e), db))));
        if (!team_memb_names.every((e)=>e)){
            error = "Please Ensure all have Signed Up.";
        };
    }

    if(!error){
        var user_name = localStorage.getItem('efocus_name');
        var user_mob = localStorage.getItem('efocus_mob');
        var pass_name = 'combo'

        pay_key.value = 'mtrzVr';
        pay_txnid.value = pass_name + 'zz' + Date.now();
        
        pay_prodInfo.value = "pass@@" + pass_name + '@@799';
        pay_udf1.value = email2_txt.value;
        pay_udf2.value = email3_txt.value;

        // /change amount value
        pay_amount.value = (799*1.025).toFixed(2);
        pay_email.value = atob(email_enc);
        pay_fname.value = user_name;
        pay_surl.value = `${location.origin}/#pricing`;
        pay_furl.value = `${location.origin}/#pricing`;
        pay_phone.value = user_mob;
        sha512(`mtrzVr|${pay_txnid.value}|${pay_amount.value}|${pay_prodInfo.value}|${pay_fname.value}|${pay_email.value}|${pay_udf1.value}|${pay_udf2.value}|||||||||T7hdY1JYEIvELJBbH8bsfSYT60zw8Yd3`).then(hash => {
            pay_hash.value = hash;
            pay_submit.click();
        })
    }else{
        error_txt.innerHTML = error;
        error_txt.classList.remove('hidden')
    }
}


function retry_pass(pass_name){
    
    buy_pass(pass_name);

}

function sha512(str) {
    return crypto.subtle.digest("SHA-512", new TextEncoder("utf-8").encode(str)).then(buf => {
        return Array.prototype.map.call(new Uint8Array(buf), x => (('00' + x.toString(16)).slice(-2))).join('');
    });
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

function register_clk(event_name, event_categ) {
    location.href = `register.html?event_name=${event_name}&categ=${event_categ}`;
}