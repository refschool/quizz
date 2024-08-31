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