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

var email_enc = localStorage.getItem('efocus_id');


if (email_enc) {
    memb1_name_txt.value = atob(email_enc);
    signin_div.classList.add("hidden")
}
else {
    reg_form.classList.add("hidden")
}




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
    feather.replace()
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

    var db=firebase.database();
    db.ref(`users/${email_enc}/hostel`).once('value', (snap) => {

        var data = snap.val();
        if (data==null) {
            cont_section.classList.remove('in-progress', 'opacity-20');
            return;
        }

        if (!data["form"]){
            return;
        }else{
            reg_form_cont.classList.remove('hidden');
            form_link.classList.add('hidden');
        }

        
        // food_yes.disabled = true; food_no.disabled = true; 
        if(data["food"]!=null){
            food_yes.checked = data["food"]; food_no.checked = !data["food"]; change_days_food();
        }
        
        var paid_val = data["paid"];

        if(paid_val!=null){
            reg_btn.classList.add('hidden');
        }else{
            cont_section.classList.remove('in-progress', 'opacity-20');
            return; 
        }

        if (paid_val == 0) {
            pay_process.classList.remove('hidden');
            db.ref(`users/${email_enc}/hostel/paid`).on('value',(paid_snap_upd)=>{
                var paid_val_upd = paid_snap_upd.val();
                if(!paid_val_upd)
                    return;    
                pay_process.classList.add('hidden');
                if (paid_val_upd == 1) {
                    reg_done.classList.remove('hidden');
                    days_sel.value = data["days"];
                    days_sel.disabled = true;
            
                    if(data["food"]==true){
                        food_yes.checked = true;
                        food_no.disabled = true;
                    }else{
                        food_no.checked = true;
                        food_yes.disabled = true;
                    }

                    change_days_food();
                } else {
                    pay_fail.classList.remove('hidden');
                }
                db.ref(`events/${event_categ}/${event_name}/${data.team[0]}/paid`).off('value');
            })
        } else if (paid_val == 1) {
            reg_done.classList.remove('hidden');
            days_sel.value = data["days"];
            days_sel.disabled = true;
            if(data["food"]==true){
                food_yes.checked = true;
                food_no.disabled = true;
            }else{
                food_no.checked = true;
                food_yes.disabled = true;
            }  
            change_days_food(); 
            if(food_no.checked){
                [...document.getElementsByClassName('food_amt')].forEach((e,i)=> e.innerHTML = ((days_sel.value=='3')?2:1)*175.0);

                if(data["food"]===false)
                    pay_food_div.classList.remove('hidden');
                else if (data["food"]===0)
                    pay_food_div_process.classList.remove('hidden');
                else
                    pay_food_div_fail.classList.remove('hidden');
            }
        } else {
            pay_fail.classList.remove('hidden');
        }
        cont_section.classList.remove('in-progress', 'opacity-20');
       
    })

});


async function register_clk() {

    var db = firebase.database();
     
    var db_update = {};
   
    db_update[`users/${email_enc}/hostel/paid`] = 0;
    db_update[`users/${email_enc}/hostel/food`] = food_yes.checked;
    db_update[`users/${email_enc}/hostel/days`] = days_sel.value;

    Swal.fire({
        title: 'EFocus Registration',
        text: `Register for Hostel Accommodation`,
        showCancelButton: true,
        confirmButtonText: 'Proceed To PAY*',
        confirmButtonColor: 'green',
        backdrop: 'rgba(0,0,0,0.8)',
        footer: '*Transaction charges apply',
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

    register_clk();

}

function redirect_payment(){
    var user_name = localStorage.getItem('efocus_name');
    var user_mob = localStorage.getItem('efocus_mob');

    pay_key.value = 'mtrzVr';
    pay_txnid.value = "Accomodation" + 'zz' + Date.now();

    // var total_cost = isGaming?(parseFloat(event_cost)*1.025*memb_cnt).toFixed(2):(parseFloat(event_cost)*1.025).toFixed(2);
    var total_cost = (parseFloat(change_days_food())*1.025).toFixed(2);
    pay_prodInfo.value = "HOSTEL" + "@@" + `HOSTEL ACCOMODATION ${food_yes.checked?'with':'without'} FOOD` + '@@' + total_cost;
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






function sha512(str) {
    return crypto.subtle.digest("SHA-512", new TextEncoder("utf-8").encode(str)).then(buf => {
        return Array.prototype.map.call(new Uint8Array(buf), x => (('00' + x.toString(16)).slice(-2))).join('');
    });
}

function sign_in_clk(){
    location.href = `signin.html?from=${encodeURIComponent(location.href)}`;
}


function change_days_food(){
    var per_day = food_yes.checked?350:175;
    var total_cost = ((days_sel.value=='3')?2:1)*per_day;
    charges_span.innerHTML = total_cost;
    return total_cost;
}

function pay_food_charges(){



    var db = firebase.database();
     
    var db_update = {};
   
    db_update[`users/${email_enc}/hostel/food`] = 0;

    Swal.fire({
        title: 'EFocus Registration',
        text: `Pay Food Charges`,
        showCancelButton: true,
        confirmButtonText: 'Proceed To PAY*',
        confirmButtonColor: 'green',
        backdrop: 'rgba(0,0,0,0.8)',
        footer: '*Transaction charges apply',
        showLoaderOnConfirm: true,
        preConfirm: () => {
                return db.ref().update(db_update);
        }
    }).then((result) => {
        
        
        if (result.isConfirmed) {
            
            var user_name = localStorage.getItem('efocus_name');
            var user_mob = localStorage.getItem('efocus_mob');

            pay_key.value = 'mtrzVr';
            pay_txnid.value = "Accomodation_Food" + 'zz' + Date.now();

            // var total_cost = isGaming?(parseFloat(event_cost)*1.025*memb_cnt).toFixed(2):(parseFloat(event_cost)*1.025).toFixed(2);
            var total_cost = ((days_sel.value=='3')?2:1)*175*1.025;
            pay_prodInfo.value = "HOSTEL_FOOD" + "@@" + `HOSTEL ACCOMODATION FOOD` + '@@' + total_cost;
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
    })



    
}