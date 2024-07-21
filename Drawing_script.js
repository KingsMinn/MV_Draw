document.addEventListener("DOMContentLoaded", () => {
    //GSAP Settings
    gsap.registerPlugin(CustomEase);
    CustomEase.create("superEase", "M0,0 C0,0.796 0.301,1 1,1");
    CustomEase.create("superEaseInOut", "M0,0 C0.181,0 0.25,0.27 0.354,0.523 0.489,0.851 0.628,1 1,1 ");

    //For test
    const numberOfCards = document.querySelector('#number-of-cards');
    const probability = document.querySelector('#probability');
    const textNumberOfCards = document.querySelector('#text-number-of-cards');
    const textProbability = document.querySelector('#text-probability');

    const bgSpacezoom = document.querySelector('.bg-spacezoom');

    textNumberOfCards.innerHTML = `Number of cards : ${numberOfCards.value}`;
    textProbability.innerHTML = `Probability of winning : ${probability.value}%`;

    numberOfCards.addEventListener('input', () => {
        textNumberOfCards.innerHTML = `Number of cards : ${numberOfCards.value}`;
    });
    probability.addEventListener('input', () => {
        textProbability.innerHTML = `Probability of winning : ${probability.value}%`;
    });

    //Intro animation
    let animation = lottie.loadAnimation({
        container: document.querySelector('.start-container'),
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: 'lottie/DrawStart.json',
    });

    animation.resize();
    
    let animationLoading = lottie.loadAnimation({
        container: document.querySelector('.loading'),
        renderer: 'svg',
        loop: false,
        autoplay: true,
        path: 'lottie/Loading.json'
    });

    animationLoading.addEventListener('complete', () => {
        document.querySelector('.loading-container').style.display = 'none';
        animation.playSegments([0, 100], true);

        bgGrid.style.opacity = 1;
    }, { once: true });

    //Skip Loading
    document.querySelector('.loading-container').addEventListener('click', () => {
        document.querySelector('.loading-container').style.display = 'none';
        animation.playSegments([0, 100], true);

        bgGrid.style.opacity = 1;
    });

    function loopSegment() {
        animation.removeEventListener('complete', loopSegment);
        animation.playSegments([45, 100], true);
        animation.addEventListener('complete', loopSegment);
        console.log("looped");
    }

    animation.addEventListener('complete', () => {
        loopSegment();
    }, { once: true });
    
    //Intro hover
    const startButton = document.querySelector('.start-button');
    const startContainer = document.querySelector('.start-container');
    const cardContainer = document.querySelector('.card-container');

    startButton.addEventListener('mouseover', () => { startContainer.style.transform = `scale(1.05)`; });
    startButton.addEventListener('mouseout', () => { startContainer.style.transform = `scale(1)`; });
    startButton.addEventListener('mousedown', () => { startContainer.style.transform = `scale(0.9)`; });
    startButton.addEventListener('mouseup', () => { startContainer.style.transform = `scale(1.1)`; });


    function setPosition(item){
        let rect = item.getBoundingClientRect();
        let x = (window.innerWidth / 2) - rect.left - (rect.width / 2);
        let y = window.innerHeight - rect.top;

        item.style.transform = `translateX(${x}px) translateY(${y}px) scale(2)`;
        item.style.opacity = 0;
    };

    const bgGrid = document.querySelector('.bg-grid');

    bgSpacezoom.pause();

    bgSpacezoom.addEventListener('ended', () => {
        bgSpacezoom.src = 'background/Spacezoom_Desktop_Loop.webm';
        bgSpacezoom.play();
    });

    let serialNumber = 5100;

    //Reveal Animation
    startButton.addEventListener("click", () => {

        let mobile = window.innerWidth < 767;
        
        if ( numberOfCards.value <= 8 + ( mobile * 1 ) ){ cardContainer.style.height = `auto`; }
        
        //Card Settings
        function revealCards(callback){
            for(i = 0; i < numberOfCards.value; i++){
                serialNumber++;
                let win = false;
                const setPrize = [5, 10, 20, 50];
                let prize = 0;
                const winProbability = Math.random();

                if (Math.random() < (probability.value / 100)){
                    win = true;

                    if (winProbability < 0.2)
                        {prize = setPrize[3];}
                    else if (winProbability < 0.4)
                        {prize = setPrize[2];}
                    else if (winProbability < 0.7)
                        {prize = setPrize[1];}
                    else
                        {prize = setPrize[0];}
                }
                
                if (win){
                    cardContainer.innerHTML += `
                    <div class="card win">
                    <svg class="card-shape" width="467" height="700" viewBox="0 0 467 700" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0 31.5C0 14.103 14.103 0 31.5 0H435.167C452.564 0 466.667 14.103 466.667 31.5V517.002C451.356 517.181 439 529.647 439 545C439 560.353 451.356 572.819 466.667 572.998V668.5C466.667 685.897 452.564 700 435.167 700H31.5C14.103 700 0 685.897 0 668.5V573C15.464 573 28 560.464 28 545C28 529.536 15.464 517 0 517V31.5Z" fill="white"/>
                    </svg>

                        <div class="card-inside">
                            <div class="card-number">
                                <svg xmlns="http://www.w3.org/2000/svg" width="125" height="38" viewBox="0 0 125 60" fill="none">
                                    <path d="M119.776 22.5232C117.673 31.5873 109.599 38 100.294 38H24.7061C15.4013 38 7.32575 31.5831 5.22333 22.5191L0 -3.8147e-06C54.7264 -3.8147e-06 63.4328 -3.8147e-06 125 -3.8147e-06C123.429 6.77229 121.456 15.2773 119.776 22.5232Z" fill="white"/>
                                </svg>
                                <p>#${serialNumber}</p>
                            </div>
                            <p class="card-prize">£${prize}</p>
                        </div>

                        <div class="card-message">
                            <span class="card-message-upper">You won</span>
                            <span class="card-message-below">£${prize}</span>
                        </div>
                    </div>`;
                }else{
                    cardContainer.innerHTML += `
                    <div class="card">
                        <svg class="card-shape" width="467" height="700" viewBox="0 0 467 700" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M0 31.5C0 14.103 14.103 0 31.5 0H435.167C452.564 0 466.667 14.103 466.667 31.5V517.002C451.356 517.181 439 529.647 439 545C439 560.353 451.356 572.819 466.667 572.998V668.5C466.667 685.897 452.564 700 435.167 700H31.5C14.103 700 0 685.897 0 668.5V573C15.464 573 28 560.464 28 545C28 529.536 15.464 517 0 517V31.5Z" fill="white"/>
                        </svg>
                        <div class="card-inside">
                            <div class="card-number">
                                <svg xmlns="http://www.w3.org/2000/svg" width="125" height="38" viewBox="0 0 125 60" fill="none">
                                    <path d="M119.776 22.5232C117.673 31.5873 109.599 38 100.294 38H24.7061C15.4013 38 7.32575 31.5831 5.22333 22.5191L0 -3.8147e-06C54.7264 -3.8147e-06 63.4328 -3.8147e-06 125 -3.8147e-06C123.429 6.77229 121.456 15.2773 119.776 22.5232Z" fill="white"/>
                                </svg>
                                <p>#${serialNumber}</p>
                            </div>
                            <p class="card-prize">Try<br>again</p>
                        </div>

                        <div class="card-message">
                            <span class="card-message-upper">Try again for up to</span>
                            <span class="card-message-below">£50</span>
                        </div>
                    </div>`;
                }
                
            }
            callback();
        }
        
        function spreadCards(){
            const cards = document.querySelectorAll('.card');
            
            cards.forEach((card, i) => {
                card.style.opacity = 0;
            });

            bgGrid.playbackRate = 15;
            bgSpacezoom.play();

            //Lottie Animation
            animation.playSegments([100, 150], true);

            animation.removeEventListener('complete', loopSegment);

            animation.addEventListener('complete', function() {
                if ( bgGrid.playbackRate == 15 ) { bgGrid.playbackRate = 10; }
                document.querySelector('.start-container').style.display = 'none';
                animation.removeEventListener('complete', loopSegment);
            }, { once: true });


            //Reveal Cards GSAP
            let timing = 1;

            cards.forEach((card, i, array) => {
                let rect = card.getBoundingClientRect();
                let row = 5;
                
                if ( mobile ){ row = 3; }

                const toScroll = card.offsetHeight + window.innerWidth/100*2;

                const remainScroll = cardContainer.scrollHeight - cardContainer.scrollTop - cardContainer.clientHeight;

                if ((i != 0) && (i % row == 0)){
                    timing += 0.46;
                }

                function animationEnd(){
                    card.classList.add('complete');

                    //Scroll Automatically
                    if ((i != 1) && ((i+1) % row == 0) && (mobile*6 < i+1)){
                        if (toScroll < remainScroll){
                            cardContainer.scrollBy({
                                top: toScroll,
                                behavior: 'smooth',
                            });
                        } else{
                            cardContainer.scrollBy({
                                top: remainScroll,
                                behavior: 'smooth',
                            });
                        }
                    }

                    //Enable Scroll After All of the Cards Revealed
                    if (i == array.length - 1){
                        cardContainer.style.pointerEvents = 'all';
                        document.querySelector('.button-container').classList.add('reveal-done');
                        bgSpacezoom.classList.add('done');
                        bgGrid.playbackRate = 1;
                    }
                }

                //GSAP Animations
                const tl = gsap.timeline({
                    defaults: {
                        ease: 'superEase',
                    },
                });

                timing += 0.15;

                if (i > 0 && cards[i - 1].classList.contains('win')){ timing += 2.2; }
                if (!card.classList.contains('win')){
                    //Losing Cards
                    tl.from(card, timing, { onComplete: () => { setPosition(card); }});
                    
                    tl.to(card, 0.2, {
                        opacity: 1, x: 0, y: 0, scale: 1,
                        clearProps: "all",

                        onComplete: () => { animationEnd(); }
                    })
                }else{
                    //Winning Cards
                    const cardLight = document.querySelector('.card-light');
                    tl.from(card, timing, {onComplete: () => { setPosition(card); cardLight.play();}});
                    tl.to(card, 0.4, {
                        y: `-=${(window.innerHeight/2) + (rect.height/2) + 40}`,
                        scale: `${1.6 + ((window.innerWidth <= 767) * 1.2)}`,
                        opacity: 1,
                        
                        onComplete: () => {}
                    })
                    .to(card, 1.2, {})
                    .to(card, 0.3, {
                        ease: 'superEaseInOut',
                        x: 0, y: 0, scale: 1,
                        clearProps: "all",

                        onComplete: () => { animationEnd(); }
                    })
                }
            });
        }
        revealCards(spreadCards);
    });
});