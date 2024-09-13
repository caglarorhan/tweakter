const browser = window.browser || window.chrome;
const tweakter = {
    scrollAmount:300, // Threshold to trigger ad removal (in pixels)
    lastScrollY:0, // Store the previous scroll position
    tweaks:{
        ads: false,
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
                console.log(key, " must be run now!")
                tweakter.tweakRunners[key]();
            }
        });
    },
    tweakRunners:{
            ads(){
                window.addEventListener("load", removeAds); // Call once on page load
                window.addEventListener("scroll", onScroll); // Call onScroll function on scroll
                function onScroll() {
                    const currentScrollY = window.scrollY; // Get current scroll position

                    // Check if scrolled amount is greater than or equal to the threshold
                    // and the scroll direction has changed (prevents excessive calls)
                    if (Math.abs(currentScrollY - tweakter.lastScrollY) >= tweakter.scrollAmount) {
                        removeAds();
                        tweakter.lastScrollY = currentScrollY; // Update last scroll position
                    }
                }
                function removeAds(){
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
            Object.entries(payload).forEach(([key, value])=>{
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
                console.log(request);
                let jobType = request.type;
                let payload = JSON.parse(request.payload);
                if(tweakter.jobs[jobType]){
                    tweakter.jobs[jobType](payload)
                }
                else{
                    console.log("No job found with the specified type: ", jobType);
                }
                
            })
        },

    }
}

window.addEventListener('load', () => tweakter.init());