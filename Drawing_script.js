document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(CustomEase);
    CustomEase.create("superEase", "M0,0 C0,0.796 0.301,1 1,1");
    CustomEase.create("superEaseInOut", "M0,0 C0.181,0 0.25,0.27 0.354,0.523 0.489,0.851 0.628,1 1,1 ");

    //For test
    const numberOfCards = document.querySelector('#number-of-cards');
    const probability = document.querySelector('#probability');
    const textNumberOfCards = document.querySelector('#text-number-of-cards');
    const textProbability = document.querySelector('#text-probability');

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
        path: 'lottie/DrawStart.json'
    });

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
    }, { once: true });

    //Skip Loading
    document.querySelector('.loading-container').addEventListener('click', () => {
        document.querySelector('.loading-container').style.display = 'none';
        animation.playSegments([0, 100], true);
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
    document.querySelector('.start-button').addEventListener('mouseover', () => {
        document.querySelector('.start-container').style.transform = `scale(1.05)`;
    });
    document.querySelector('.start-button').addEventListener('mouseout', () => {
        document.querySelector('.start-container').style.transform = `scale(1)`;
    });
    document.querySelector('.start-button').addEventListener('mousedown', () => {
        document.querySelector('.start-container').style.transform = `scale(0.9)`;
    });
    document.querySelector('.start-button').addEventListener('mouseup', () => {
        document.querySelector('.start-container').style.transform = `scale(1.1)`;
    });

    

    function setPosition(item){
        let rect = item.getBoundingClientRect();
        item.style.transform = `translateX(${(window.innerWidth / 2) - rect.left - (rect.width / 2)}px) translateY(${window.innerHeight - rect.top}px) scale(2)`;
        item.style.opacity = 0;
    };

    const bgGrid = document.querySelector('.bg-grid');
    const bgSpacezoom = document.querySelector('.bg-spacezoom');

    bgSpacezoom.pause();

    bgSpacezoom.addEventListener('ended', () => {
        bgSpacezoom.src = 'background/Spacezoom_Desktop_Loop.webm';
        bgSpacezoom.play();
    });


    //Reveal Animation
    const startButton = document.querySelector('.start-button');
    const cardContainer = document.querySelector('.card-container');
    startButton.addEventListener("click", () => {
        
        //Card Settings
        function revealCards(callback){
            for(i = 0; i < numberOfCards.value; i++){
                let win = '';
                if (Math.random() < (probability.value / 100)){win = 'win';}
                cardContainer.innerHTML += `<div class="card ${win}"></div>`;
            }
            callback();
        }
        
        function spreadCards(){
            const cards = document.querySelectorAll('.card');
            
            cards.forEach((card, i) => {
                card.style.opacity = 0;
            });

            bgGrid.playbackRate = 10;
            bgSpacezoom.play();

            //Lottie Animation
            animation.playSegments([100, 150], true);

            animation.removeEventListener('complete', loopSegment);

            animation.addEventListener('complete', function() {
                bgGrid.playbackRate = 1;
                document.querySelector('.start-container').style.display = 'none';
                animation.removeEventListener('complete', loopSegment);
            }, { once: true });


            //Reveal Cards GSAP
            let timing = 1;

            cards.forEach((card, i, array) => {
                let rect = card.getBoundingClientRect();

                const toScroll = card.offsetHeight + 40;
                const remainScroll = cardContainer.scrollHeight - cardContainer.scrollTop - cardContainer.clientHeight;

                if ((i != 0) && (i % 5 == 0)){
                    timing += 0.46;
                }

                function animationEnd(){
                    card.classList.add('complete');

                    //Scroll Automatically
                    if ((i != 1) && ((i+1) % 5 == 0)){
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
                    tl.from(card, timing, {onComplete: () => { setPosition(card); }});
                    tl.to(card, 0.4, { y: `-=${(window.innerHeight/2) + (rect.height/2) + 40}`, scale: `${1.6 + ((window.innerWidth <= 767) * 2)}`, opacity: 1,})
                    .to(card, 1.4, {})
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