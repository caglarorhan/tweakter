console.log("This will be the index.js file");
const browser = window.browser || window.chrome;
let tweakter ={
    targetDomain: "x.com",
    init(){
        console.log("Tweakter initialized");
        this.commonJobs();
    },
    sendMessageToContent:function (messageObject){
        browser.tabs.query({}, function (tabs) {
            console.log(tabs)
            let targetTab = tabs.find(tab => tab.url.includes(tweakter.targetDomain));
            console.log(targetTab);
            if (targetTab) {
                console.log("Evet hedef tabimiz bulundu")
                browser.tabs.sendMessage(targetTab.id, messageObject);
            } else {
                console.log("No tab found with the specified URL.");
            }
        });
    },
    commonJobs(){
        browser.runtime.onMessage.addListener(async (request)=>{
            let jobType = request.type;
            let payload = request.payload;
            this.jobs[jobType](payload)
        })

        document.querySelectorAll('input[type="checkbox"]').forEach((checkbox)=>{
                checkbox.addEventListener('change', (e)=>{
                    let checks = {};
                    document.querySelectorAll('input[type="checkbox"]').forEach((checkbox)=>{
                        console.log("Deger degisti:", checkbox.id, checkbox.checked);
                        checks[checkbox.id] = checkbox.checked;
                    })
                    this.sendMessageToContent({type:"updateTweaks", payload:JSON.stringify(checks)});
                })
        })

        this.sendMessageToContent({type:"getTweaks", payload:true});
    },
    jobs:{
        updateCheckboxes(payload){
            console.log(payload);
            let checks = JSON.parse(payload);
            Object.entries(checks).forEach(([key, value])=>{
                document.getElementById(key).checked = value?"checked":"";
            })
        },
    }

}

window.addEventListener('load', ()=>{
    tweakter.init();
})