// console.log("gsd")
// console.log(gsap)
const startbtn =  document.querySelector('#start')
const canvas = document.querySelector('#canvas')
// console.log(canvas)
canvas.width=window.innerWidth
canvas.height=window.innerHeight
const c=canvas.getContext('2d')
const scorel= document.querySelector('#score')
console.log(scorel)
// console.log(c)

const x=canvas.width/2
const y=canvas.height/2

class Player{
    constructor (x,y,radius,color){
        this.x=x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }
    draw(){
        c.beginPath();
        c.arc(this.x,this.y,this.radius, 0,Math.PI*2,false)
        
        c.fillStyle=this.color
        c.fill()

    }
}



class Projectile{
    constructor(x,y,radius, color,velocity){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }
    draw(){
        c.beginPath();
        c.arc(this.x,this.y,this.radius, 0,Math.PI*2,false)
        
        c.fillStyle=this.color
        c.fill()
    }
    update(){
        this.draw()
        this.x+=this.velocity.x;
        this.y+=this.velocity.y;
    }
}

class Enemy{
    constructor(x,y,radius, color,velocity){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }
    draw(){
        c.beginPath();
        c.arc(this.x,this.y,this.radius, 0,Math.PI*2,false)
        
        c.fillStyle=this.color
        c.fill()
    }
    update(){
        this.draw()
        this.x+=this.velocity.x;
        this.y+=this.velocity.y;
    }
}


class Particle{
    constructor(x,y,radius, color,velocity){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
        this.alpha = 1
    }
    draw(){
        c.save()
        c.beginPath();
        c.arc(this.x,this.y,this.radius, 0,Math.PI*2,false)
        c.globalAlpha=this.alpha
        c.fillStyle=this.color
        c.fill()
        c.restore()
    }
    update(){
        this.draw()
        this.x+=this.velocity.x;
        this.y+=this.velocity.y;
        this.alpha-=0.01
    }
}


const player=new Player(x,y,10,'white')
// console.log(player)
player.draw()
var score=0
let proarray=[]
let enemyarray=[]
let particles=[]

function init(){ 
    proarray=[]
    enemyarray=[]
    particles=[] 
    score=0
    scorel.innerHTML=0
    document.querySelector('bigscore').innerHTML=0     
}

function spawnEnemy(){
    setInterval(()=>{

        let x
        let y
        const radius=(Math.random()*(30-4))+10
        if(Math.random()<0.50){
            x=Math.random()<0.5?0-radius:canvas.width+radius
            y=Math.random()*canvas.height
        }
        else{
            y=Math.random()<0.5?0-radius:canvas.height+radius
            x=Math.random()*canvas.width
        }
        // const color='green'
        const angle=Math.atan2(-y+canvas.height/2,-x+canvas.width/2)
        const color=`hsl(${Math.random()*360},50%,50%)`
        const velocity={
            x:Math.cos(angle),
            y:Math.sin(angle)
        }
        enemyarray.push(new Enemy(x,y,radius,color,velocity))
        // console.log(enemyarray)
    },1000)
}

let animationid

function animate(){
            animationid= requestAnimationFrame(animate)
            c.fillStyle='rgba(0,0,0,0.1)'

    // setInterval(()=>{
        // console.log(e)
        // console.log("as")
            // console.log(animate)
            c.fillRect(0,0,canvas.width,canvas.height)
            c.fillStyle='black'
            player.draw()

            particles.forEach((particle,index)=>{
                if(particle.alpha<=0){
                    particles.splice(index,1)
                }else{
                particle.update()
                }
            })
            proarray.forEach((projectiles,index) => {
            
                projectiles.update()
                // console.log(proarray.length)
                if(projectiles.x-projectiles.radius<0||
                    projectiles.x-projectiles.radius>canvas.width||
                    projectiles.y-projectiles.radius<0||
                    projectiles.y-projectiles.radius>canvas.height){
                    setTimeout(() => {
                        proarray.splice(index,1)
                    }, 0);
                }
            });
            enemyarray.forEach((enemy,index)=>{
                enemy.update()
                const dist =(Math.hypot(player.x-enemy.x,player.y-enemy.y))
                if(dist-enemy.radius-player.radius<1){
                    // console.log(animationid)
                    cancelAnimationFrame(animationid)
                    document.querySelector('#bigscore').innerHTML=score
                    document.querySelector('#outer').style.display='flex'
                    init() 
                }
                proarray.forEach((projectile,proindex)=>{
                    const dist =(Math.hypot(projectile.x-enemy.x,projectile.y-enemy.y))
                    if(dist-enemy.radius-projectile.radius<1){

                        score+=100
                        console.log(score)
                        scorel.innerHTML=score
                        for (let i = 0; i < enemy.radius*2; i++) {
                            particles.push(new Particle(projectile.x,projectile.y,Math.random()*2,enemy.color,{x:(Math.random()-0.5)*8,y:(Math.random()-0.5)*8}))                            
                        }

                        if(enemy.radius -5> 10){
                            // enemy.radius= enemy.radius - 10
                            gsap.to(enemy,{
                                radius:enemy.radius-10
                            })
                            setTimeout(() => {
                                
                                proarray.splice(proindex,1)
                            }, 0);
                        }else{
                            setTimeout(() => {
                                enemyarray.splice(index,1)
                                proarray.splice(proindex,1)
                            }, 0);
                        }
                        // console.log("collide")
                        
                        
                    }
                })
            })
    // },1000)    
    
    
   
    
}
const ca=canvas.width

// console.log(ca)
window.addEventListener('click',(e)=>{
    // console.log(e)
    // console.log(e.clientY,canvas.width/2)
    const angle=Math.atan2(e.clientY-canvas.height/2,e.clientX-canvas.width/2)
    const velocity={
        x:Math.cos(angle)*7,
        y:Math.sin(angle)*7
    }
    // console.log(angle) 
    proarray.push(new Projectile(canvas.width/2,canvas.height/2,5,'white',velocity))
})

// window.requestAnimationFrame(animate)
startbtn.addEventListener('click',()=>{
    console.log("start")
    animate()
    spawnEnemy()
    document.querySelector("#outer").style.display='none'
})