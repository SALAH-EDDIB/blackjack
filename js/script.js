let blackjackgame = {
    'you': {
        'scoreSpan': '.your-blackjack-result',
        'div': '.your-box',
        'score': 0
    },
    'dealer': {
        'scoreSpan': '.dealer-blackjack-result',
        'div': '.dealer-box',
        'score': 0
    },
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'J', 'Q', 'A'],
    'cardsMap': {
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5,
        '6': 6,
        '7': 7,
        '8': 8,
        '9': 9,
        '10': 10,
        'K': 10,
        'J': 10,
        'Q': 10,
        'A': [1, 11]
    },
    'wins': 0,
    'losses': 0,
    'draws': 0,
    'itStand': false,
    'turnsOver': false,
    'turnsStart': false,

};





const YOU = blackjackgame['you']
const DEALER = blackjackgame['dealer']

const hitSound = new Audio('sounds/swish.m4a')
const winSound = new Audio('sounds/cash.mp3')
const lostSound = new Audio('sounds/aww.mp3')


document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackHit)

document.querySelector('#blackjack-stand-button').addEventListener('click', dealerLogique)

document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackdeal)

function blackjackHit() {
    blackjackgame['turnsStart'] = true;
    if (blackjackgame['itStand'] === false) {
        let card = randomcard();
        showCard(card, YOU);
        updateScore(card, YOU);
        showScore(YOU);
    }

}

function showCard(card, activePlayer) {
    if (activePlayer['score'] <= 21) {
        let cardImage = document.createElement('img');
        cardImage.src = `img/${card}.png`;

        document.querySelector(activePlayer['div']).appendChild(cardImage);

        hitSound.play();
    }


}

function blackjackdeal() {
    if (blackjackgame['turnsOver'] === true) {
        let yourImage = document.querySelector(YOU['div']).querySelectorAll('img');
        let dealerImage = document.querySelector(DEALER['div']).querySelectorAll('img');
        for (i = 0; i < yourImage.length; i++) {
            yourImage[i].remove();
        }
        for (i = 0; i < dealerImage.length; i++) {
            dealerImage[i].remove();
        }

        YOU['score'] = 0;
        DEALER['score'] = 0;

        blackjackgame['turnsOver'] = false;
        blackjackgame['itStand'] = false;
        blackjackgame['turnsStart'] = false;


        document.querySelector(YOU['scoreSpan']).textContent = YOU['score'];
        document.querySelector(DEALER['scoreSpan']).textContent = DEALER['score'];


        document.querySelector(YOU['scoreSpan']).style.color = 'white';
        document.querySelector(DEALER['scoreSpan']).style.color = 'white';

        document.querySelector('.blackjack-result').textContent = "Let's play"
        document.querySelector('.blackjack-result').style.color = 'white'

        document.querySelector('#blackjack-stand-button').addEventListener('click', dealerLogique)

    }

}


function randomcard() {
    let randomIndex = Math.floor(Math.random() * 13);
    return blackjackgame['cards'][randomIndex]
}

function updateScore(card, activePlayer) {

    if (card === 'A') {
        // if adding 11 keeps me bollow 21, add 11 otherwise add 1
        if (activePlayer['score'] + blackjackgame['cardsMap'][card][1] <= 21) {
            activePlayer['score'] += blackjackgame['cardsMap'][card][1]
        } else {
            activePlayer['score'] += blackjackgame['cardsMap'][card][0]
        }

    } else {

        activePlayer['score'] += blackjackgame['cardsMap'][card]
    }
}

function showScore(activePlayer) {
    if (activePlayer['score'] > 21) {
        document.querySelector(activePlayer['scoreSpan']).textContent = 'Bust !!';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';


    } else {
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score']
    }
}

function sleep(ms) {

    return new Promise(resolve => setTimeout(resolve, ms));
}

async function dealerLogique() {



    if (blackjackgame['turnsStart'] === true) {

        if (blackjackgame['turnsOver'] === false) {

            document.querySelector('#blackjack-stand-button').removeEventListener('click', dealerLogique)

            blackjackgame['itStand'] = true;

            while (DEALER['score'] < 16 && blackjackgame['itStand'] === true) {

                let card = randomcard();
                showCard(card, DEALER);
                updateScore(card, DEALER);
                showScore(DEALER);
                await sleep(800);
            }


            blackjackgame['turnsOver'] = true;
            showresult(computeWinner())




        }
    }

}


function computeWinner() {
    let winner;

    if (YOU['score'] <= 21) {

        if (YOU['score'] > DEALER['score'] || DEALER['score'] > 21) {
            blackjackgame['wins']++
            winner = YOU;

        } else if (YOU['score'] < DEALER['score']) {
            blackjackgame['losses']++
            winner = DEALER

        } else if (YOU['score'] === DEALER['score']) {
            blackjackgame['draws']++


        }


    } else if (YOU['score'] > 21 && DEALER['score'] <= 21) {
        blackjackgame['losses']++

        winner = DEALER;

    } else if (YOU['score'] > 21 && DEALER['score'] > 21) {
        blackjackgame['draws']++


    }


    return winner;



}

function showresult(winner) {
    let message, messagecolor

    if (winner === YOU) {
        message = 'You win !'
        messagecolor = '#2ed573'
        winSound.play();
        document.querySelector('#wins').textContent = blackjackgame['wins']

    } else if (winner === DEALER) {
        message = 'You lost !'
        messagecolor = 'red'
        lostSound.play();
        document.querySelector('#losses').textContent = blackjackgame['losses']

    } else {
        document.querySelector('#draws').textContent = blackjackgame['draws']
        message = 'it\'s a draw'
        messagecolor = '#f9ca24'
    }

    document.querySelector('.blackjack-result').textContent = message
    document.querySelector('.blackjack-result').style.color = messagecolor





}