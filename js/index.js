console.log("This will be the index.js file");
const browser = window.browser || window.chrome;
let tweakter ={
    targetDomains: ["twitter.com","x.com"],
    init(){
        console.log("Tweakter initialized");
        this.commonJobs();
    },
    sendMessageToContent:function (messageObject){

    browser.tabs.query({}, function (tabs) {
        console.log(tabs)
        let targetTab = tabs.find(tab => tab.url.includes("x.com"));
        //console.log("Evet hedef tabimiz bulundu")
        if (targetTab) {
            browser.tabs.sendMessage(targetTab.id, messageObject);
        } else {
            console.log("No tab found with the specified URL.");
        }
    });

    },
    commonJobs(){
        browser.runtime.onMessage.addListener(async (request)=>{
            this.jobs[request.type](request.payload)
        })

        document.querySelectorAll('input[type="checkbox"]').forEach((checkbox)=>{
                checkbox.addEventListener('change', (e)=>{
                    let checks = {};
                    document.querySelectorAll('input[type="checkbox"]').forEach((checkbox)=>{
                        checks[checkbox.name] = checkbox.checked;
                    })
                    this.sendMessageToContent({type:"updateTweaks", payload:JSON.stringify(checks)});
                })
        })
    },
    jobs:{
        updateCheckboxes(payload){
            let checks = JSON.parse(payload);
            Object.entries(checks).forEach(([key, value])=>{
                document.getElementByName(key).checked = value;
            })
        },
    }

}






window.addEventListener('load', ()=>{
    tweakter.init();
})