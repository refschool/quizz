let submitButton = document.querySelector('#btn')
let globalReference
let score = 0
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


    qcmHtml += '</form>';

    return qcmHtml;
}

function activeCheckboxUnique(question, event){
    // Décheck les autres checkbox
    const checkboxes = question.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function (checkbox) {
        if (checkbox !== event) {
            checkbox.checked = false;
        }
    });
}

fetch('http://qcm.test/api.php?action=get_questions&id=14')
    .then(response => response.json())
    .then(data => {
        const result = document.getElementById('result');

        // Vider les éléments existants
        result.innerHTML = '';

        // Traitement objet
        if (typeof data === 'object' && data !== null) {

            // Affiche qcm
            const qcmContainer = document.getElementById('qcm-container');

            let jsonData = JSON.parse(data.reference);
            globalReference = jsonData

            qcmContainer.innerHTML = displayQCM(jsonData);

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


    const correctList = []
    // get ids des bonnes réponses

    globalReference.forEach(item => {
        for (var key in item) {
            //debugger
            for (var reponseKey in item[key].content) {
                if (item[key].content[reponseKey].correct === 1) {

                    // let reponse = {}
                    // reponse[reponseKey] = item[key].content[reponseKey]
                    correctList.push('reponse_' + reponseKey)
                }

            }
            console.log(item[key].content) // on accède aux réponses de chaque question
        }
    })
    
    // get ids des input checkés
    // balayer toutes les réponses du DOM et regarder si l'id est dans correct list, coché + non == faux, coché + oui == juste
    let checkedBoxes = document.querySelectorAll('input[type="checkbox"]');
    [...checkedBoxes].map(item => {
        const id = item.getAttribute('id')
        if (correctList.includes(id) && item.checked === true) {
            item.parentElement.style.backgroundColor = 'green'
            score++
        } else if (correctList.includes(id) && item.checked === false) {
            item.parentElement.style.backgroundColor = 'grey'

        }
    })

    console.log('Score = ', score)


    // correctList.map(reponse => {
    //     let reponseKey = 'reponse_' + Object.keys(reponse)
    //     let r = document.getElementById(reponseKey)
    //     if (r.checked === true) {
    //         console.log(reponseKey, 'is correct')
    //     } else {
    //         console.log(reponseKey, 'is incorrect')

    //     }
    //     console.log(Object.keys(reponse))
    // })

    //desactive checkbox
    checkedBoxes.forEach(checkbox => 
        checkbox.disabled = true
    )
    //desactive button
    submitButton.disabled = true
})

