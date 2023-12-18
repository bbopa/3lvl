function setup(){
    Game.addWhiteCloud(80, 60, 60)
    Game.addWhiteCloud(80, 95, 81)
    Game.addWhiteCloud(80, 38, 96)

    Game.addWhiteCloud(70, 210, 300)
    Game.addWhiteCloud(83, 178, 330)
    Game.addWhiteCloud(81, 162, 365)
    Game.addWhiteCloud(100, 205, 350)
    Game.addWhiteCloud(83, 245, 350)

    Game.addWhiteCloud(30, 245, 200)
    Game.addWhiteCloud(28, 225, 210)
    Game.addWhiteCloud(30, 240, 215)
    Game.addWhiteCloud(29, 260, 210)

    createCanvas(400, 400)

    isFinishScreenClickable = true
}




let isFinishScreenClickable = false
let coordsOfTexts = [30, 40, 30, 60, 30, 80, 350, 40]
let colors = ['orange', 'yellow', 'blue', 'pink']

function draw() {
    background('skyblue')
    for (const cloud of Game.whiteClouds) {
        cloud.draw();
    }



    let scoreResult = "Score: " + Game.score
    let balloonsResult = 'Balloons: ' + Game.balloonsAmount
    let badBalloonResult = 'Bad Balloons: ' + Game.badBalloonsAmount
    let level = 'Level: ' + Game.levelParam
    if(Game.score < 100){
        Game.levelParam = 1
    }
    else if(Game.score >= 100 && Game.score < 200){
        Game.levelParam = 2
    }
    else if(Game.score >= 200){
        Game.levelParam = 3
    }




    if (frameCount % 30 == 0) {
        Game.addCommonBalloon()
    }
    if (frameCount % 70 == 0) {
        Game.addUniqueBalloon()
    }
    if (frameCount % 90 == 0) {
        Game.addBlackBalloon()
    }
    if (frameCount % 120 == 0 && Game.levelParam == 2 ){
        Game.addGrayBalloon()
    }




    textSize(12);
    fill('black');
    text(scoreResult, coordsOfTexts[0], coordsOfTexts[1]);
    text(balloonsResult, coordsOfTexts[2], coordsOfTexts[3])
    text(badBalloonResult, coordsOfTexts[4], coordsOfTexts[5])
    text(level, coordsOfTexts[6], coordsOfTexts[7])





    for (const balloon of Game.balloons) {
        balloon.draw()
        balloon.move(Game.score)


        if (balloon.y <= balloon.size / 4 && balloon.color != 'black' && balloon.color != 'gray') {
            noLoop();
            clearInterval(interval)
            Game.balloons.length = 0;
            let finalScore1 = Game.score
            let finalScore2 = Game.balloonsAmount
            let finalScore3 = Game.badBalloonsAmount
            let finalScore4 = Game.levelParam
            background(136, 220, 166)
            textSize(110)
            fill('white')
            textAlign(CENTER, CENTER)
            text('FINISH', 200, 140)
            textSize(22)
            text('Your score: ' + finalScore1, 200, 290)
            text('Balloons bursted: ' + finalScore2, 200, 320)
            text('Bad balloons bursted: ' + finalScore3, 200, 350)
            text('Max. Level: ' + finalScore4, 200, 380)
            textSize(55)
            fill('white')
            textAlign(CENTER, CENTER)
            text('Results:', 200, 250)

            isFinishScreenClickable = false
            setTimeout(() => {
                isFinishScreenClickable = true
            }, 1600)

        }
    }
}


let interval;

function mousePressed(){
    if (isFinishScreenClickable == false) {
        return
    }    

    if(isLooping() == false){
        Game.score = 0
        Game.balloonsAmount = 0
        Game.badBalloonsAmount = 0
        Game.levelParam = 1
        interval = setInterval(() => {
            Game.sendStat();
        }, 5000)
        loop()
        
    }
    Game.check()
    Game.countOfCLicks += 1
}

interval = setInterval(() => {
    Game.sendStat();
}, 5000)


class Game {

    static balloons = []
    static score = 0
    static balloonsAmount = 0
    static badBalloonsAmount = 0
    static levelParam = 1
    static whiteClouds = []
    static countOfCLicks = 0


    static addWhiteCloud(size, x, y) {
        let cloud = new WhiteCloud(size, x, y);
        this.whiteClouds.push(cloud)
    }
    static addGrayBalloon(){
        let balloon = new GrayBalloon(40, 50, "gray")
        this.balloons.push(balloon)
    }
    static addCommonBalloon() {
        let balloon = new CommonBalloon(50, 60, random(colors))
        this.balloons.push(balloon)
    }  
    static addUniqueBalloon() {
        let balloon = new UniqueBalloon(30, 40, 'green')
        this.balloons.push(balloon)
    }  
    static addBlackBalloon() {
        let balloon = new BlackBalloon(50, 60, 'black')
        this.balloons.push(balloon)
    }  

    static check(){
        Game.balloons.forEach((balloon, index) => {
            let distance = dist(balloon.x, balloon.y, mouseX, mouseY)
            if(distance <= balloon.size /2){
                balloon.burst(index)
            }
        })

    }

    static sendStat() {
        let obj = {
            balloonsAmount: Game.balloonsAmount,
            badBalloonsAmount: Game.badBalloonsAmount,
            levelParam: Game.levelParam,
            countOfCLicks: Game.countOfCLicks,
        }

        fetch('/stats', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj),
        })
    }

}




let numbers = [1, 2, 3, 4, 5]

class CommonBalloon{

    constructor(size, size2, color){
        this.x = random(width)
        this.y = random(height+20, height+30)
        this.color = color
        this.size = size
        this.size2 = size2
    }

    draw(){
        fill(this.color)
        line(this.x, this.y + this.size / 2, this.x, this.y + this.size2 * 2)
        ellipse(this.x, this.y, this.size, this.size2)
    }

    move(score){
        if(score < 100){
            this.y -= 1
        }
        else if(score >= 100 && score < 200){
            this.y -= 1.5
        }
        else {
            this.y -= 2
        }
    }

    burst(index){
        Game.balloons.splice(index, 1)
        Game.score += random(numbers) 
        Game.balloonsAmount += 1
    }
}

class GrayBalloon extends CommonBalloon {
    constructor(size, size2, color){
        super(size, size2, color)
    }

    burst(index){
        Game.balloons.splice(index, 1)
        Game.score = 0
    }
}

class UniqueBalloon extends CommonBalloon{
    constructor(size, size2, color ){
        super(size, size2, color)
    }
    burst(index){
        Game.balloons.splice(index, 1)
        Game.score += 10 
        Game.balloonsAmount += 1
    }
}

class BlackBalloon extends CommonBalloon{
    constructor(size, size2, color ){
        super(size, size2, color)
    }
    burst(index){
        Game.balloons.splice(index, 1)
        Game.score -= 10 
        Game.badBalloonsAmount += 1
    }
}







class WhiteCloud {
    constructor(size, x, y) {
        this.x = x
        this.y = y
        this.size = size;
        this.color = 'white'
        this.speed = 0.15
    }

    draw() {
        push()
        noStroke()
        fill(this.color)
        ellipse(this.x, this.y, this.size)
        pop()

        this.x -= this.speed

        if (this.x < -this.size) {
            this.x = width + this.size / 2
        }
    }
}