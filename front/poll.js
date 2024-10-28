
// programme principal

let startButton = document.querySelector('#startBtn')
let validateButton = document.querySelector('#btn')
let goToNextButton = document.querySelector('#nextBtn')
let endButton = document.querySelector('#endBtn')
const closeBtn = document.querySelector('#closeBtn')

let globalReference
const result = document.getElementById('result');

let score = 0
// hash de la question (pas du quizz)
let hashes = []
let hashs = '269d96175e89df9fb809b53fd838d8073298b6877c4cbd07311d8dbe41c6a0c3' // single
let hashm = 'a3685060082d25d11e806571c95bd623666c5ddab9b4b2746102dbae4faffa36' // multi
hashes.push(hashs)
hashes.push(hashm)
let currIndex = 0;




// // gestion bouton valider
validateButton.addEventListener('click', function (event) {

    if (currIndex !== hashes.length - 1) {
        goToNextButton.style.display = 'block'
        this.style.display = 'none'
    } else {
        goToNextButton.style.display = 'none'
        this.style.display = 'none'
        endButton.style.display = 'block'
    }

    // get questionData from localStorage
    let questionData = JSON.parse(localStorage.getItem("questionData"))
    // get ids des input checkés
    // balayer toutes les réponses du DOM et regarder si l'id est dans correct list, coché + non == faux, coché + oui == juste
    let checkedBoxes = document.querySelectorAll('input[type="checkbox"]');
    let merit = false;

    [...checkedBoxes].map(item => {
        let found = questionData.find(el => el.id == item.value)


        if (found.correct === 1 && item.checked === true) {
            item.parentElement.style.backgroundColor = 'green'
            merit = true
        } else if (found.correct === 0 && item.checked === true) {
            item.parentElement.style.backgroundColor = 'red'
            merit = false
        }
        else if (found.correct === 1 && item.checked === false) {
            item.parentElement.style.borderColor = 'green'
            merit = false
        }
    })
    //update score
    if (merit === true) score++
    console.log("score", score)
})

// bouton vers prochaine question
goToNextButton.addEventListener('click', () => {
    currIndex++
    goToNextQuestion()

})

// bouton pour finir le quizz
endButton.addEventListener('click', () => {
    //launch modale
    document.querySelector('.modal').style.display = 'block'
})

// bouton pour fermer la modale, TODO : quitter le quizz et revenir à l'accueil
closeBtn.addEventListener('click', () => {
    document.querySelector('.modal').style.display = 'none'
})




// start or better call it init()
startButton.addEventListener('click', startQuizz)
