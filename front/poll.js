let submitButton = document.querySelector('#btn')
let globalReference
const result = document.getElementById('result');
let qcmHtml = ''
let score

// TODO manque le type de question single ou multi
function displayQCM(data) {
    qcmHtml += '<form action="#" method="POST" id="qcm">'
    qcmHtml += `
    <div class="question">
        <h2>${data[0].question}</h2>
`;
    data.forEach(item => {
        qcmHtml += `<div class="decalage form-check" style="border: 1px solid transparent;">
        <input class="form-check-input" type="checkbox" name="question[${item.id}]" id="reponse_${item.id}" value="${item.id}">
        <label class="form-check-label" for="reponse_${item.id}">
        ${item.texte}
        </label>
    </div>`
    })



    qcmHtml += `<input type="hidden" id="question_type" value="${data[0].type}">`
    qcmHtml += '</div>';
    qcmHtml += '</form>';
    return qcmHtml;
}

function activeCheckboxUnique(question, event) {
    // Décheck les autres checkbox
    const checkboxes = question.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function (checkbox) {
        if (checkbox !== event) {
            checkbox.checked = false;
        }
    });
}

//let hash = '269d96175e89df9fb809b53fd838d8073298b6877c4cbd07311d8dbe41c6a0c3' // single
let hash = 'a3685060082d25d11e806571c95bd623666c5ddab9b4b2746102dbae4faffa36' // multi
fetch(`http://qcm.test/api.php?action=get_single_question&question_hash=${hash}`)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        globalReference = data
        // put data into localStorage
        localStorage.setItem("data", JSON.stringify(data))
        result.innerHTML = ''

        const qcmContainer = document.getElementById('qcm-container');
        qcmContainer.innerHTML = displayQCM(data);


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


    })
    .catch(error => {
        document.getElementById('result').textContent = 'Erreur : ' + error.message;
        console.error('Erreur:', error);
    });

// // gestion bouton valider
submitButton.addEventListener('click', function (event) {

    // get data from localStorage
    let data = JSON.parse(localStorage.getItem("data"))
    // get ids des input checkés
    // balayer toutes les réponses du DOM et regarder si l'id est dans correct list, coché + non == faux, coché + oui == juste
    let checkedBoxes = document.querySelectorAll('input[type="checkbox"]');

    [...checkedBoxes].map(item => {
        let found = data.find(el => el.id == item.value)

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
    //desactive checkbox
    // checkedBoxes.forEach(checkbox =>
    //     checkbox.disabled = true
    // )
    // //desactive button
    // submitButton.disabled = true
})

