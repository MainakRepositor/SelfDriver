var c = 0;
var aiPos = 0;

var walls = 0;
var avoided = 0;
var crash = 0;

function tick()
{
    c++;
    document.getElementById('stepsDone').value = c;
    moveWall(); //move wall to the left
    checkCollision();
    experience();
}

var tickInterval;

function runSim(state)
{
    if(state == 1)//run simulation
    {
        if(c > 100)
        {
            runSim('0'); //force stop
        }else{
                tickInterval = setInterval("tick();", 20);
             } 
        
    }else{
            //stop simulation
            clearInterval(tickInterval);
            c = 0;
            document.getElementById('stepsDone').value = c;
            document.getElementById('wall').style.left = null;
            document.getElementById('wall').style.right = '0px';
        	document.getElementById('ai').style.marginTop = "50px";
        	aiPos = 0;
        	walls = 0;
        	crash = 0;
        	avoided = 0;
        
         }
}

function moveWall()
{
    var getWallX = document.getElementById('wall').offsetLeft;
    var getWallY = document.getElementById('wall').offsetTop;
    
    var getAIX = document.getElementById('sensor_2').offsetLeft+500;
    var getAIY = document.getElementById('ai').offsetTop;
    
    var successRate = Math.floor((avoided/(avoided+crash)*100));   
    
    document.getElementById('topDebug').innerHTML = "&nbsp;["+c+"]<br>&nbsp;Wall ("+getWallX+","+getWallY+")<br>&nbsp;AI ("+getAIX+","+getAIY+")<br>&nbsp;Walls: "+walls+" Avoided: "+avoided+" Crash: "+crash+" Success rate: "+successRate+"%";
        
    if(getWallX <= 0)
    {
        
        walls++;
        
    }else{
            getWallX = getWallX-20;
            document.getElementById('wall').style.left = getWallX+'px';
         }
    
}


function moveCar(direction)
{
    //auto correct
    if(aiPos < 50){aiPos = 50;}
    if(aiPos > 200){aiPos = 200;}
    
    if(direction == 'down')
    {
     	aiPos=aiPos+10;   
    }else{ 
     		aiPos=aiPos-10;   
    	 }    
    
    
    document.getElementById('ai').style.marginTop = aiPos+"px";
}


function checkCollision()
{
	var getWallX = document.getElementById('wall').offsetLeft;
    var getAIX = document.getElementById('sensor_2').offsetLeft+500;
    
    var getWallY = document.getElementById('wall').offsetTop+100;
    var getAIY = document.getElementById('ai').offsetTop;
        
    if(getWallX < getAIX && getAIY >= getWallY-100 && getAIY < getWallY || getWallX < getAIX && getWallY-100 > getAIY && getWallY-100 < getAIY+50)
    {
     	//moveCar('down');        	 
        document.getElementById('sensor_2').style.backgroundColor = 'red';
        //decide if the car was hit
        if(getWallX < 100){crash++;}
        
    }else{
        	document.getElementById('sensor_2').style.backgroundColor = 'white';
        	if(getWallX < 100){avoided++;}
    	 }
    
}

var lastWallCount = 0;
var lastAvoided = 0;
var lastCrash = 0;
var tryzone = 0;

function experience()
{
		var aizone;
    var wallzone;
    
    //get wall and ai zone
    var getWallY = document.getElementById('wall').offsetTop;
    var getAIY = document.getElementById('ai').offsetTop;
    
    var getWallCenter = (getWallY-100)+50;
    
    if(getWallCenter <= 150)
    {
    	//zone 0
      document.getElementById('t_wall_zone').innerHTML = "0";
      wallzone = "0";
    }else{
    			//zone 1
          document.getElementById('t_wall_zone').innerHTML = "1";
          wallzone = "1";
    		}
        
    var getAICenter = (getAIY-100)+25;
    
    if(getAICenter <= 150)
    {
      //zone 0
      document.getElementById('t_ai_zone').innerHTML = "0";
      aizone = "0";
    }else{
          	//zone 1
      			document.getElementById('t_ai_zone').innerHTML = "1";
            aizone = "1";
    			}
          
    //trying
    document.getElementById('t_trying').innerHTML = tryzone;
   

   
    
    //read from experience 'database'
    var buildvar = aizone+wallzone+tryzone;
    var experienceDB = document.getElementById('succ_'+buildvar).innerHTML;
    
    //read from 'DB' and decide
    if(tryzone == 0)
    {
    	buildvarOther = aizone+wallzone+1;
      experienceDBOther = document.getElementById('succ_'+buildvarOther).innerHTML;
      if(parseInt(experienceDBOther) > parseInt(experienceDB)+parseInt(10))
      {
      	buildvar = buildvarOther;
        experienceDB = document.getElementById('succ_'+buildvar).innerHTML;
        tryzone = 1;
      }
    
    }
    
    if(tryzone == 1)
    {
    	buildvarOther = aizone+wallzone+0;
      experienceDBOther = document.getElementById('succ_'+buildvarOther).innerHTML;
      if(parseInt(experienceDBOther) > parseInt(experienceDB)+parseInt(10))
      {
      	buildvar = buildvarOther;
        experienceDB = document.getElementById('succ_'+buildvar).innerHTML;
        tryzone = 0;
      }
    
    }
    
    
    //move AI
   	if(tryzone == 0){moveCar('up');}else{moveCar('down');}
    

		//update DB only when wall is leftmost
		if(lastWallCount != walls)
    {
    	//do update
      if(lastAvoided != avoided)
      {
      	experienceDB = parseInt(experienceDB)+parseInt(1);
        document.getElementById('succ_'+buildvar).innerHTML = experienceDB;
        lastAvoided = avoided;
      }
      
      if(lastCrash != crash)
      {
        experienceDB = parseInt(experienceDB)-parseInt(1);
        document.getElementById('succ_'+buildvar).innerHTML = experienceDB;
        lastCrash = crash;
      }
      
    	lastWallCount = walls;
      tryzone = Math.floor(Math.random() * 2);//random between 0 and 1
      
        //randomize wall position
        var randomWallYPos = Math.floor(Math.random() * (200 + 1) + 0);
        document.getElementById('wall').style.marginTop = randomWallYPos+"px";  
        
        document.getElementById('wall').style.left = null;
        document.getElementById('wall').style.right = '0px';
      
      
    }

}









