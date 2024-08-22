let submitButton = document.querySelector('#btn')
const result = document.getElementById('result');
let qcmHtml

// TODO manque le type de question single ou multi
function displayQCM(data) {
    qcmHtml += '<form action="#" method="POST" id="qcm">'
    data.forEach(item => {
        qcmHtml += `<div class="decalage form-check">
        <input class="form-check-input" type="checkbox" name="question[30]" id="${item.id}" value="30">
        <label class="form-check-label" for="reponse_30">
        ${item.texte}
        </label>
    </div>`
    })



    //  qcmHtml += `<input type="hidden" id="question_type" value="${types}">`
    // qcmHtml += '</div>';
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

let hash = '269d96175e89df9fb809b53fd838d8073298b6877c4cbd07311d8dbe41c6a0c3'
fetch(`http://qcm.test/api.php?action=get_single_question&question_hash=${hash}`)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        result.innerHTML = ''
        const qcmContainer = document.getElementById('qcm-container');
        qcmContainer.innerHTML = displayQCM(data);
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

