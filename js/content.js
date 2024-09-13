const browser = window.browser || window.chrome;
const tweakter = {
    scrollAmount:300, // Threshold to trigger ad removal (in pixels)
    lastScrollY:0, // Store the previous scroll position
    tweaks:{
        adds: false,
        foryou: false,
        trending: true,
        notifications:true
    },
    async init(){
        this.utils.activateListeners();
        this.syncTweaks();
        this.runTweaks();

    },
    syncTweaks(){
        if(localStorage.getItem('tweaks') === null){
            this.saveTweaks();
        }else{
            this.tweaks = JSON.parse(localStorage.getItem('tweaks'));
        }
    },
    saveTweaks(){
        localStorage.setItem('tweaks', JSON.stringify(this.tweaks));
    },
    runTweaks(){
        Object.entries(this.tweaks).forEach(([key,value])=>{
            if(!value){
                console.log(this);
                this.tweakRunners[key]();
            }
        });
    },
    tweakRunners:{
            adds(){
                window.addEventListener("load", removeAdds); // Call once on page load
                window.addEventListener("scroll", onScroll); // Call onScroll function on scroll
                function onScroll() {
                    const currentScrollY = window.scrollY; // Get current scroll position

                    // Check if scrolled amount is greater than or equal to the threshold
                    // and the scroll direction has changed (prevents excessive calls)
                    if (Math.abs(currentScrollY - tweakter.lastScrollY) >= tweakter.scrollAmount) {
                        removeAdds();
                        tweakter.lastScrollY = currentScrollY; // Update last scroll position
                    }
                }
                function removeAdds(){
                    console.log('Twitter ad remover function called!');
                    if (document.querySelector('[data-testid=placementTracking]')) {
                        document.querySelectorAll('[data-testid=placementTracking] article').forEach(ad => {
                            ad.parentNode.parentNode.remove();
                        });
                    }
                }
            },
            foryou(){
                let newCSS = document.createElement('style');
                newCSS.innerHTML = `div[role="tablist"] > div[role="presentation"]:has(a):first-child {display: none !important;}`;
                document.head.appendChild(newCSS);
                //console.log("For you remover function called!");
            },
            trending(){},
            notifications(){}
    },
    jobs:{
        updateTweaks(payload){
            console.log("Dogru tabi yakaladi");
            let checks = JSON.parse(payload);
            Object.entries(checks).forEach(([key, value])=>{
                tweakter.tweaks[key] = value;
            });
            tweakter.saveTweaks();
            tweakter.runTweaks();
        }
    },
    utils:{
        sendMessageToPopup(messageObject){browser.runtime.sendMessage(messageObject)},
        activateListeners(){
            browser.runtime.onMessage.addListener(async (request)=>{
                let request = JSON.parse(request);
                let jobType = request.type;
                let payload = request.payload;
                if(this.jobs[jobType]){
                    this.jobs[jobType](payload)
                }
                else{
                    console.log("No job found with the specified type: ", jobType);
                }
                
            })
        },

    }
}

window.addEventListener('load', () => tweakter.init());