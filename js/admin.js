
function clear_content() {
    container_div.style.display = "none";
}


var reg_data;
var event_data;
var isSupAdmin = false;
var memb_cnt = 1;

var max_memb_cnt_obj = {
    "CODE CARNIVAL": 1,
    "RUN TIME ERROR": 1,
    "MR AND MISS EFOCUS": 1,
    "VALORANT": 5,
    "BGMI": 4,
    "FIFA": 2,
    "SIGNAL SYNC": 2,
    "NETWORKS": 2,
    "DIGI-LOGI": 2,
    "MARVEL QUIZ": 2,
    "VOICE OVER": 1,
    "CASE CHALLENGE": 2,
    "TECHNICAL GD": 1,
    "MATH MAVERICK": 2,
    "E2INFOSYSTEMS PLACEMENT DRIVE": 1,
    "MBIT WIRELESS PLACEMENT DRIVE": 1,
    "ZUMMIT INFOLABS INTERN DRIVE": 1,
    "E-CON SYSTEMS PLACEMENT DRIVE": 1,

    "AIOT": 1,
    "ZERO TO CHIP DESIGN": 1,
    "EVOLUTION OF 5G": 1,
    "EMBEDDED CONTROLLERS": 1,
    "EVOLUTION AND ADVANCEMENTS OF ANTENNA": 1,
    "CONTROL SYSTEM AND ROBOTICS": 1,

    "gold": 1,
    "silver": 1,
    "tech": 1,
    "non_tech": 1,
    "premium": 1

}

var  event_cost = {
    "AIOT": 1,
    "ZERO TO CHIP DESIGN": 1,
    "EVOLUTION OF 5G": 1,
    "EMBEDDED CONTROLLERS": 1,
    "EVOLUTION AND ADVANCEMENTS OF ANTENNA": 1,
    "CONTROL SYSTEM AND ROBOTICS": 1,

    "gold": "399",
    "silver": "249",
    "tech": "199",
    "non_tech": "149",
    "premium": "299"
}


clear_cont_interval = setInterval(clear_content, 100);
var pswd = localStorage.getItem("pswd");
if (pswd != "true")
    input_pass(false);
else {
    clearInterval(clear_cont_interval);
    load_data();
    container_div.style.display = "block";
    if (localStorage.getItem('efsa') == 'true') {
        activate_super_admin();
    }

}


function input_pass(err) {
    Swal.fire({
        title: 'Enter ADMIN password',
        input: 'password',
        inputPlaceholder: 'Enter your password',
        footer: err ? 'Password Error!' : undefined
    }).then((res) => {

        if ((res.value != "ELECTROFOCUS_ADMIN") && (res.value != "ELECTROFOCUS_SUPER_ADMIN")) {
            input_pass(true)
        } else {

            clearInterval(clear_cont_interval);
            load_data();
            container_div.style.display = "block";
            localStorage.setItem("pswd", true);

            if (res.value == "ELECTROFOCUS_SUPER_ADMIN") {
                localStorage.setItem('efsa', 'true');
                activate_super_admin();
            }
        }
    })
}

function activate_super_admin() {
    add_btn.classList.remove('hidden')
    isSupAdmin = true;
}


function event_select_change() {
    var reg_table_cont_inner = [];

    var cnt = 0;

    if (event_categ_select.value == "passes") {
        var user_data = reg_data["users"];
        for (var memb in user_data) {
            if (!user_data[memb]["pass"])
                continue;
            if ((isSupAdmin && user_data[memb]["pass"][(event_select.value == 'mit_gold') ? 'gold' : event_select.value]) || (!isSupAdmin && user_data[memb]["pass"][(event_select.value == 'mit_gold') ? 'gold' : event_select.value] == ((event_select.value == 'mit_gold') ? 'MIT' : 1))) {
                var memb_data = user_data[memb]['data'];
                if(!memb_data) continue;
                cnt++;

                reg_table_cont_inner.push(
                    `<tr onclick="show_user('${memb}',false)" ${cnt % 2 ? "class='bg-red'" : "bg-yellow"}>
                        <td>${cnt}</td>
                        <td>${memb_data['name']}</td>
                        <td>${memb_data['year']}</td>
                        <td>${memb_data['college']}</td>
                        <td>${memb_data['dept']}</td>
                        <td>${atob(memb)}</td>
                        <td>${memb_data['mobile']}</td>         
                        ${isSupAdmin ? `<td>${user_data[memb]["pass"][(event_select.value == 'mit_gold') ? 'gold' : event_select.value]}</td>` : ''}           
                    </tr>`);

            }

        }
    } else {

        var event_categ_data = (reg_data["events"][event_categ_select.value])
        var event_reg_data;

        if (event_categ_data) {
            event_reg_data = event_categ_data[event_select.value];



            for (var team in event_reg_data) {


                if (!isSupAdmin && event_reg_data[team]["paid"] != 1)
                    continue;

                cnt++;

                var memb_cnt = event_reg_data[team]["memb"].length;
                var memb_id = event_reg_data[team]["memb"][0];
                var memb_data = reg_data['users'][memb_id]['data'];
                reg_table_cont_inner.push(

                    `<tr ${cnt % 2 ? "class='bg-red'" : "bg-yellow"}>
                <td rowspan="${memb_cnt}">${cnt}</td>
                <td onclick="show_user('${memb_id}',false)" >${memb_data['name']}</td>
                <td>${memb_data['year']}</td>
                <td>${memb_data['college']}</td>
                <td>${memb_data['dept']}</td>
                <td>${atob(memb_id)}</td>
                <td>${memb_data['mobile']}</td>                
                ${isSupAdmin ? `<td rowspan="${memb_cnt}">${event_reg_data[team]["paid"]}</td>` : ''}
            </tr>`);

                for (var i = 1; i < memb_cnt; i++) {
                    var memb_id = event_reg_data[team]["memb"][i];
                    var memb_data = reg_data['users'][memb_id]['data'];
                    reg_table_cont_inner[reg_table_cont_inner.length - 1] +=
                        `<tr ${cnt % 2 ? "class='bg-red'" : "bg-yellow"}>
                    <td onclick="show_user('${memb_id}',false)" >${memb_data['name']}</td>
                    <td>${memb_data['year']}</td>
                    <td>${memb_data['college']}</td>
                    <td>${memb_data['dept']}</td>
                    <td>${atob(memb_id)}</td>
                    <td>${memb_data['mobile']}</td>                    
                </tr>`
                }
            }

        }
    }
    reg_table_cont.innerHTML = reg_table_cont_inner.join("");
    reg_cnt_span.innerHTML = cnt;
}

function event_categ_select_change() {
    var event_select_inner = "";
    var reg_table_cont_inner = [];
    if (event_categ_select.value == 'passes') {
        ['tech', 'non_tech', 'premium', 'silver', 'gold', 'mit_gold'].forEach((e, i) => {
            event_select_inner += `<option>${e}</option>`;
        })
    } else if (event_categ_select.value == 'hostel_accom') {

        event_select.disabled = true;
        var cnt = 0;

        var user_data = reg_data["users"];
        for (var memb in user_data) {
            if (!user_data[memb]["hostel"])
                continue;
            if ((isSupAdmin && user_data[memb]["hostel"]["form"]) || (!isSupAdmin && (user_data[memb]["hostel"]["paid"] == 1))) {
                var memb_data = user_data[memb]['data'];
                if (!memb_data) continue;
                cnt++;

                reg_table_cont_inner.push(
                    `<tr onclick="show_user('${memb}',false)" ${cnt % 2 ? "class='bg-red'" : "bg-yellow"}>
                        <td>${cnt}</td>
                        <td>${memb_data['name']}</td>
                        <td>${memb_data['year']}</td>
                        <td>${memb_data['college']}</td>
                        <td>${memb_data['dept']}</td>
                        <td>${atob(memb)}</td>
                        <td>${memb_data['mobile']}</td>  
                        ${isSupAdmin ? `<td>${user_data[memb]["hostel"]["paid"]} | ${user_data[memb]["hostel"]["food"]} | ${user_data[memb]["hostel"]["days"]}</td>` : ''}                  
                    </tr>`);

            }

        }

        reg_table_cont.innerHTML = reg_table_cont_inner.join("");
        reg_cnt_span.innerHTML = cnt;

        return;

    } else {
        Object.keys(event_data[event_categ_select.value]).forEach((e, i) => {
            event_select_inner += `<option>${e}</option>`;
        })
    }

    event_select.disabled = false;
    event_select.innerHTML = event_select_inner;
    event_select_change();
}

async function load_data() {


    return Promise.all([
        fetch("https://efocus2k22-default-rtdb.firebaseio.com/.json").then(res => res.json()).then(data => {
            reg_data = data;
        }),
        fetch("assets/data/event_details.json").then(res => res.json()).then(data => {
            event_data = data;
        })]).then(() => {
            event_categ_select_change();
            search_txt_input()
        })

}

function show_view(div_name) {
    ['user', 'reg'].forEach((e, i) => {
        document.getElementById(e + '_section').classList.add('hidden');
        document.getElementById(e + '_section_tab').classList.remove('bg-red');
    })

    document.getElementById(div_name + '_section').classList.remove('hidden')
    document.getElementById(div_name + '_section_tab').classList.add('bg-red');

}

function refresh_clk() {
    refresh_btn.classList.add('loading');
    if (document.getElementById('user_section').classList.contains('hidden')) {
        var prev = event_select.value;
        load_data().then(() => {
            event_select.value = prev;
            event_select_change()
            refresh_btn.classList.remove('loading');
        });
    } else {
        var c_uid;
        if (prev_uid) {
            c_uid = prev_uid;
        }
        load_data().then(() => {
            if (c_uid) {
                show_user(c_uid);
            }
            refresh_btn.classList.remove('loading');
        });


    }


}

function search_txt_input() {
    var search_val = search_txt.value.toUpperCase();
    var user_table_inner = "";

    var cnt = 0;
    for (user in reg_data['users']) {
        var user_data = reg_data["users"][user]["data"];
        if (!user_data) continue;
        var search_from = (user_data["mobile"] + " " + user_data["name"] + "  " + user_data["college"] + " " + atob(user)).toUpperCase();
        if (search_from.indexOf(search_val) > -1) {
            cnt++;
            user_table_inner +=
                `<tr id="user_${user}" ${cnt % 2 ? "class='bg-red'" : "bg-yellow"} onclick = "show_user('${user}')">
                <td>${cnt}</td>
                <td>${user_data['name']}</td>
                <td>${user_data['college']}</td>
            </tr>`
            // if (cnt == 10) break;
        }

    }

    user_table_cont.innerHTML = user_table_inner;
    prev_uid = null;
}
var prev_uid;
function show_user(uid, update_cur = true) {

    show_view('user');

    if (update_cur) {

        if (prev_uid)
            document.getElementById(`user_${prev_uid}`).classList.remove('bg-red-lightest-50');

        document.getElementById(`user_${uid}`).classList.add('bg-red-lightest-50');
        prev_uid = uid;

    }

    var user_data = reg_data["users"][uid]["data"];
    if (!user_data) return;


    var user_display_inner = "";
    ["name", "college", "dept", "year", "mobile"].forEach((e, i) => {
        user_display_inner +=
            `<tr>
            <td>${e}</td>
            <td>${user_data[e]}</td>
        </tr>`
    })

    user_display_inner +=
        `<tr>
            <td>mail</td>
            <td>${atob(uid)}</td>
        </tr>`

    if (isSupAdmin) {
        user_display_inner +=
            `<tr>
            <td>Password</td>
            <td>${atob(user_data["pswd"])}</td>
        </tr>`
    }

    if (user_data["reg_no"]) {
        user_display_inner +=
            `<tr>
            <td>MIT Reg_no</td>
            <td>${user_data["reg_no"]}</td>
        </tr>`
    }
    var pay_stat_class = { 0: 'yellow', 1: 'green', 'MIT': 'green' };
    var pay_stat_txt = { 0: '(Processing)', 1: ' ', 'MIT': ' ' };
    var pass_data = reg_data["users"][uid]["pass"];

    if (pass_data) {
        var user_pass = "";
        for (x in pass_data) {

            user_pass += (`<span onclick='revert_processing("${pass_data[x]}", "pass", "${x}", "${uid}" )'  class="${pay_stat_class[pass_data[x]] || 'red'}">${x} ${pay_stat_txt[pass_data[x]] || '(Failed)'}</span>, `);
        }
        user_display_inner +=
            `<tr>
            <td>passes</td>
            <td>${user_pass.slice(0, user_pass.length - 2)}</td>
        </tr>`
    }

    var hostel_data = reg_data["users"][uid]["hostel"];

    if (hostel_data) {
        var hostel_stay = { "1": "May 7", "2": "May 8", "3": "May 7,8" }
        var hostel_val = `Stay: ${hostel_stay[hostel_data["days"]]} <br>`;
        hostel_val += `Food:<span onclick='revert_processing("${hostel_data["food"]}", "hostel_food", "", "${uid}" )'>${hostel_data["food"]}</span> <br>`;
        hostel_val += `Paid: ${(hostel_data["paid"] == 1) ? "YES" : ((hostel_data["paid"] == 0) ? `<span onclick='revert_processing("0", "hostel", "", "${uid}" )'>Process</span>` : ("NO"))} <br>`;

        user_display_inner +=
            `<tr>
            <td>Hostel</td>
            <td>${hostel_val}</td>
        </tr>`
    }

    user_display_cont.innerHTML = user_display_inner;

    var user_reg_inner = "";
    var user_reg_data = reg_data["users"][uid]["registered"];


    if (user_reg_data) {
        for (var x in user_reg_data) {
            var team_mem = "";
            var pay_stat;
            var got_event_categ = get_event_categ(x);
            var team_lead;
            user_reg_data[x]["team"].forEach((e, i) => {
                if (i == 0) {
                    pay_stat = reg_data["events"][got_event_categ][x][e]["paid"];
                    team_lead = e;
                }
                team_mem += `<span onclick="show_user('${e}', false);" class="underline pointer">${reg_data["registered"][e]}</span>, `
            })
            user_reg_inner += `<li class="${pay_stat_class[pay_stat] || 'red'}"><span class='fw-800' onclick='revert_processing("${pay_stat}", "${got_event_categ}", "${x}", "${team_lead}" )'>${x}</span> <br>( ${team_mem} )</li>`
        }
    }

    user_display_reg.innerHTML = user_reg_inner || 'No Registerations';
    document.getElementById('user_display_cont').scrollIntoView()

}

function get_event_categ(event_name) {
    for (var categ in event_data) {
        if (event_data[categ].hasOwnProperty(event_name)) {
            return categ;
        }
    }
}

function copy_mail_clk() {

    var event_categ_data = (reg_data["events"][event_categ_select.value]);
    var all_mails = [];
    var event_reg_data;

    if (event_categ_data)
        event_reg_data = event_categ_data[event_select.value];


    if (event_categ_select.value == "passes") {
        var user_data = reg_data["users"];
        for (var memb in user_data) {
            if (!user_data[memb]["pass"])
                continue;
            if (user_data[memb]["pass"][(event_select.value == 'mit_gold') ? 'gold' : event_select.value] == ((event_select.value == 'mit_gold') ? 'MIT' : 1)) {
                all_mails.push(atob(memb));
            }

        }
    } else {

        var event_categ_data = (reg_data["events"][event_categ_select.value])
        var event_reg_data;

        if (event_categ_data) {
            event_reg_data = event_categ_data[event_select.value];



            for (var team in event_reg_data) {


                if (event_reg_data[team]["paid"] != 1)
                    continue;


                var memb_cnt = event_reg_data[team]["memb"].length;
                var memb_id = event_reg_data[team]["memb"][0];

                all_mails.push(atob(memb_id));


                for (var i = 1; i < memb_cnt; i++) {
                    var memb_id = event_reg_data[team]["memb"][i];
                    all_mails.push(atob(memb_id))

                }
            }

        }
    }


    var type = "text/plain";
    var blob = new Blob([all_mails.join(", ")], { type });
    var data = [new ClipboardItem({ [type]: blob })];

    navigator.clipboard.write(data).then(
        () => Swal.fire('Mails Copied')
    );
}

function down_csv_clk() {

    var event_categ_data = (reg_data["events"][event_categ_select.value])
    var event_reg_data;

    if (event_categ_data)
        event_reg_data = event_categ_data[event_select.value];

    // if(!event_reg_data) return;


    var cnt = 1;


    // var str1 = reg_table_cont.innerHTML.replaceAll(/\s*\n\s*/g, "");
    // var str2 = str1.replaceAll(/<tr.*?>/g, "");
    // var str3 = str2.replaceAll(/<\/tr>/g,'\n');
    // var str4 = str3.replaceAll(/<td.*?>/g, "");
    // var str5 = str4.replaceAll(/<\/td>/g,',');



    var reg_table_cont_inner = [`Team No., NAME, YEAR, COLLEGE, DEPT, EMAIL, PHONE\n`];

    var cnt = 0;

    if (event_categ_select.value == "passes") {
        var user_data = reg_data["users"];
        for (var memb in user_data) {
            if (!user_data[memb]["pass"])
                continue;
            if (user_data[memb]["pass"][(event_select.value == 'mit_gold') ? 'gold' : event_select.value] == ((event_select.value == 'mit_gold') ? 'MIT' : 1)) {
                var memb_data = user_data[memb]['data'];
                ["name", 'year', 'college', 'dept', 'college', 'mobile'].forEach((e, i) => {
                    memb_data[e] = memb_data[e].replaceAll(",", "-");
                })
                cnt++;

                reg_table_cont_inner.push(`${cnt},${memb_data['name']},${memb_data['year']},${memb_data['college']},${memb_data['dept']},${atob(memb)},${memb_data['mobile']}\n`);
            }

        }
    } else if (event_categ_select.value == "hostel_accom") {
        var user_data = reg_data["users"];


        for (var memb in user_data) {
            if (!user_data[memb]["hostel"])
                continue;
            if ((isSupAdmin && user_data[memb]["hostel"]["form"]) || (!isSupAdmin && (user_data[memb]["hostel"]["paid"] == 1))) {
                var memb_data = user_data[memb]['data'];
                if (!memb_data) continue;
                ["name", 'year', 'college', 'dept', 'college', 'mobile'].forEach((e, i) => {
                    memb_data[e] = memb_data[e].replaceAll(",", "-");
                })
                cnt++;

                reg_table_cont_inner.push(`${cnt},${memb_data['name']},${memb_data['year']},${memb_data['college']},${memb_data['dept']},${atob(memb)},${memb_data['mobile']}${isSupAdmin ? `,${user_data[memb]["hostel"]["paid"]},${user_data[memb]["hostel"]["food"]},${user_data[memb]["hostel"]["days"]}` : ''}\n`);

            }

        }



    } else {

        var event_categ_data = (reg_data["events"][event_categ_select.value])
        var event_reg_data;

        if (event_categ_data) {
            event_reg_data = event_categ_data[event_select.value];



            for (var team in event_reg_data) {


                if (event_reg_data[team]["paid"] != 1)
                    continue;

                cnt++;

                var memb_cnt = event_reg_data[team]["memb"].length;
                var memb_id = event_reg_data[team]["memb"][0];
                var memb_data = reg_data['users'][memb_id]['data'];
                ["name", 'year', 'college', 'dept', 'college', 'mobile'].forEach((e, i) => {
                    memb_data[e] = memb_data[e].replaceAll(",", "-");
                })
                reg_table_cont_inner.push(`${cnt},${memb_data['name']},${memb_data['year']},${memb_data['college']},${memb_data['dept']},${atob(memb_id)},${memb_data['mobile']}\n`);

                for (var i = 1; i < memb_cnt; i++) {
                    var memb_id = event_reg_data[team]["memb"][i];
                    var memb_data = reg_data['users'][memb_id]['data'];
                    ["name", 'year', 'college', 'dept', 'college', 'mobile'].forEach((e, i) => {
                        memb_data[e] = memb_data[e].replaceAll(",", "-");
                    })
                    reg_table_cont_inner[reg_table_cont_inner.length - 1] += `${cnt},${memb_data['name']},${memb_data['year']},${memb_data['college']},${memb_data['dept']},${atob(memb_id)},${memb_data['mobile']}\n`
                }
            }

        }
    }

    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(reg_table_cont_inner.join("")));
    element.setAttribute('download', event_select.value + "_registrations.csv");

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}


async function revert_processing(pay_stat, event_categ, event_name, uid) {
    if (!isSupAdmin)
        return;

    if (pay_stat != "0") {
        return;
    }
    var result = await Swal.fire({
        title: 'REVERT',
        text: `Revert Payment Processing Status ?`,
        showCancelButton: true,
        confirmButtonText: 'YES',
        confirmButtonColor: 'green',
        backdrop: 'rgba(0,0,0,0.8)',

    })

    if (!result.isConfirmed) {
        return;
    }



    if (event_categ == "pass") {
        fetch(`https://efocus2k22-default-rtdb.firebaseio.com/users/${uid}/pass/${event_name}.json`, {
            method: 'put',
            body: JSON.stringify('Trans Fail')
        }).then(() => refresh_clk())
        return;
    }

    if (event_categ == "hostel_food") {
        fetch(`https://efocus2k22-default-rtdb.firebaseio.com/users/${uid}/hostel/food.json`, {
            method: 'put',
            body: JSON.stringify('Trans Fail')
        }).then(() => refresh_clk())
        return;
    }

    if (event_categ == "hostel") {
        fetch(`https://efocus2k22-default-rtdb.firebaseio.com/users/${uid}/hostel/paid.json`, {
            method: 'put',
            body: JSON.stringify('Trans Fail')
        }).then(() => refresh_clk())
        return;
    }

    fetch(`https://efocus2k22-default-rtdb.firebaseio.com/events/${event_categ}/${event_name}/${uid}/paid.json`, {
        method: 'put',
        body: JSON.stringify('Trans Fail')
    }).then(() => refresh_clk())

}

function add_btn_clk() {
    if (!isSupAdmin) return;

    [1,2,3,4,5].forEach((e,i)=>{
        if(e!=1) document.getElementById(`member${e}`).classList.add('hidden');
        document.getElementById(`memb${e}_name_txt`).value = "";
    })
    memb_cnt = 1;
    memb_cnt_span.innerHTML = memb_cnt;
    modal_register.classList.remove('hidden');

}

function change_member_cnt(inc) {

    var event_name = event_select.value;
    var max_memb_cnt = (max_memb_cnt_obj[event_name]) || 3;


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


async function register_clk() {


    // TODO : write logic for pass, workshop, hostel; 
    // show reg_done


    var event_name = event_select.value;
    var event_categ = event_categ_select.value;
    var email_enc = btoa(memb1_name_txt.value);

    if (event_categ == "passes") {
    
        var this_name = await getRegisteredName(email_enc);
        if(!this_name){
            Swal.fire({
                title: 'EFocus Registration',
                text: `Not Signed up!`,
            })
            return;
        }

        var db_update = {};
        db_update[`users/${email_enc}/pass/${event_name}`] = 1;

        Swal.fire({
            title: 'EFocus Registration',
            text: `Buy ${event_name} pass`,
            showCancelButton: true,
            confirmButtonText: 'Confirm ?',
            confirmButtonColor: 'green',
            backdrop: 'rgba(0,0,0,0.8)',
            showLoaderOnConfirm: true,
            preConfirm: () => {
                // var db = firebase.database();
                // return db.ref().update(db_update);

                return Promise.all([
                    fetch("https://efocus2k22-default-rtdb.firebaseio.com/.json", {
                        method: 'PATCH',
                        body: JSON.stringify(db_update)
                    }),
                    fetch("https://k04rx2nfda.execute-api.us-east-2.amazonaws.com/default/efocus-event-reg", {
                        method: 'post',
                        body: JSON.stringify({
                            mails: [memb1_name_txt.value],
                            names: [this_name],
                            event_categ: "pass",
                            event_name: event_name,
                            event_cost: event_cost[event_name]
                        })
                    })
                ]);
            }
        }).then((result) => {

            if (result.isConfirmed) {
                modal_register.classList.add('hidden');
                refresh_clk();
                return;
        
            }
        })

        return;
    }


    // var db = firebase.database();
    var team_emails_enc = []; // = [email_enc];
    var team_emails = []; // = [memb1_name_txt.value];

    var isWorkshop = event_categ == "workshops";
    var isGaming = event_categ == "gaming";
    var isProjectOrPaper = (event_name == "PAPER PRESENTATION") || (event_name == "PROJECTINA");


    for (var i = 1; i <= memb_cnt; i++) {
        var memb_email = document.getElementById(`memb${i}_name_txt`).value;
        team_emails.push(memb_email);

        var memb_email_enc = btoa(memb_email)
        if (team_emails_enc.indexOf(memb_email_enc) != -1 || memb_email_enc == '') {
            Swal.fire({
                title: 'EFocus Registration',
                text: `Please check the Mail Id`,
            })
            return;
        }
        team_emails_enc.push(memb_email_enc);
    }


    var team_memb_names = (await Promise.all(team_emails_enc.map((e, i) => getRegisteredName(e))));
    if (!team_memb_names.every((e) => e)) {
        Swal.fire({
            title: 'EFocus Registration',
            text: `Please ensure all your Team Members have signed up`,
        })
        return;
    };


    if (event_name == "HOPE CIRCUIT") {
        if (!(await Promise.all(team_emails_enc.map((e, i) => checkMIT(e)))).every((e) => e)) {
            Swal.fire({
                title: 'EFocus Registration',
                text: `Event only for MIT Students`,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK',
            });
            return;
        };
    }




    if (!(isWorkshop || isGaming || isProjectOrPaper || event_name == "HOPE CIRCUIT")) {

        if (!(await Promise.all(team_emails_enc.map((e, i) => haveValidPass(e, event_categ)))).every((e) => e)) {
            Swal.fire({
                title: 'EFocus Registration',
                text: `Please purchase any of the eligible passes to register for the events`,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK',
            })
            return;
        };
    }


    if (isProjectOrPaper) {

        if (!(await Promise.all(team_emails_enc.map((e, i) => haveValidPass(e, event_categ)))).some((e) => e)) {
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
    db_update[`events/${event_categ}/${event_name}/${email_enc}/paid`] = 1;

    Swal.fire({
        title: 'EFocus Registration',
        text: `Register for event ${event_name}`,
        showCancelButton: true,
        confirmButtonText: 'Confirm',
        confirmButtonColor: 'green',
        backdrop: 'rgba(0,0,0,0.8)',
        showLoaderOnConfirm: true,
        preConfirm: () => {


            return Promise.all([
                fetch("https://efocus2k22-default-rtdb.firebaseio.com/.json", {
                    method: 'PATCH',
                    body: JSON.stringify(db_update)
                }),
                fetch("https://k04rx2nfda.execute-api.us-east-2.amazonaws.com/default/efocus-event-reg", {
                    method: 'post',
                    body: JSON.stringify({
                        mails: team_emails,
                        names: team_memb_names,
                        event_categ: event_categ,
                        event_name: event_name,
                        event_cost: "123"
                    })
                })
            ]);

        }
    }).then((result) => {


        if (result.isConfirmed) {
            
            modal_register.classList.add('hidden');
            refresh_clk();
            return;
        
        }
    })


}

async function getRegisteredName(email_enc) {
    return new Promise((resolve, reject) => {

        var val = reg_data['registered'][email_enc];
        if (val)
            resolve(val)
        else
            resolve(false);

    })


}


async function checkMIT(email_enc) {
    return new Promise((resolve, reject) => {

        var val = reg_data['registered'][email_enc];

        if (!val) {
            resolve(false);
            return;
        }

        resolve(val == "Madras Institute of Technology");

    })


}


async function haveValidPass(email_enc, event_categ) {
    return new Promise((resolve, reject) => {

        var val = reg_data['users'][email_enc]['pass'];

        if (!val) {
            resolve(false);
            return;
        }

        var supported_passes = {
            "tech_events": ['gold', 'silver', 'tech'],
            "non_tech_events": ['gold', 'silver', 'non_tech'],
            "premium_events": ['gold', 'premium'], "placements": ['gold', 'silver', 'premium', 'tech']
        }


        var purchased_pass = [];
        Object.keys(val).forEach((e, i) => {
            if (val[e] == 1 || val[e] == "MIT") purchased_pass.push(e);
        })
        resolve(purchased_pass.filter((x) => supported_passes[event_categ].includes(x)).length > 0); //union of purchased pass and valid pass

    })


}
