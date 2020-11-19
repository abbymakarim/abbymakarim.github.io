document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const width = 10
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector("#start-button")
    let nextRandom = 0
    let timerId
    let score = 0

    //tetris shapes
    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width,width+1, width+2, width*2+2],
        [1,width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ]

    const zTetromino = [
        [width*2, width*2+1, width+1, width+2],
        [0, width, width+1, width*2+1],
        [width*2, width*2+1, width+1, width+2],
        [0, width, width+1, width*2+1]
    ]

    const tTetromino = [
        [width, 1, width+1, width+2],
        [1, width+1, width*2+1, width+2],
        [width, width+1, width*2+1, width+2],
        [width, 1, width+1, width*2+1]
    ]

    const oTetromino = [
        [0, width, 1, width+1],
        [0, width, 1, width+1],
        [0, width, 1, width+1],
        [0, width, 1, width+1]
    ]

    const iTetromino = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]
    ]
 

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

    let currentPosition = 4
    let currentRotation = 0

    let random = Math.floor(Math.random()*theTetrominoes.length)
    let current = theTetrominoes[random][currentRotation]

    //draw
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
        })
    }

    //undraw
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
        })
    }

    //assign kontrol keyboard
    function control(e) {
        if(e.keyCode === 37) {
            moveleft()
        } else if(e.keyCode === 38){
            rotate()
        } else if(e.keyCode === 39){
            moveRight()
        } else if(e.keyCode === 40){
            moveDown()
        }
    }
    document.addEventListener('keyup', control)

    function moveDown (){
        undraw()
        currentPosition += width
        draw()
        freeze()
    }

    //jika block sampe paling bawah
    function freeze () {
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            random = nextRandom
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            current = theTetrominoes[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            gameOver()
        }
    }

    //gerak kiri hingga nabrak
    function moveleft() {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

        if(!isAtLeftEdge){
            currentPosition -= 1
        } 
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            currentPosition += 1
        }

        draw()
    }

    //gerak kenan hingga nabrak
    function moveRight(){
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)

        if(!isAtRightEdge){
            currentPosition += 1
        }
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            currentPosition -= 1
        }
        draw()
    }

    //rotate tetris
    function rotate() {
        undraw()
        currentRotation ++
        if(currentRotation === current.length){
            currentRotation = 0
        }
        current = theTetrominoes[random][currentRotation]
        draw()
    }

    // Untuk membuat next tetris block muncul di samping kanan
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    let displayIndex = 0
    

    const upNextTetrominoes = [
        [1, displayWidth+1, displayWidth*2+1, 2],
        [displayWidth*2, displayWidth*2+1, displayWidth+1, displayWidth+2],
        [displayWidth, 1, displayWidth+1, displayWidth+2],
        [0, displayWidth, 1, displayWidth+1],
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1],
    ]

    function displayShape(){
        displaySquares.forEach(square =>{
            square.classList.remove('tetromino')
        })
        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
        })
    }
    //Pause dan start
    startBtn.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId)
            timerId = null
        } else {
            draw()
            timerId = setInterval(moveDown, 1000)
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            displayShape()
        }
    })
    //Untuk menambahkan score
    function addScore() {
        for(let i = 0; i < 199; i += width){
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
            if(row.every(index => squares[index].classList.contains('taken'))) {
                score+= 10
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                })
                const squaresRemoved = squares.splice(i,width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }
    //Jika block sampai paling atas
    function gameOver() {
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'end'
            clearInterval(timerId)
            alert('Anda kalah, silahkan restart')
        }
    }
})



