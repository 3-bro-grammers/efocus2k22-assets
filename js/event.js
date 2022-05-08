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
    feather.replace();

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


function getInitial(name) {
    var arr = name.split(' ');
    // if  name has single word set first and last char as initials
    return (arr[0].charAt(0) + (arr.length == 1 ? (arr[0].charAt(arr[0].length-1)) : (arr[arr.length - 1]).charAt(0))).toUpperCase();
}

// var query_par = new URLSearchParams(window.location.search);
var event_tab = location.hash;

fetch("assets/data/event_details.json").then((res) => res.json()).then((event_data) => {
    for (event_categ in event_data) {
        var categ_inner = "";
        for (cur_event in event_data[event_categ]) {
            if (cur_event.indexOf("TECHNOCRAT") > -1)
                continue;
            categ_inner += `<div class="md-max-w-30pc pointer bg-red-lightest-10 p-5 br-8 m-3" onclick="register_clk('${cur_event}','${event_categ}')">
                                <img src="https://3-bro-grammers.github.io/efocus2k22-assets/images/events/${cur_event}.jpg" style="width: 17rem">        
                                <p class="fw-800 max-w-100px fs-m1 red-lightest opacity-80 italic ls-wider" style="max-width: 17rem">${cur_event}</p>
                                <div class="fs-s1 red-lightest">${event_data[event_categ][cur_event]["short_desc"]}</div>
                            </div>`
        }
        document.getElementById(event_categ + "_cont_div").innerHTML = categ_inner;
        if(event_tab)
        document.getElementById("tab" + ["","#prem-tab", "#tech-tab","#non-tech-tab","#work-tab","#gaming-tab"].indexOf(event_tab)).checked = true;
    }   
});

["#prem-tab", "#tech-tab","#non-tech-tab","#work-tab","#gaming-tab"].forEach((e,i)=>{
    document.getElementById(`tab${i+1}`).onclick = ()=>(location.hash=e);
})

window.onhashchange = ()=>{
    document.getElementById("tab" + ["","#prem-tab", "#tech-tab","#non-tech-tab","#work-tab","#gaming-tab"].indexOf(location.hash)).checked = true;
}

function register_clk(event_name, event_categ) {
    location.href = `register.html?event_name=${event_name}&categ=${event_categ}`;
}