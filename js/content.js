const browser = window.browser || window.chrome;
const tweakter = {
    scrollAmount:300, // Threshold to trigger ad removal (in pixels)
    lastScrollY:0, // Store the previous scroll position
    isTargetObserverActive: false,
    tweaks:{
        ads: false,
        foryou: false
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
        // Set Observer for ads
        this.utils.activateObservers();
    },
    tweakRunners:{
            ads(){
                window.addEventListener("load", tweakter.jobs.removeAds); // Call once on page load
                window.addEventListener("scroll", onScroll); // Call onScroll function on scroll
                function onScroll() {
                    const currentScrollY = window.scrollY; // Get current scroll position

                    // Check if scrolled amount is greater than or equal to the threshold
                    // and the scroll direction has changed (prevents excessive calls)
                    if (Math.abs(currentScrollY - tweakter.lastScrollY) >= tweakter.scrollAmount) {
                        tweakter.jobs.removeAds();
                        tweakter.lastScrollY = currentScrollY; // Update last scroll position
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
            console.log("Dogru tabi yakaladi", payload);
            Object.entries(payload).forEach(([key, value])=>{
                tweakter.tweaks[key] = value;
            });
            tweakter.saveTweaks();
            tweakter.runTweaks();
        },
        getTweaks(){
            console.log("getTweaks talebi geldi ve yanit gonderiliyor");
            tweakter.utils.sendMessageToPopup({type:"updateCheckboxes", payload:JSON.stringify(tweakter.tweaks)});
            return true;
        },
        removeAds(){
            //console.log('Twitter ad remover function called!');
            if (document.querySelector('[data-testid=placementTracking]')) {
                document.querySelectorAll('[data-testid=placementTracking] article').forEach(ad => {
                    ad.parentNode.parentNode.remove();
                });
            }
        }
    },
    utils:{
        sendMessageToPopup(messageObject){browser.runtime.sendMessage(messageObject)},
        activateListeners(){
            browser.runtime.onMessage.addListener( (request)=>{
                //console.log(request);
                let jobType = request.type;
                //console.log(jobType);
                let payload = JSON.parse(request.payload);
                //console.log(payload);
                tweakter.jobs[jobType](payload);
                if(tweakter.jobs[jobType]){
                    //console.log(jobType, " job found and running");
                    tweakter.jobs[jobType](payload)
                }
                else{
                    console.log("No job found with the specified type: ", jobType);
                }
                
            })
        },
        activateObservers(){
            if (this.isTargetObserverActive) {
                console.log("Observer is already active.");
                return;
            }
    
            const checkForTargetNode = () => {
                const targetNode = document.querySelector('[role="region"]');
                if (targetNode) {
                    const config = { childList: true, subtree: true };
                    const callback = function(mutationsList, observer) {
                        for (let mutation of mutationsList) {
                            if (mutation.type === 'childList') {
                                tweakter.jobs.removeAds();
                            }
                        }
                    };
                    const observer = new MutationObserver(callback);
                    observer.observe(targetNode, config);
                    this.isTargetObserverActive = true;
                    console.log("Observer has been set up.");
                } else {
                    console.log("Target node not found, retrying...");
                    setTimeout(checkForTargetNode, 500); // Retry after 1 second
                }
            };
            checkForTargetNode();
        }

    }
}

window.addEventListener('load', () => tweakter.init());