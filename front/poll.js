let startButton = document.querySelector('#startBtn')
let validateButton = document.querySelector('#btn')
let goToNextButton = document.querySelector('#nextBtn')
let endButton = document.querySelector('#endBtn')

let globalReference
const result = document.getElementById('result');

let score

let hashes = []
let hashs = '269d96175e89df9fb809b53fd838d8073298b6877c4cbd07311d8dbe41c6a0c3' // single
let hashm = 'a3685060082d25d11e806571c95bd623666c5ddab9b4b2746102dbae4faffa36' // multi
hashes.push(hashs)
hashes.push(hashm)
let currIndex = 0;


function activeCheckboxUnique(question, event) {
    // Décheck les autres checkbox
    const checkboxes = question.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function (checkbox) {
        if (checkbox !== event) {
            checkbox.checked = false;
        }
    });
}


function startQuizz() {

    startButton.style.display = 'none'

    goToNextQuestion()

}

function goToNextQuestion() {
    // vidage de #qcm-container
    document.getElementById('qcm-container').innerHTML = ''
    const hash = hashes[currIndex]

    //remplissage avec le form
    fetch(`http://qcm.test/api.php?action=get_single_question&question_hash=${hash}`)
        .then(response => response.json())
        .then(questionData => {
            console.log('questionData', questionData)
            globalReference = questionData
            // put questionData into localStorage
            localStorage.setItem("questionData", JSON.stringify(questionData))
            result.innerHTML = ''

            const qcmContainer = document.getElementById('qcm-container');
            qcmContainer.innerHTML = displayQCM(questionData);
            let questionType = document.getElementById('question_type').value;//??

            // gere type de question
            if (questionType === 'single' || questionType === 'multi') {
                const qcmForm = document.getElementById('qcm');

                qcmForm.addEventListener('change', function (e) {
                    // Si objet checkbox
                    if (e.target.type === 'checkbox') {
                        let questionDiv = e.target.closest('.question');

                        // Si type de question simple
                        if (questionType === 'single') {
                            activeCheckboxUnique(questionDiv, e.target)
                        }

                        // Vérifier si toutes les questions ont au moins une réponse
                        const allQuestions = this.querySelectorAll('.question');
                        let allQuestionsAnswered = false;

                        allQuestions.forEach(function (question) {
                            let checkedBoxes = question.querySelectorAll('input[type="checkbox"]:checked');
                            if (checkedBoxes.length === 0) {
                                allQuestionsAnswered = true;
                            }
                        });

                        validateButton.disabled = allQuestionsAnswered;
                    }
                });
            }
        })
        .catch(error => {
            document.getElementById('result').textContent = 'Erreur : ' + error.message;
            console.error('Erreur:', error);
        });


}


// start or bette call it init()
startButton.addEventListener('click', startQuizz)


// // gestion bouton valider
validateButton.addEventListener('click', function (event) {
    goToNextButton.style.display = 'block'

    // get questionData from localStorage
    let questionData = JSON.parse(localStorage.getItem("questionData"))
    // get ids des input checkés
    // balayer toutes les réponses du DOM et regarder si l'id est dans correct list, coché + non == faux, coché + oui == juste
    let checkedBoxes = document.querySelectorAll('input[type="checkbox"]');

    [...checkedBoxes].map(item => {
        let found = questionData.find(el => el.id == item.value)

        if (found.correct === 1 && item.checked === true) {
            item.parentElement.style.backgroundColor = 'green'
            score++
        } else if (found.correct === 0 && item.checked === true) {
            item.parentElement.style.backgroundColor = 'red'
        }
        else if (found.correct === 1 && item.checked === false) {
            item.parentElement.style.borderColor = 'green'
        }
    })




})


goToNextButton.addEventListener('click', () => {
    currIndex++
    goToNextQuestion()
})