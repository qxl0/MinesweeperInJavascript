document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const flagsLeft = document.querySelector('#flags-left')
    const result = document.querySelector('#result')
    let width = 10
    let bombAmount = 20
    let flags = 0 
    let squares = []
    let isGameOver = false 
    // create board
    function createBoard(){
        flagsLeft.innerHTML = bombAmount
        // get shuffles game array with random bombs
        const bombsArray = Array(bombAmount).fill('bomb')
        const emptyArray = Array(width*width - bombAmount).fill('valid')
        
        const gameArray = emptyArray.concat(bombsArray)
        const shuffleArray = gameArray.sort(() => 
            Math.random() - 0.5
        )
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div')
            square.setAttribute('id', i)
            square.classList.add(shuffleArray[i])
            
            grid.appendChild(square)
            squares.push(square)
            
            // normal click
            square.addEventListener('click', function(e) {
                click(square)
            })
            square.oncontextmenu = function (e) {
                e.preventDefault()
                addFlag(square)
            }    
        }
        

        // add numbers
        for (let i = 0; i< squares.length; i++){
            let total = 0
            const isLeftEdge = (i % width === 0)
            const isRightEdge = (i % width === width - 1)
           
            if (squares[i].classList.contains('valid')){
                if (i>0 && !isLeftEdge && isBomb(squares[i - 1])) total++
                if (i>9 && !isRightEdge && isBomb(squares[i + 1 - width])) total++
                if (i>10 && isBomb(squares[i - width])) total++
                if (i>11  && !isLeftEdge && isBomb(squares[i - 1 - width])) total++
                if (i<=98  && !isRightEdge && isBomb(squares[i + 1])) total++
                if (i<90  && !isLeftEdge && isBomb(squares[i - 1 + width])) total++
                if (i<88  && !isRightEdge && isBomb(squares[i + 1 + width])) total++
                if (i<89  && isBomb(squares[i + width])) total++
                squares[i].setAttribute('data', total)
            }
        }
    }

    function isBomb(square) {
        return square.classList.contains('bomb');
    }
    createBoard()

    function addFlag(square){
        if (isGameOver) return
        if (!square.classList.contains('checked') && (flags < bombAmount)) {
            if (!square.classList.contains('flag')) {
                square.classList.add('flag')
                square.innerHTML = '🚩'
                flags++
                flagsLeft.innerHTML = bombAmount- flags
                checkWin()
            } else {
                square.classList.remove('flag')
                square.innerHTML = ''
                flags--
                flagsLeft.innerHTML = bombAmount- flags
            }
        }
    }


    function click(square){
        let currentId = square.id
        if (isGameOver) return
        if (square.classList.contains('checked') || 
            square.classList.contains('flag'))
            return
        if (isBomb(square)){
            gameOver(squares)
        } else {
            let total = square.getAttribute('data')
            if (total != 0){
                square.classList.add('checked')
                if (total == 1) square.classList.add('one')
                if (total == 2) square.classList.add('two')
                if (total == 3) square.classList.add('three')
                if (total == 4) square.classList.add('four')
                square.innerHTML = total
                return
            }
            else {
                square.classList.add('zero')
            }
            checkSquare(square, currentId)
        }
        square.classList.add('checked')
    }
    

    function checkSquare(square, currentId){
        const isLeftEdge = (currentId % width === 0)
        const isRightLdge = (currentId % width === width - 1)


        setTimeout(() => {
            let newSquare
            if (currentId > 0 && !isLeftEdge){
                newSquare = getNewSquare(currentId, -1)
                click(newSquare)
            }
            if (currentId > 9 && !isRightLdge){
                newSquare = getNewSquare(currentId, 1 - width)
                click(newSquare)
            }
            if (currentId > 10) {
                newSquare = getNewSquare(currentId, -width) 
                click(newSquare)
            }
            if (currentId > 11 && !isLeftEdge){
                newSquare = getNewSquare(currentId, -1-width)
                click(newSquare)
            }
            if (currentId < 98 && !isRightLdge){
                newSquare = getNewSquare(currentId, 1)
                click(newSquare)
            }
            if (currentId < 90 && !isLeftEdge) {
                newSquare = getNewSquare(currentId, -1+width)
                click(newSquare)
            }
            if (currentId < 89){
                newSquare = getNewSquare(currentId, width)
                click(newSquare)
            }
        },10)
    }
    

    function getNewSquare(currentId, delta) {
        const newId = squares[parseInt(currentId) + delta].id
        return document.getElementById(newId)
    }
    

    function gameOver(square) {
        result.innerHTML = 'BOOM! Game Over!'
        isGameOver = true
    
        //show ALL the bombs
        squares.forEach(square => {
          if (square.classList.contains('bomb')) {
            square.innerHTML = '💣'
            square.classList.remove('bomb')
            square.classList.add('checked')
          }
        })
      }
    
    

    function checkWin(){
        let matches = 0
        for (let i = 0; i< squares.length; i++){
            if (squares[i].classList.contains('flag') && 
                squares[i].classList.contains('bomb'))
                matches ++
            if (matches === bombAmount){
                result.innerHTML = "YOU WIN!"
                isGameOver = true
            }
        }
    }
})