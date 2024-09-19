const browser = window.browser || window.chrome;
const tweakter = {
    scrollAmount:300, // Threshold to trigger ad removal (in pixels)
    lastScrollY:0, // Store the previous scroll position
    isTargetObserverActive: false,
    eventListenerBucket:[],
    tweaks:{
        ads: true,
        foryou: true
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
                //console.log(key, " must be run now!")
                tweakter.tweakRunners[key](value);
        });
        // Set Observer for ads
        this.utils.activateObservers();
    },
    tweakRunners:{
            ads(isIt){
                if(isIt){
                    tweakter.eventListenerBucket.push(window.addEventListener("load", tweakter.jobs.removeAds)); // Call once on page load
                    tweakter.eventListenerBucket.push(window.addEventListener("scroll", onScroll)); // Call onScroll function on scroll
                    function onScroll() {
                        const currentScrollY = window.scrollY; // Get current scroll position
    
                        // Check if scrolled amount is greater than or equal to the threshold
                        // and the scroll direction has changed (prevents excessive calls)
                        if (Math.abs(currentScrollY - tweakter.lastScrollY) >= tweakter.scrollAmount) {
                            tweakter.jobs.removeAds();
                            tweakter.lastScrollY = currentScrollY; // Update last scroll position
                        }
                    }
                }else{
                    tweakter.eventListenerBucket = [];
                }

            },
            foryou(isIt){
                //console.log("foryou metodu cagirildi");
                
                if(isIt){
                    if(document.getElementById('foryou-remover')) return;
                    let intervalCounter = 0;
                    const tabElementLookUpInterval = setInterval(() => {
                        const tabElement = document.querySelector(`div[role="tablist"] > div[role="presentation"]:has(a):nth-child(2) a`);
                        if (tabElement && window.location.href.includes('x.com/home')) {
                            tabElement.click();
                            clearInterval(tabElementLookUpInterval);
                        }else if(intervalCounter > 30){
                            clearInterval(tabElementLookUpInterval);
                            console.log("Couldn't find the element after 10 tries, gonna give up!");
                        }
                        intervalCounter++;
                    }, 375);
                    let newCSS = document.createElement('style');
                    newCSS.id = 'foryou-remover';
                    newCSS.innerHTML = `div[role="tablist"] > div[role="presentation"]:has(a):first-child {display: none !important;}`;
                    document.head.appendChild(newCSS);
                }else{
                    if(document.getElementById('foryou-remover')){
                        document.getElementById('foryou-remover').remove();
                        if(window.location.href.includes('x.com/home')){
                            document.querySelector(`div[role="tablist"] > div[role="presentation"]:has(a):nth-child(1) a`).click();
                        }
                        
                    }
                }
                
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
            tweakter.syncTweaks();
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
                console.log(request);
                let jobType = request.type;
                //console.log(jobType);
                let payload = JSON.parse(request.payload);
                //console.log(payload);
                //tweakter.jobs[jobType](payload);
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