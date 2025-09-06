const countriesStorePath = "countries/myCantry.json";

let countriesStore
let curruntCountry = ""
let method = ""
let curruntGovernorate = ""
let curruntDate = ""

function convertTo12Hour(time24) {
    const [hourStr, minute] = time24.split(":");
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
  
    hour = hour % 12 || 12; // convert 0 -> 12, 13 -> 1, etc.
  
    return `${hour}:${minute} ${ampm}`;
}

function getDateNow(){
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

function getCurrentDate(){
   document.getElementById("date").value = getDateNow()
   curruntDate = getDateNow()
}
getCurrentDate()



document.getElementById("date").addEventListener("change", (el)=>{
    curruntDate = el.target.value // تعني العنصر الذي اثار الحدث el.target
})



fetch(countriesStorePath)
.then((response  =>{
    if(!response.ok){
        alert("ERROR");
    }
    return response.json();
}))
.then((countries =>{

    countriesStore = countries
    for(let countrie of countries){
        var opt = document.createElement("option")
        opt.value = countrie.codeName
        opt.innerHTML = countrie.name
        opt.className+="cantryLoop"
        document.getElementById("cantry").appendChild(opt)
    }

    
}))



document.getElementById("cantry").addEventListener("change", (el)=>{

    curruntCountry = el.target.value;
    document.getElementById("states").innerHTML = ""

    for(let countrie of countriesStore){


        if(countrie.codeName == el.target.value){
            method = countrie.method
            console.log(method)

            for(let Governorate of countrie.Governorates){
                var opt = document.createElement("option")
                opt.value = Governorate.GovernoratesCode
                opt.innerHTML = Governorate.name
                document.getElementById("states").appendChild(opt)
            }


            break;
        }
    }
    
})
document.getElementById("states").addEventListener("change", (el)=>{
    curruntGovernorate = el.target.value; 
})



function getPrayerTimes(){

    if(curruntCountry!="" && curruntGovernorate!=""){
        fetch(`https://api.aladhan.com/v1/timingsByCity/${curruntDate.split('-').reverse().join('-')}?city=${curruntGovernorate}&country=${curruntCountry}&method=${method}`)
        .then((response)=>{
            if(response.ok){
                return response.json()
            }
            else{
                document.getElementById("dataContent").innerHTML = `                
                <div class="datalyot">
                            لا توجد بيانات
                </div>`;
            }
        })
        .then((data)=>{
            console.log(data.data.timings)

            document.getElementById("dataContent").innerHTML = ``;

            document.getElementById("dataContent").innerHTML =  `   
            
            <div class="datalyot">
                <div class="time">${convertTo12Hour(data.data.timings.Fajr)}</div>
                <div class="faredha">صلاة الفجر</div>
            </div>
            <div class="datalyot">
                <div class="time">${convertTo12Hour(data.data.timings.Sunrise)}</div>
                <div class="faredha">الشروق</div>
            </div>
            <div class="datalyot">
                <div class="time">${convertTo12Hour(data.data.timings.Dhuhr)}</div>
                <div class="faredha">صلاة الظهر</div>
            </div>
            <div class="datalyot">
                <div class="time">${convertTo12Hour(data.data.timings.Asr)}</div>
                <div class="faredha">صلاة العصر</div>
            </div>
            <div class="datalyot">
                <div class="time">${convertTo12Hour((data.data.timings.Maghrib))}</div>
                <div class="faredha">صلاة المغرب</div>
            </div>
            <div class="datalyot">
                <div class="time">${convertTo12Hour(data.data.timings.Isha)}</div>
                <div class="faredha">صلاة العشاء</div>
            </div>


            `
        })
    }
    else{
        document.getElementById("dataContent").innerHTML = `                
        <div class="datalyot">
                يرجى تحديد الدوله والمدينه  
        </div>`;
    }
    
}






