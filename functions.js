function startQuizz(resource) {

    //empty localStorage item qcm-container
    localStorage.setItem("qcm-container", '')
    startButton.style.display = 'none'

    // empty bilan
    document.querySelector('#bilan').innerHTML = ''
    // empty scoreBoard
    document.querySelector('#scoreBoard').innerHTML = ''
    //reset question index + score
    score = 0
    currIndex = 0
    //load the questions

    // mettre en parametre le url
    fetch(resource).then(response => response.json()).then(data => {
        hashes = data
        maxScore = hashes.length
        goToNextQuestion()
    })
}

function goToNextQuestion() {

    // vidage de #qcm-container
    document.getElementById('qcm-container').innerHTML = ''
    const hash = hashes[currIndex]
    validateButton.style.display = 'block'
    goToNextButton.style.display = 'none'

    //remplissage avec le form
    fetch(`${url}api.php?action=get_single_question&question_hash=${hash}`)
        .then(response => response.json())
        .then(questionData => {

            // on met dans la variable pour pouvoir la traiter plus tard car ici on est dans une promise
            // TODO : mettre dans localstorage pour rejouer les questions après la fin du quizz
            globalQuestionDataReference = questionData
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

                        validateButton.disabled = allQuestionsAnswered;// bouton désactivé si aucune case cochée
                    }
                });
            }
        })
        .catch(error => {
            document.getElementById('result').textContent = 'Erreur : ' + error.message;
            console.error('Erreur:', error);
        });


}

// Décheck les autres checkbox question à réponse unique
function activeCheckboxUnique(question, event) {
    const checkboxes = question.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function (checkbox) {
        if (checkbox !== event) {
            checkbox.checked = false;
        }
    });
}

// TODO manque le type de question single ou multi
function displayQCM(questionDataParam) {
    qcmHtml = ''
    qcmHtml += '<form action="#" method="POST" id="qcm">'
    qcmHtml += `
    <div class="question">
        <div class="question-text">${questionDataParam[0].question}</div>
`;

    //shuffle the answers
    let questionData = shuffle([...questionDataParam])
    console.log('avant', questionDataParam)
    console.log('apres', questionData)

    questionData.forEach(item => {
        qcmHtml += `<div class="form-check survol choix">
        <input class="form-check-input" type="checkbox" name="question[${item.id}]" id="reponse_${item.id}" value="${item.id}">
        <label class="form-check-label" for="reponse_${item.id}">
        ${item.texte}
        </label>
    </div>`
    })



    qcmHtml += `<input type="hidden" id="question_type" value="${questionData[0].type}">`
    qcmHtml += '</div>';
    qcmHtml += '</form>';
    return qcmHtml;
}
// check email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function shuffle(array) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array
}