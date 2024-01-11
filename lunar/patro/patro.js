var view = 2;



function add_public_holiday(query_year) {
    var public_holidays = JSON.parse("{}");
    var public_holiday_req = new XMLHttpRequest();
    var public_holiday_url = 'https://bhaishrayeshdahal.github.io/shrayesh-dahal/data/public_holidays.json';
    
    public_holiday_req.open('GET', public_holiday_url, true);
    public_holiday_req.onload = function() {
        public_holidays = JSON.parse(this.response);
        if (public_holiday_req.status === 200) {
            var public_holidays_keys_list = Object.keys(public_holidays[query_year]).slice(1,-1).sort();
            var span_list = document.getElementsByClassName("lunar_event");
            for(var i = 0; i < span_list.length; i++) {
                if (public_holidays_keys_list.includes(span_list[i].id)) {
                    span_list[i].classList.add(public_holidays[query_year][span_list[i].id][1]);
                }
            }
        }
        else {
            console.warn('Cannot fetch Public Holiday Data for Lunar Events');
        }
    }
    public_holiday_req.send();
}

function show_national_event() {
    var nat_events = JSON.parse("{}");
    var nat_event_req = new XMLHttpRequest();
    var national_event_url = 'https://bhaishrayeshdahal.github.io/shrayesh-dahal/data/national_events.json';
    
    nat_event_req.open('GET', national_event_url, true);
    nat_event_req.onload = function() {
        nat_events = JSON.parse(this.response);
        if (nat_event_req.status === 200) {
            console.info('National Events Fetched');
            span_html = "";
            var nat_events_keys_list = Object.keys(nat_events["data"]).slice(1).sort();
            var index = 1;
            nat_events_keys_list.forEach(key => {
                key_list = key.split("-");
                nat_events["data"][key][1].split("/").forEach(event => {
                    span_html += "<span id='" + key + "_NP'>[" + arabic_numbertext_to_nepali(index) + "] ";
                    span_html += BS_MONTHS_NEP[key_list[0] - 1] + " " + arabic_numbertext_to_nepali(parseInt(key_list[1])) + " गते - ";
                    span_html += event;
                    span_html += "</span>";
                });

                nat_events["data"][key][0].split("/").forEach(event => {
                    span_html += "<span id='" + key + "_EN'>[" + index + "] ";
                    span_html += BS_MONTHS_ENG[key_list[0] - 1] + " " + parseInt(key_list[1]) + " - ";
                    span_html += event;
                    span_html += "</span>";
                });
                span_html += "<br />";
                index++;
            });
            document.getElementById("main_div").innerHTML = span_html;

            var all_spans = document.getElementById("main_div").getElementsByTagName("span");
            for(var i = 0; i < all_spans.length; i++) {
                all_spans[i].setAttribute("title", all_spans[i].innerText);
            }
        }
        else {
            console.warn('Cannot fetch National Events Data');
        }
    }
    nat_event_req.send();
}

var day_event_array = null;
var lunar_events = "";

function show_lunar_event() {
    var query_year = document.getElementById("year").value;
    
    lunar_events = JSON.parse("{}");
    var lunar_event_req = new XMLHttpRequest();
    var lunar_event_url = "https://bhaishrayeshdahal.github.io/shrayesh-dahal/data/" + query_year + "_detailed.json";
    
    lunar_event_req.open('GET', lunar_event_url, true);
    lunar_event_req.onload = function() {
        lunar_events = JSON.parse(this.response);
        if (lunar_event_req.status === 200) {
            console.info('Lunar Events Fetched');
            
            span_html = '</span>';
            span_html += '</span>';
            
            var index = 1;
            for(var month = 0; month < 12; month++) {
                for(var date = 0; date < BS_CALENDAR_DATA[query_year][month]; date++) {
                    day_event_array = lunar_events["data"][month][date];
                    var has_events = false;
                    if(day_event_array.lunar_event_one != "") {
                        span_html += "<span class='lunar_event' id=" + day_event_array.date.slice(5,10) +">२०८०-";
                        span_html += BS_MONTHS_NEP[month] + " " + arabic_numbertext_to_nepali(parseInt(date + 1)) + " गते -";
                        var ad_date = new Date(convert_bs_to_ad(query_year, month + 1, date + 1));
                        var day_of_week = NEPALI_DAYS_ABBR[ad_date.getDay()];
                        if(ad_date.getDay() == 6) {
                            
                        }
                        else {
                          
                        }
                       
                        span_html += day_event_array.lunar_event_one;
                        has_events = true;
                    }
                    if(day_event_array.lunar_event_two != "") {
                        if(day_event_array.lunar_event_one == "") {
                            span_html += "<span class='lunar_event' id=" + day_event_array.date.slice(5,10) +">[" + arabic_numbertext_to_nepali(index++) + "] ";
                            span_html += BS_MONTHS_NEP[month] + " " + arabic_numbertext_to_nepali(parseInt(date + 1)) + " गते";
                            var ad_date = new Date(convert_bs_to_ad(query_year, month + 1, date + 1));
                            var day_of_week = NEPALI_DAYS_ABBR[ad_date.getDay()];
                            if(ad_date.getDay() == 6) {
                                span_html += "<span class='day_of_week saturday'> (" + day_of_week + ")</span>";
                            }
                            else {
                                span_html += "<span class='day_of_week'> (" + day_of_week + ")</span>";
                            }
                            span_html += "<span class='pakshya'>&nbsp;(" + day_event_array.pakshya.slice(0, -4) + "&nbsp;" + day_event_array.tithi + ")</span> - ";
                            span_html += day_event_array.lunar_event_two;
                        }
                        else {
                            span_html += ", " + day_event_array.lunar_event_two;
                        }
                        has_events = true;
                    }
                    if(day_event_array.lunar_event_three != "") {
                        if(day_event_array.lunar_event_one == "" && day_event_array.lunar_event_two == "") {
                            span_html += "<span class='lunar_event' id=" + day_event_array.date.slice(5,10) +">[" + arabic_numbertext_to_nepali(index++) + "] ";
                            span_html += BS_MONTHS_NEP[month] + " " + arabic_numbertext_to_nepali(parseInt(date + 1)) + " गते";
                            var ad_date = new Date(convert_bs_to_ad(query_year, month + 1, date + 1));
                            var day_of_week = NEPALI_DAYS_ABBR[ad_date.getDay()];
                            if(ad_date.getDay() == 6) {
                                span_html += "<span class='day_of_week saturday'> (" + day_of_week + ")</span>";
                            }
                            else {
                                span_html += "<span class='day_of_week'> (" + day_of_week + ")</span>";
                            }
                            span_html += "<span class='pakshya'>&nbsp;(" + day_event_array.pakshya.slice(0, -4) + "&nbsp;" + day_event_array.tithi + ")</span> - ";
                            span_html += day_event_array.lunar_event_three;
                        }
                        else {
                            span_html += ", " + day_event_array.lunar_event_three;
                        }
                        has_events = true;
                    }
                    if(has_events) {
                        span_html += "</span>";
                    }
                }
                if(month != 11) {
                    span_html += "<br />";
                }
            }
            
            document.getElementById("main_div").innerHTML = span_html;
            add_public_holiday(query_year);  
            
            var national_holiday_count = document.getElementsByClassName("national").length;
            var special_holiday_count = document.getElementsByClassName("specific").length;
            document.getElementById("national_holiday_count").innerHTML = arabic_numbertext_to_nepali(national_holiday_count);
            document.getElementById("special_holiday_count").innerHTML = arabic_numbertext_to_nepali(special_holiday_count);

            var all_spans = document.getElementById("main_div").getElementsByTagName("span");
            for(var i = 0; i < all_spans.length; i++) {
                if(all_spans[i].id != "") {
                    all_spans[i].innerHTML = all_spans[i].innerHTML.replaceAll(" /", ",");
                    all_spans[i].setAttribute("title", all_spans[i].innerText.split(/-(.*)/)[1]);
                }
            }
        }
        else {
            console.warn('Cannot fetch Lunar Events Data');
        }
    }
    lunar_event_req.send();
}

function show_public_holiday() {
    var query_year = document.getElementById("year").value;
    
    var public_holidays = JSON.parse("{}");
    var public_holiday_req = new XMLHttpRequest();
    var public_holiday_url = 'https://bhaishrayeshdahal.github.io/shrayesh-dahal/data/public_holidays.json';
    
    public_holiday_req.open('GET', public_holiday_url, true);
    public_holiday_req.onload = function() {
        public_holidays = JSON.parse(this.response);
        if (public_holiday_req.status === 200) {
            console.info('Public Holiday Fetched');
            span_html = '<span style="color:crimson">&#9724; - सार्वजनिक बिदा (Public Holiday) (जम्माः <span id="national_holiday_count"></span> दिन)</span>';
            span_html += '<span style="color:darkblue">&#9724; -  विशेष बिदा (Special Holiday) (जम्माः <span id="special_holiday_count"></span> दिन)</span><br />';
            var public_holidays_keys_list = Object.keys(public_holidays[query_year]).slice(1,-1).sort();
            if (query_year == 2080) {
                public_holidays_keys_list = Object.keys(public_holidays[query_year]).slice(1,-2).sort();
            }
            var index = 1;
            public_holidays_keys_list.forEach(key => {
                key_list = key.split("-");
                span_html += "<span id='" + key + "_NP' class=" + public_holidays[query_year][key][1] + ">";
                span_html += "[" + arabic_numbertext_to_nepali(index) + "] ";
                span_html += BS_MONTHS_NEP[key_list[0] - 1] + " " + arabic_numbertext_to_nepali(parseInt(key_list[1])) + " गते";
                var ad_date = new Date(convert_bs_to_ad(query_year, parseInt(key_list[0]), parseInt(key_list[1])));
                var day_of_week = NEPALI_DAYS[ad_date.getDay()];
                if(ad_date.getDay() == 6) {
                    span_html += "<span class='weekday saturday'> (" + day_of_week + ")</span>";
                }
                else {
                    span_html += "<span class='weekday'> (" + day_of_week + ")</span>";
                }
                span_html += " - " + public_holidays[query_year][key][3];
                span_html += "</span>";

                span_html += "<span id='" + key + "_EN' class=" + public_holidays[query_year][key][1] + ">";
                span_html += "[" + index + "] ";
                span_html += BS_MONTHS_ENG[key_list[0] - 1] + " " + parseInt(key_list[1]);
                var ad_date = new Date(convert_bs_to_ad(query_year, parseInt(key_list[0]), parseInt(key_list[1])));
                var day_of_week = ENGLISH_DAYS[ad_date.getDay()];
                if(ad_date.getDay() == 6) {
                    span_html += "<span class='weekday saturday'> (" + day_of_week + ")</span>";
                }
                else {
                    span_html += "<span class='weekday'> (" + day_of_week + ")</span>";
                }
                span_html += " - " + public_holidays[query_year][key][0];
                span_html += "</span><br />";

                index++;
            });
            document.getElementById("main_div").innerHTML = span_html;
            var national_holiday_count = document.getElementsByClassName("national").length / 2;
            var special_holiday_count = document.getElementsByClassName("specific").length / 2;
            document.getElementById("national_holiday_count").innerHTML = arabic_numbertext_to_nepali(national_holiday_count);
            document.getElementById("special_holiday_count").innerHTML = arabic_numbertext_to_nepali(special_holiday_count);
            var special_note_div = document.getElementById("special_note");
            if (public_holidays[query_year].hasOwnProperty("special_note")) {
                special_note_div.innerHTML = "<span>नोटः- </span>" + public_holidays[query_year]["special_note"].toString().replace(/,\s([^,]+)$/, ' र $1') + '<br />';
                special_note_div.style.display = "block";
            }
            else {
                special_note_div.style.display = "none";
            }
            var all_spans = document.getElementById("main_div").getElementsByTagName("span");
            for(var i = 0; i < all_spans.length; i++) {
                if(all_spans[i].id != "") {
                    all_spans[i].innerHTML = all_spans[i].innerHTML.replaceAll(" /", ",");
                    all_spans[i].setAttribute("title", all_spans[i].innerText.split(/-(.*)/)[1]);
                }
            }
        }
        else {
            console.warn('Cannot fetch Public Holiday Data');
        }
    }
    public_holiday_req.send();
}

function show_international_event() {
    var internat_events = JSON.parse("{}");
    var internat_event_req = new XMLHttpRequest();
    var international_event_url = 'https://bhaishrayeshdahal.github.io/shrayesh-dahal/international_events.json';
    
    internat_event_req.open('GET', international_event_url, true);
    internat_event_req.onload = function() {
        internat_events = JSON.parse(this.response);
        if (internat_event_req.status === 200) {
            console.info('International Events Fetched');
            span_html = "";
            var internat_events_keys_list = Object.keys(internat_events["data"]).slice(1).sort();
            var index = 1;
            internat_events_keys_list.forEach(key => {
                key_list = key.split("-");
                internat_events["data"][key][0].split("/").forEach(event => {
                    span_html += "<span id='" + key +"_EN'>[" + index + "] ";
                    span_html += AD_MONTHS[key_list[0] - 1] + " " + parseInt(key_list[1]) + " - ";
                    span_html += event;
                    span_html += "</span>";
                });

                internat_events["data"][key][1].split("/").forEach(event => {
                    span_html += "<span id='" + key +"_NP'>[" + arabic_numbertext_to_nepali(index) + "] ";
                    span_html += AD_MONTHS_NEP[key_list[0] - 1] + " " + arabic_numbertext_to_nepali(parseInt(key_list[1])) + " - ";
                    span_html += event;
                    span_html += "</span>";
                });
                span_html += "<br />";
                
                index++;
            });
            document.getElementById("main_div").innerHTML = span_html;

            var all_spans = document.getElementById("main_div").getElementsByTagName("span");
            for(var i = 0; i < all_spans.length; i++) {
                all_spans[i].setAttribute("title", all_spans[i].innerText);
            }
        }
        else {
            console.warn('Cannot fetch International Events Data');
        }
    }
    internat_event_req.send();
}

function show_content(option=view) {
    view = option;
   
    document.getElementById("lunar_events").classList.remove("selected");
   
   
    document.getElementById("lunar_events").classList.add("not_selected");
   
   
    document.getElementById("year_select").style.display = "none";
    switch(option) {
       
        case 2:
            default:
            document.getElementById("lunar_events").classList.add("selected");
            document.getElementById("lunar_events").classList.remove("not_selected");
            document.getElementById("year_select").style.display = "block";
            document.getElementById("special_note").style.display = "none";
            show_lunar_event();
            set_saturday_color();
            view = 2;
           
       
       
    }
    scroll_to_today();
}

document.getElementById("year").value = DEFAULT_YEAR;
show_content(view);