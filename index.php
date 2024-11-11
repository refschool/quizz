<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"
        integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js"
        integrity="sha384-0pUGZvbkm6XF6gxjEnlmuGrJXVbNuzT9qBBavbLwCsOGabYfZo0T0to5eqruptLy"
        crossorigin="anonymous"></script>
    <link rel="stylesheet" href="style.css">
    <title>API Response Check</title>
</head>

<body>
    <style>
        .modal {
            display: none;
            position: fixed;
            z-index: 65500;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgb(0, 0, 0);
            background-color: rgba(0, 0, 0, 0.4);
        }

        .modal-content {
            background-color: #fefefe;
            margin: 15% auto;
            padding: 20px;
            border: 1px solid #888;
            width: 80%;
        }
    </style>
    <!-- Modal -->
    <div class="modal">
        <div class="modal-content">
            <h1>Fin du QUIZZ</h1>
            <p>Merci d'avoir participé à ce quizz, votre score est de <span id="score">0</span> / <span
                    id="maxScore">0</span></p>
            <p>Cliquer fermer pour quitter</p>
            <button class="btn btn-primary mb3" id="closeBtn"> Fermer</button>
        </div>
    </div>


    <div class="container">

        <h1>Questions</h1>
        <p id="result">Fetching data...</p>
        <pre id="data"></pre>
        <div id="qcm-container"></div>
        <button class="btn btn-primary mb3" id="startBtn"> Commencer</button>
        <button class="btn btn-primary mb3" id="validateBtn" style="display: none;" disabled> Valider</button>
        <button class="btn btn-primary mb3" id="nextBtn" style="display: none;"> goToNextQuestion</button>
        <button class="btn btn-primary mb3" id="endBtn" style="display: none;"> Terminer</button>

        <h2 id="scoreBoard"></h2>
        <div id="bilan"></div>
    </div>

</body>
<script src="config.js"></script>
<script src="functions.js"></script>
<script>
    // programme principal

    let startButton = document.querySelector('#startBtn')
    let validateButton = document.querySelector('#validateBtn')
    let goToNextButton = document.querySelector('#nextBtn')
    let endButton = document.querySelector('#endBtn')
    const closeBtn = document.querySelector('#closeBtn')
    let resource = 'questions.json'
    // let resource = url + 'api.php?action=get_question_array&questionnaire_id=3'

    let globalQuestionDataReference // sert à mettre  questionData depuis la promise
    const result = document.getElementById('result');

    let score = 0


    // hash de la question (pas du quizz)
    let hashes = []


    // index courant de la question
    let currIndex = 0;
    // score maximal réalisable
    let maxScore = hashes.length

    // // gestion bouton valider
    validateButton.addEventListener('click', function(event) {
        this.style.display = 'none'

        if (currIndex !== hashes.length - 1) {
            goToNextButton.style.display = 'block'
        } else {
            goToNextButton.style.display = 'none'
            endButton.style.display = 'block'
        }

        // get questionData from localStorage
        let questionData = JSON.parse(localStorage.getItem("questionData"))
        // get ids des input checkés
        // balayer toutes les réponses du DOM et regarder si l'id est dans correct list, coché + non == faux, coché + oui == juste
        let checkedBoxes = document.querySelectorAll('input[type="checkbox"]');
        let badAnswerCount = 0;

        // après réponse,on regarde les checkbox et colorize selon justesse de la réponse.
        // TODO marche pas pour les multi
        [...checkedBoxes].map(item => {
            let found = questionData.find(el => el.id == item.value)

            // différents cas d colorization, checké juste, 
            if (found.correct === 1 && item.checked === true) {
                item.parentElement.style.backgroundColor = '#1BD062'

                //checké faux, 
            } else if (found.correct === 0 && item.checked === true) {
                item.parentElement.style.backgroundColor = '#FF114B'
                badAnswerCount++
            }
            //non checké juste
            else if (found.correct === 1 && item.checked === false) {
                item.parentElement.style.borderColor = '#1BD062'
                badAnswerCount++
            }
        })
        //update score
        if (badAnswerCount === 0) score++
        //stocke le score
        localStorage.setItem("score", score)

        // stockage de outerHTML 
        let elem = document.getElementById('qcm-container').outerHTML
        let data = localStorage.getItem("qcm-container")
        localStorage.setItem("qcm-container", data + elem)
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
        // populer le modal
        document.querySelector('#score').innerHTML = score
        document.querySelector('#maxScore').innerHTML = maxScore

    })

    // bouton pour fermer la modale, TODO : quitter le quizz et revenir à l'accueil
    closeBtn.addEventListener('click', () => {
        document.querySelector('.modal').style.display = 'none'

        // vide la qcm-container
        document.querySelector('#qcm-container').innerHTML = ''


        // réaffichage de qcm-container du localstorage + score
        let score = localStorage.getItem("score")
        document.querySelector('#scoreBoard').innerHTML = "Score Final : " + score + "/" + maxScore
        let elem = localStorage.getItem("qcm-container")
        document.querySelector('#bilan').innerHTML = elem

        // cacher bouton Terminer
        endButton.style.display = 'none'
        // révéler bouton Commencer
        startButton.style.display = 'block'

        // envoyer requête AJAX
        fetch('api.php?action=save_score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                score: score
            })

        })

    })




    // start or better call it init()
    startButton.addEventListener('click', () => {
        startQuizz(resource)
    })
</script>

</html>