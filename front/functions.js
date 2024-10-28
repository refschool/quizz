function startQuizz() {
    startButton.style.display = 'none'
    goToNextQuestion()
}

function goToNextQuestion() {

    // vidage de #qcm-container
    document.getElementById('qcm-container').innerHTML = ''
    const hash = hashes[currIndex]
    validateButton.style.display = 'block'
    goToNextButton.style.display = 'none'

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
function displayQCM(questionData) {
    qcmHtml = ''
    qcmHtml += '<form action="#" method="POST" id="qcm">'
    qcmHtml += `
    <div class="question">
        <h2>${questionData[0].question}</h2>
`;
    questionData.forEach(item => {
        qcmHtml += `<div class="decalage form-check" style="border: 1px solid transparent;">
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

