class PlanDeSalle{
  constructor(debug)
  {
  console.log("ini plan de salle");
    this.obj = this.createObj();
    this.plan = new Plan(document.querySelector("#canvas"),this.obj,800,800);
    const shape = document.querySelector("#IMG_PLANSALLE");
    const globalContainer = document.querySelector("div[data-name=TB_PLAN_SVG]")
    const container = document.querySelector("div[data-name=PLAN-SALLE]");
    if(debug == true)
    {
      let contenu =  `<div Class="btn-plan-container">
                      <div class="btn-plan-commande" id="PLAN-DEBUG-CLEAR">Clear Debug</div>
                      <div Class="btn-plan-commande" id="PLAN Debug ON" onClick="document.querySelector('#PLAN-DBG').style.display='block';">Dbg ON</div>
                      <div class="btn-plan-commande" id="PLAN Debug OFF" onClick="document.querySelector('#PLAN-DBG').style.display='none';">Dbg Off</div>
                    </div>`;
                    console.log(globalContainer);
      globalContainer.insertAdjacentHTML("afterbegin", contenu );
      // container.insertBefore(newNode,contenu)
      // document.querySelector(".btn-plan-container").remove();
    }
    

    this.mouseStartPosition = {x: 0, y: 0};
    this.mousePosition = {x: 0, y: 0};
    this.viewboxStartPosition = {x: 0, y: 0};
    this.viewboxPosition = {x: 0, y: 0};
    this.viewboxSize = {x: 670, y: 1010};
    this.viewboxScale = this.plan.getZoom();

    this.etatJeDeplace = false;
    this.nom = "plan de salle";

    this.calculHauteur();

    window.onresize = this.calculHauteur;

    // this.scale = 1;
    this.boolZoom = false;
    this.lastScale = this.plan.getZoom();
    this.boolPremierScale = true; // **
    this.positionSVG = {
      X : this.plan.getPosition().x,
      Y : this.plan.getPosition().y,
    };

    this.vecteur = {
        X:0,
        Y:0
    }
    this.historiquePos=[{x:0,y:0},{x:0,y:0}];
    // this.transformOrigin = {x:0,y:0}; // Ajout
    this.myInterval = 0 ;
    this.dernierePositionSVG = {
      X:0,
      Y:0
    };
    this.boolPremierDeplacement = true;
    this.pointReferenceInit = 0;
    this.toleranceTouchMove = 5; // A CHANGER
    this.maxY = 100;
    this.maxX = 200;
    this.clicSouris = false;
    this.curDiffInitial=1;
    this.prevDiff = -1;
    this.coeffGlisse = 0.70;
    // this.coeffGlisseInitial = 0.95;
    // this.scale = 1;

    this.domElement=document.querySelector("#IMG_PLANSALLE");

    this.premierAppui = {x:0,y:0};
    this.observers = [];
    this.t1 ;
    this.tt;
    this.vInit = 0;
    this.scaleInit = 0;
    this.intervalAnimationMs = 1;
    this.tempsGlisse = 500;
    this.sourisGlisseMax = 50;
    this.toleranceMouse = 5;
    this.toleranceTouch = 5;

    const svg = document.querySelector("#canvas");
    
    //this.maxScale = 5;
    this.scaleWheelDeltaY = 1;

    //@MODIF
    // if(debug != false)
    // {
    //   document.querySelector("#PLAN-DEBUG-CLEAR").addEventListener("click",(e)=>{
    //     this.debugClear();
    //   });
      
      
    // }

    const domEvent = document.querySelector("#canvas");
    console.log(domEvent);
    // const domDebug = document.querySelector(".debug");
    this.etat = "rien";
    this.historiqueAppuis = [];
    this.pt1 = { p1:{x:0,y:0} , p2:{x:0,y:0 } , mp1p2:{x:0, y:0}};
    this.pt2 = { p1:{x:0,y:0} , p2:{x:0,y:0 } , mp1p2:{x:0, y:0}};
    this.historiqueAppuis.push(this.pt1);
    this.historiqueAppuis.push(this.pt2);

    domEvent.addEventListener("touchstart",(e)=>{
        e.preventDefault();
        e.stopPropagation();
        if(this.etat == "rien"){
            if(e.touches.length == 1)
            {
                this.etat = "bouge1point";
                this.historiqueAppuis[0] = this.creePointHistorique(e.touches[0].clientX,e.touches[0].clientY,e.touches[0].clientX,e.touches[0].clientY);
                this.historiqueAppuis[1] = this.creePointHistorique(e.touches[0].clientX,e.touches[0].clientY,e.touches[0].clientX,e.touches[0].clientY);
                return;
            }
            this.debug("Impossible T1")
        }
        if(e.touches.length == 2)
        {
            etat = "bouge2points";
            historiqueAppuis[1] = this.creePointHistorique(e.touches[1].clientX,e.touches[1].clientY,e.touches[1].clientX,e.touches[1].clientY);
            return; 
        }
        debug("Debug plus de 2 doigts");
    })

    domEvent.addEventListener("mousedown",(e)=>{
        e.preventDefault();
        e.stopPropagation();
        if(this.etat == "rien"){
            this.etat = "bouge1point";
            this.historiqueAppuis[0] = this.creePointHistorique(e.clientX,e.clientY,e.clientX,e.clientY);
            this.historiqueAppuis[1] = this.creePointHistorique(e.clientX,e.clientY,e.clientX,e.clientY);
            return;
        }
    })

    domEvent.addEventListener("touchmove",(e)=>{
        if(this.etat == "bouge1point")
        {
            this.historiqueAppuis = this.historisePoint(this.historiqueAppuis,e.touches[0].clientX,e.touches[0].clientY,0,0);
            
            let v = 
            {
                x:this.historiqueAppuis[1].p1.x - this.historiqueAppuis[0].p1.x,
                y:this.historiqueAppuis[1].p1.y - this.historiqueAppuis[0].p1.y
            }
            this.plan.bouge(v);
            return;
        }
        if(this.etat == "bouge2points"){ // JE ZOOM
            historiqueAppuis = historisePoint(historiqueAppuis,e.clientX,e.clientY,0,0);
            let v = 
            {
              x:this.historiqueAppuis[1].mp1p2.x - this.historiqueAppuis[0].mp1p2.x,
              y:this.historiqueAppuis[1].mp1p2.y - this.historiqueAppuis[0].mp1p2.y
            }
            return;
        }

    })

    domEvent.addEventListener("mousemove",(e)=>{
        // debug(etat);
        if(this.etat == "rien")
        {
            return ;
        }
        if(this.etat == "bouge1point")
        {
            this.historiqueAppuis = this.historisePoint(this.historiqueAppuis,e.clientX,e.clientY,0,0);
            let v = 
            {
                x:this.historiqueAppuis[1].p1.x - this.historiqueAppuis[0].p1.x,
                y:this.historiqueAppuis[1].p1.y - this.historiqueAppuis[0].p1.y
            }
            console.log(v);
            this.plan.bouge(v);
            return;
        }

    })

    domEvent.addEventListener("touchend",(e)=>{

        if(this.etat == "bouge2points")
        {
            this.etat = "bouge1point";
            this.historiqueAppuis[0] = this.creePointHistorique(e.touches[0].clientX,e.touches[0].clientY,e.touches[0].clientX,e.touches[0].clientY);
            this.historiqueAppuis[1] = this.creePointHistorique(e.touches[0].clientX,e.touches[0].clientY,e.touches[0].clientX,e.touches[0].clientY);
            return;
        }

        if(this.etat == "bouge1point")
        {
            this.etat = "rien";
            this.historiqueAppuis[0] = this.creePointHistorique(0,0,0,0);
            this.historiqueAppuis[1] = this.creePointHistorique(0,0,0,0);
            return;
        }
    })

    domEvent.addEventListener("mouseup",(e)=>{

        if(this.etat == "bouge1point")
        {
            this.etat = "rien";
            this.historiqueAppuis[0] = this.creePointHistorique(0,0,0,0);
            this.historiqueAppuis[1] = this.creePointHistorique(0,0,0,0);
            return;
        }
        // debug("Ne devrait jamais arriver");
    })

    domEvent.addEventListener("wheel",(e)=>{
      e.preventDefault();
      e.stopPropagation();
      //console.log(e);
      var ezoom = this.plan.getZoom();
      if(e.deltaY<0)
      {
        ezoom = 2;
        this.plan.ezoom(ezoom);
        console.log("je zoom");
      }
      else{
        ezoom = 0.5;
        this.plan.ezoom(ezoom);
        console.log("z0:"+ezoom);
        console.log("je dezoom");
      }
      console.log("z1:"+ezoom)

      console.log("z2:"+ezoom)
      // this.plan.ezoom(ezoom);
    })

  }

  historisePoint(h,x,y,x2,y2)
  {

      let h0 = this.creePointHistorique(h[1].p1.x,h[1].p1.y,h[1].p2.x,h[1].p2.y);
      let h1 = this.creePointHistorique(x,y,x2,y2);
      let h2= [h0,h1];
      return h2;
  }
  
  creePointHistorique(x,y,x2,y2)
  {
      let h = { 
              p1 : {
                  x : x,
                  y : y
              }, 
              p2 : {
                  x : x2,
                  y : y2
              },
              mp1p2 :
              {
                  x : (x+ x2)/2,
                  y : (y + y2)/2
              }

      }
              // m1: // A FAIRE
      return h;
  }



  mousedown(e) {
    this.debug('*************"MOUSE DOWN "');
    mouseStartPosition.x = e.pageX;
    mouseStartPosition.y = e.pageY;

    viewboxStartPosition.x = viewboxPosition.x;
    viewboxStartPosition.y = viewboxPosition.y;

    window.addEventListener("mouseup", this.mouseup);

    
}

afficheHeure(){
  let date = new Date();
  console.log(date)
}


calculHauteur(){
  let divTop = document.querySelector("div[data-name=PLAN-SALLE]").offsetTop;
  let hauteurEcran = document.documentElement.clientHeight;
  let difference = hauteurEcran - divTop;
  document.querySelector("div[data-name=PLAN-SALLE]").style.height = difference+"px";
}



appuiEn(e,x,y){
    
    this.historiquePos[0]={
      X: x,
      Y: y,
    }

    this.historiquePos[1]={
      X: x,
      Y: y,
    }

    this.etatJeDeplace=true;
    this.stopGlisse();
}





bougerEn(event,x,y)
{
  
   //this.debug("BOUGER EN x:"+x +" y"+y+" ")
   //this.debug("etatJeDeplace "+this.etatJeDeplace);
  if(this.etatJeDeplace)
  {
    // this.boolPremierScale = true;
    // this.debug("boolPremierScale"+this.boolPremierScale);
    this.historiquePos[0]={
      X : this.historiquePos[1].X ,
      Y : this.historiquePos[1].Y
    }
    this.historiquePos[1]={
      X : x,
      Y : y
    }
    console.log("historiquePos",this.historiquePos);
    this.vecteur={
      X:this.historiquePos[1].X - this.historiquePos[0].X,
      Y:this.historiquePos[1].Y - this.historiquePos[0].Y,
    }
    this.plan.bouge({x:this.vecteur.X,y:this.vecteur.Y})
    console.log(this.vecteur);
    
    
    let posActuelle={X : this.plan.getPosition().x,Y : this.plan.getPosition().y};
    
    posActuelle.X+=this.vecteur.X;
    posActuelle.Y+=this.vecteur.Y;
    this.plan.setPosition({x:posActuelle.X,y:posActuelle.Y});
  }

}


stopGlisse(){
  if(this.myInterval)
  {
    clearInterval(this.myInterval)
    this.myInterval = 0;
    //console.log("stopGlisse");
    this.vecteur = {
      X:0,
      Y:0
    }
  }
}



lever(e)
{
  //@MODIF
  //--this.dernierePositionSVG=this.positionSVG;
  
  this.etatJeDeplace=false;
  this.t1 = Date.now();
  // let norme = Math.sqrt((this.vecteur.X * this.vecteur.X)+(this.vecteur.Y * this.vecteur.Y)); // utiliser methode
  // if(norme > 10)
  // {
  //   this.vecteur.X = this.vecteur.X/norme;
  //   this.vecteur.Y = this.vecteur.Y/norme;
  //   this.vecteur.X = this.vecteur.X * 10;
  //   this.vecteur.Y = this.vecteur.Y * 10;
  // }
  // Calculer le vecteur vitesse
  // mémoriser la position du svg
  this.stopGlisse();
  // this.coeffGlisse = this.coeffGlisseInitial;
  //console.log("startGlisse");
  //this.myInterval = setInterval(this.defilementScroll.bind(planDeSalle),this.intervalAnimationMs);

  this.boolZoom = true;
  this.lastScale = 1;
  this.clicSouris = false;
  //console.log(e);
  // let point = {X : , Y: }
  // this.chercheElement(point)
}







defilementScroll()
{
  //console.log("*=",this.vecteur);

  let SVGPos={X:this.plan.getPosition().x,Y:this.plan.getPosition().y};
  console.log(SVGPos);
  console.log("defilementScroll");
  SVGPos = {
    X : this.vecteur.X + SVGPos.X,
    Y : this.vecteur.Y + SVGPos.Y
  }

  this.tt = Date.now();
  //console.log(this.vInit)
  let t = (this.tt-this.t1)/this.tempsGlisse;
  let sinus = Math.sin((Math.PI/4)*(1-t))
  // this.vecteur = {
  //   X : this.vInit.x * (1-t),
  //   Y : this.vInit.y * (1-t)
  // }
  this.vecteur = {
    X : this.vInit.x * sinus * this.coeffGlisse,
    Y : this.vInit.y * sinus * this.coeffGlisse
  }
  // this.vecteur = {
  //   X : this.vecteur.X * this.coeffGlisse, // 0.95
  //   Y : this.vecteur.Y * this.coeffGlisse  // 0.95
  // }
  if(this.tt-this.t1 >= this.tempsGlisse)
  {
    clearInterval(this.myInterval);
    this.myInterval = 0;
  }
  // this.coeffGlisse = this.coeffGlisse * 0.95;
  

  this.plan.setPosition({x:SVGPos.X,y:SVGPos.y});
  
  // let norme = Math.sqrt((this.vecteur.X * this.vecteur.X)+(this.vecteur.Y * this.vecteur.Y))
  // if(norme < 1)
  // {
  //   this.stopGlisse();
  //   return;
  // }

  this.dernierePositionSVG = { X:this.positionSVG.X , Y:this.positionSVG.Y };
}





mouseup(e) { // debug
  console.log("*****MOUSEU");
  window.removeEventListener("mouseup", this.mouseup);
  //mouseDown = false;
}





svgPosition(point) {
  let deplacement = {
    X : point.X,
    Y : point.Y
  }
//   let container = document.querySelector("div[data-name=PLAN-SALLE]"); @TODO A REVOIR bug format desktop
//   let widthSVG = this.domElement.getBoundingClientRect().width;
//   let heightSVG = this.domElement.getBoundingClientRect().height;

//   if(Math.abs(point.X) > (widthSVG/2)-(container.offsetWidth*0.3))
//   {
//     deplacement.X = ((widthSVG/2)-(container.offsetWidth*0.3))*(Math.abs(point.X)/(point.X));
//   }
//   if(Math.abs(point.Y) > (heightSVG/2)-(container.offsetHeight*0.3))
//   {
//     deplacement.Y = ((heightSVG/2)-(container.offsetHeight*0.3))*(Math.abs(point.Y)/(point.Y));
//   }
  this.domElement.style.left = `${deplacement.X}px`;
  this.domElement.style.top  = `${deplacement.Y}px`;

}



svgPositionDonne() {
  let point= { 
                X : this.domElement.offsetLeft, 
                Y : this.domElement.offsetTop, 
              };
  return point;
}

// chercheElement(point){
//   //console.log(point);
//   let container = document.querySelector("div[data-name=PLAN-SALLE]");
//   // console.log(container.getBoundingClientRect()); @TODO
// }

debug(chaine)
{
  console.log(chaine);
  document.querySelector(".event").innerHTML += "<br>"+chaine;
}
debugL(chaine)
{
  console.log(chaine);
  document.querySelector(".event").innerHTML += chaine;
}

arrondirMillieme(valeur){
  let val = (Math.round(valeur*1000))/1000
  return val;
}



pointVersChaine(chaInfo,p) {
  let chaRet=`${chaInfo}=(${p.X},${p.Y})`;
  return chaRet;
}

debugClear()
{
  document.querySelector(".event").innerHTML = ""
}

norme2Points(p1,p2) {
 let norme= Math.sqrt(  (p1.X - p2.X)*(p1.X - p2.X) + (p1.Y - p2.Y)*(p1.Y - p2.Y) );
 return norme;
}
pointReference(p1,p2){
  let pointReference = { x:Math.abs(p1.x-p2.x), y:Math.abs(p1.y-p2.y) }
  return pointReference;
}


subscribe(fn)
{
    this.observers.push(fn);
}

// Container Class
unsubscribe(fn) {
    this.observers = this.observers.filter(
        function (item) {
            if (item !== fn) {
                return item;
            }
        }
    );
}

// Container Class
fire(data) {
    this.observers.forEach(function (item) {
        item.onClick(data);
    });
}

createObj()
{
  let ob=[];
  for (let i=0; i<10000; i++) {
      

      ob.push( { name : 'objet '+i,
                x :Math.floor(Math.random() * 1000)+2,
                y : Math.floor(Math.random() * 1000)+2,
                width:  Math.floor(Math.random() * 10)+2,
                height : Math.floor(Math.random() *10)+2

      }
      );
  }

  ob.push( { name : 'test',
            x :40,
            y : 40,
            width:  40,
            height : 40
          }
  );

  return ob;
}

}



