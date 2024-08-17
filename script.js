let submitButton = document.querySelector('#btn')

function displayQCM(jsonData) {

    let qcmHtml = '<form action="#" method="POST" id="qcm">';
    jsonData.forEach(questionObj => {
        const questionNumber = Object.keys(questionObj)[0];
        const question = questionObj[questionNumber];
        const types = question.type

        qcmHtml += `
            <div class="question">
                <h2>${question.question_texte}</h2>
        `;

        Array.from(Object.keys(question.content)).forEach(key => {
            const reponse = question.content[key];
            qcmHtml += `
                <div class="decalage form-check">
                    <input class="form-check-input" type="checkbox" name="question[${key}]" id="reponse_${key}" value="${key}" ${reponse.correct ? 'data-correct="true"' : ''}>
                    <label class="form-check-label" for="reponse_${key}">
                            ${reponse.html}
                    </label>
                </div>
            `;
        });
        qcmHtml += `<input type="hidden" id="question_type" value="${types}">`
        qcmHtml += '</div>';
    });


    //  qcmHtml += '<button type="submit" class="btn btn-primary mb3" id="btn"  disabled> Valider </button>';
    qcmHtml += '</form>';

    return qcmHtml;
}

fetch('http://qcm.test/api.php?action=get_questions&id=14')
    .then(response => response.json())
    .then(data => {
        const result = document.getElementById('result');

        // Vider les éléments existants
        result.innerHTML = '';

        // Traitement objet
        if (typeof data === 'object' && data !== null) {
            let stringified = JSON.stringify(data);//inutiles
            const questions = JSON.parse(stringified);
            //const reponses = JSON.parse(stringified);

            // Affiche qcm
            const qcmContainer = document.getElementById('qcm-container');

            let jsonData = JSON.parse(data.reference);

            qcmContainer.innerHTML = displayQCM(jsonData);

            let questionType = document.getElementById('question_type').value;//??


            // gere type de question
            if (questionType === 'single' || questionType === 'multi') {
                const qcmForm = document.getElementById('qcm');

                qcmForm.addEventListener('change', function (e) {
                    // Si objet checkbox
                    if (e.target.type === 'checkbox') {

                        let questionDiv = e.target.closest('.question');

                        // type de question
                        let questionType = questionDiv.querySelector('#question_type').value;

                        // Si type de question simple
                        if (questionType === 'single') {
                            // Décheck les autres checkbox
                            const checkboxes = questionDiv.querySelectorAll('input[type="checkbox"]');
                            checkboxes.forEach(function (checkbox) {
                                if (checkbox !== e.target) {
                                    checkbox.checked = false;
                                }
                            });
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


                        //let submitButton = this.querySelector('button[type="submit"]');
                        submitButton.disabled = allQuestionsAnswered;
                    }
                });
            }
        }
        else {
            result.textContent = 'Le format de la réponse est inattendu.';
        }
    })
    .catch(error => {
        document.getElementById('result').textContent = 'Erreur : ' + error.message;
        console.error('Erreur:', error);
    });

// // gestion bouton valider
submitButton.addEventListener('click', function (event) {
    event.preventDefault()
    alert('sent !!')
})

