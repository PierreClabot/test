class PlanDeSalle{
    constructor(debug)
    {
    console.log("ini plan de salle");
  
      const shape = document.querySelector("#IMG_PLANSALLE");
      const globalContainer = document.querySelector("div[data-name=TB_PLAN_SVG]")
      const container = document.querySelector("div[data-name=PLAN-SALLE]");
      if(debug == true)
      {
        let contenu =  `<div Class="btn-plan-container">
                        <div class="btn-plan-debug" id="PLAN-DEBUG-CLEAR">Clear Debug</div>
                        <div Class="btn-plan-debug" id="PLAN Debug ON" onClick="document.querySelector('#PLAN-DBG').style.display='block';">Dbg ON</div>
                        <div class="btn-plan-debug" id="PLAN Debug OFF" onClick="document.querySelector('#PLAN-DBG').style.display='none';">Dbg Off</div>
                      </div>`;
        globalContainer.insertAdjacentHTML("afterbegin", contenu );
      }
      
      this.domElement=document.querySelector("div[data-name='PLAN-SALLE'] svg");

      this.mouseStartPosition = {x: 0, y: 0};
      this.mousePosition = {x: 0, y: 0};
      this.viewboxStartPosition = {x: 0, y: 0};
      this.viewboxPosition = {x: 0, y: 0};
      this.viewboxSize = {x: 670, y: 1010};
      this.viewboxScale = 1.0;
      this.echelleZoom = 1.5; 
      this.etatJeDeplace = false;
      this.nom = "plan de salle";
      this.viewPort = this.chaViewBoxVersObj(this.getViewBox()); // @@
      this.calculHauteur();
  
      window.onresize = this.calculHauteur;
  
      this.scale = 1;
      this.boolZoom = false;
      this.lastScale = 1;
      this.boolPremierScale = true;
      this.positionSVG = {
        X : 0,
        Y : 0,
      };
  
      this.vecteur = {
          X:0,
          Y:0
      }
      this.historiquePos=[{X:0,Y:0},{X:0,Y:0}];
      this.transformOrigin = {x:0,y:0}; // Ajout
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
      this.scale = 1;
  
  
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
      const svg = document.querySelector("div[data-name='PLAN-SALLE'] svg");
      this.scaleWheelDeltaY = 1;

      document.addEventListener("touchstart",(e)=>{
        if(e.touches.length>1)
        {
          e.stopPropagation();
          e.preventDefault();
          this.debugL(" !touchemovedocument! ");
        }
      })
      document.addEventListener("touchmove",(e)=>{
        if(e.touches.length>1)
        {
          e.stopPropagation();
          e.preventDefault();
          this.debugL(" !touchemovedocument! ");
        }
      });
      /* TEST APPLE AJOUT */
      document.addEventListener('gesturestart', function (e) {
        e.preventDefault();
    });
      document.querySelector("#PLAN-ZOOM").addEventListener("mousedown",(e)=>{
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        let objViewBox = this.chaViewBoxVersObj(this.getViewBox()); // @@
        // On zoom -> on réduit la taille du viewbox
        let nouveauViewBox = {
          x:objViewBox.x, // (Math.round(objViewBox.largeur/this.echelleZoom))/4
          y:objViewBox.y, // (Math.round(objViewBox.hauteur/this.echelleZoom))/4 
          largeur:Math.round(objViewBox.largeur/this.echelleZoom),
          hauteur:Math.round(objViewBox.hauteur/this.echelleZoom)
        }
        this.setViewBox(this.objViewBoxVersCha(nouveauViewBox))

      });
      document.querySelector("#PLAN-ZOOM").addEventListener("touchstart",(e)=>{
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        let objViewBox = this.chaViewBoxVersObj(this.getViewBox()); // @@
        // On zoom -> on réduit la taille du viewbox
        let nouveauViewBox = {
          x:objViewBox.x, // (Math.round(objViewBox.largeur/this.echelleZoom))/4
          y:objViewBox.y, // (Math.round(objViewBox.hauteur/this.echelleZoom))/4 
          largeur:Math.round(objViewBox.largeur/this.echelleZoom),
          hauteur:Math.round(objViewBox.hauteur/this.echelleZoom)
        }
        this.setViewBox(this.objViewBoxVersCha(nouveauViewBox))

      });
  
    
      document.querySelector("#PLAN-DEZOOM").addEventListener("mousedown",(e)=>{
        e.stopPropagation();
        e.preventDefault();

        console.log(this.getViewBox());
        let objViewBox = this.chaViewBoxVersObj(this.getViewBox()); // @@
        console.log(objViewBox);
        // On zoom -> on réduit la taille du viewbox
        let nouveauViewBox = {
          x:objViewBox.x,
          y:objViewBox.y,
          largeur:Math.round(objViewBox.largeur*this.echelleZoom),
          hauteur:Math.round(objViewBox.hauteur*this.echelleZoom)
        }
        //this.domElement.setAttribute("viewBox",this.objViewBoxVersCha(nouveauViewBox))
        this.setViewBox(this.objViewBoxVersCha(nouveauViewBox))

      })

      document.querySelector("#PLAN-DEZOOM").addEventListener("touchstart",(e)=>{
        e.stopPropagation();
        e.preventDefault();

        console.log(this.getViewBox());
        let objViewBox = this.chaViewBoxVersObj(this.getViewBox()); // @@
        console.log(objViewBox);
        // On zoom -> on réduit la taille du viewbox
        let nouveauViewBox = {
          x:objViewBox.x,
          y:objViewBox.y,
          largeur:Math.round(objViewBox.largeur*this.echelleZoom),
          hauteur:Math.round(objViewBox.hauteur*this.echelleZoom)
        }
        //this.domElement.setAttribute("viewBox",this.objViewBoxVersCha(nouveauViewBox))
        this.setViewBox(this.objViewBoxVersCha(nouveauViewBox))

      })
  
      window.addEventListener("mouseup", (e)=>{
        this.etatJeDeplace = false;
      });
  
      document.addEventListener("touchstart",(e)=>{
        if(e.touches.length>1)
        {
          e.stopPropagation();
          e.preventDefault();
          this.debugL(" !touchemovedocument! ");
        }
      })
      document.addEventListener("touchmove",(e)=>{
        if(e.touches.length>1)
        {
          e.stopPropagation();
          e.preventDefault();
          this.debugL(" !touchemovedocument! ");
        }
      });
      /* TEST APPLE */
      document.addEventListener('gesturestart', function (e) {
        e.preventDefault();
    });
  
  
      //@MODIF
      if(debug != false)
      {
        document.querySelector("#PLAN-DEBUG-CLEAR").addEventListener("click",(e)=>{
          this.debugClear();
        });
      }
      document.querySelector("#PLAN-CENTRER").addEventListener("click",(e)=>{ 
        this.reset();
      });
  
      document.querySelector("#PLAN-CENTRER").addEventListener("touchstart",(e)=>{ 
        this.reset();
      });
  
  
      svg.addEventListener("mousedown",e=>{
        this.premierAppui = {
          x:e.clientX,
          y:e.clientY,
          offsetX : e.offsetX,
          offsetY : e.offsetY
        }
        
      })
  
      svg.addEventListener("touchstart",e=>{

        var rect = e.target.getBoundingClientRect();
        var offsetX = e.targetTouches[0].pageX - rect.left;
        var offsetY = e.targetTouches[0].pageY - rect.top;
        this.premierAppui = {
          x:e.touches[0].clientX,
          y:e.touches[0].clientY,
          offsetX : offsetX,
          offsetY : offsetY
        }

      })
  
      svg.addEventListener("touchend",e=>{
  
        let point = {
          x : e.changedTouches[0].clientX,
          y: e.changedTouches[0].clientY
        }

        if((Math.abs(point.x-this.premierAppui.x)<this.toleranceTouch) && (Math.abs(point.y-this.premierAppui.y)<this.toleranceTouch))
        {
          let x = (this.premierAppui.offsetX/this.scale) / svg.offsetWidth;
          let y = (this.premierAppui.offsetY/this.scale) / svg.offsetHeight;
          let data = { coefX:x , coefY:y };
          this.fire(data);
          this.stopGlisse();
          this.debug(`data -> X: ${data.coefX} Y:${data.coefY}`);
        }
      })
  
      svg.addEventListener("mouseup",e=>{
        let point = {
          x : e.clientX,
          y: e.clientY
        }
        
        if((Math.abs(point.x-this.premierAppui.x)<this.toleranceMouse) && (Math.abs(point.y-this.premierAppui.y)<this.toleranceMouse))
        {
          let x = e.offsetX / svg.offsetWidth;
          let y = e.offsetY / svg.offsetHeight;
          let data = { coefX:x , coefY:y };
          this.fire(data);
        }
      })
      
      container.addEventListener("touchstart",e=>{
        
        e.stopPropagation();
        e.preventDefault(); 
        
        if (e.touches.length>1) {
          this.etatJeDeplace=false;
          this.curDiffInitial=this.norme2Points( {X:e.touches[0].clientX,Y:e.touches[0].clientY }, {X:e.touches[1].clientX,Y:e.touches[1].clientY } );
        }
        console.log("********** EVENT **********",e);
        if (e.touches.length==1) {
            this.appuiEn(e,e.touches[0].clientX,e.touches[0].clientY)
        }
      })
  
      container.addEventListener("mousedown", e =>{
        this.appuiEn(e,e.clientX, e.clientY);
        return;
      })
      container.addEventListener("touchmove",(e)=>{

        e.stopPropagation();
        e.preventDefault(); 

        if(e.touches.length > 1) // Plusieurs doigts simultanés
        {
          let lastScale;
            if(this.boolPremierScale)
            {
              this.vInit =this.norme2Points( {X:e.touches[0].clientX,Y:e.touches[0].clientY }, {X:e.touches[1].clientX,Y:e.touches[1].clientY } );
              this.scaleInit=this.scale;
              this.boolPremierScale = false;
              lastScale=1;
            }
            let vT = this.norme2Points( {X:e.touches[0].clientX,Y:e.touches[0].clientY }, {X:e.touches[1].clientX,Y:e.touches[1].clientY } );
            
            var rect = e.target.getBoundingClientRect();
  
            let offsetX = {
              touche1:e.touches[0].pageX - rect.left,
              touche2:e.touches[1].pageX - rect.left,
            }
  
            let offsetY = {
              touche1:e.touches[0].pageY - rect.top,
              touche2:e.touches[1].pageY - rect.top,
            }
  
            // this.transformOrigin = {
            //   X:((Math.abs((offsetX.touche1 + offsetX.touche2)/2)/(this.domElement.offsetWidth*this.scale))*100),
            //   Y:((Math.abs((offsetY.touche1 + offsetY.touche2)/2)/(this.domElement.offsetWidth*this.scale))*100)
            // }
            // if(this.transformOrigin.X>100)
            // {
            //   this.transformOrigin.X = 100;
            // }
            // if(this.transformOrigin.X<0)
            // {
            //   this.transformOrigin.X = 0;
            // }
            // if(this.transformOrigin.Y>100)
            // {
            //   this.transformOrigin.Y = 100;
            // }
            // if(this.transformOrigin.Y<0)
            // {
            //   this.transformOrigin.Y= 0;
            // }
            let coefScale = vT/this.vInit;
            // this.debug(coefScale);
            //let scale = this.scaleInit * coefScale;

            // this.debug("this.transformOriginX"+this.transformOrigin.X);
            // this.debug("this.transformOriginY"+this.transformOrigin.Y);
            this.debug("*******")
            if(coefScale>lastScale)
            {
              this.debug("ZOOM");
            }
            else{
              this.debug("DEZOOM");
            }
            let chaViewBox = this.getViewBox();
            let objViewBox = this.chaViewBoxVersObj(chaViewBox);
            objViewBox.largeur *= scale;
            objViewBox.hauteur *= scale;
            chaViewBox = this.objViewBoxVersCha(objViewBox);

            lastScale = coefScale;
            // this.debug(this.vInit);
            //this.debug("Scale "+scale)
            //this.debug("chaViewBox"+chaViewBox);
            this.setViewBox(chaViewBox);
        
            // this.zoom(e,scale);
        }
        if(e.touches.length == 1)
        {
          console.log(e);
          this.etatJeDeplace=true;
          this.bougerEn(e,e.touches[0].clientX , e.touches[0].clientY);
        }
  
      })
      container.addEventListener("wheel", e=>{
        e.stopPropagation();
        e.preventDefault();

        let zoom = true;
        let scaleWheelDeltaY = this.scale;
        let c
        if(e.wheelDeltaY < 0) // DEZOOM
        {
          // scaleWheelDeltaY = scaleWheelDeltaY / 2;
          let chaViewBox = this.getViewBox();
          let objViewBox = this.chaViewBoxVersObj(chaViewBox);
          let ancienneHauteur = objViewBox.hauteur;
          let ancienneLargeur = objViewBox.largeur;
          objViewBox.largeur = objViewBox.largeur*1.5;
          objViewBox.hauteur = objViewBox.hauteur*1.5;
          if(this.positionSouris){
            objViewBox.x -= ((objViewBox.largeur-ancienneLargeur)/2);
            objViewBox.y -= ((objViewBox.hauteur-ancienneHauteur)/2)
          }
          chaViewBox = this.objViewBoxVersCha(objViewBox);
          this.setViewBox(chaViewBox);
          // this.transformOrigin = {
          //   X:50,
          //   Y:50
          // }
          // this.domElement.style.transformOrigin = `${this.transformOrigin.X}% ${this.transformOrigin.Y}%` ;
          //console.log("reset Transform Origin");
        }
        else // ZOOM
        {
          let chaViewBox = this.getViewBox();
          let objViewBox = this.chaViewBoxVersObj(chaViewBox);
          objViewBox.largeur = objViewBox.largeur/1.5;
          objViewBox.hauteur = objViewBox.hauteur/1.5;

          if(this.positionSouris){
            objViewBox.x = this.positionSouris.x-(objViewBox.largeur/2);
            objViewBox.y = this.positionSouris.y-(objViewBox.hauteur/2)
          }
          chaViewBox = this.objViewBoxVersCha(objViewBox);
          this.setViewBox(chaViewBox);
          // scaleWheelDeltaY = scaleWheelDeltaY * 2;
        }
        // if(scaleWheelDeltaY<0.5)
        // {
        //   scaleWheelDeltaY = 0.5;
        //   zoom = false;
        // }
        // else if(scaleWheelDeltaY>8)
        // {
        //   scaleWheelDeltaY = 8;
        //   zoom = false;
        // }
  
        if(zoom)
        {
          this.zoom(e,scaleWheelDeltaY);
        }
      })
  
      //@MODIF
      container.addEventListener("mousemove",(e)=>{
          
          e.stopPropagation();
          e.preventDefault(); 
          if(e.target.id == "IMG_PLANSALLE")
          {
            this.transformOrigin = 
            {
              X:(e.offsetX*this.scale/(this.domElement.offsetWidth*this.scale))*100,
              Y:(e.offsetY*this.scale/(this.domElement.offsetHeight*this.scale))*100
            }
          }
          //console.log(`e:{x${e.pageX}, y:${e.pageY}}`);

          this.bougerEn(e,e.clientX , e.clientY);
          return;
      });
  
      container.addEventListener("mouseup",(e)=>{

          e.stopPropagation();
          e.preventDefault(); 

          let norme = Math.sqrt((this.vecteur.X * this.vecteur.X)+(this.vecteur.Y * this.vecteur.Y)); // utiliser methode

          if(norme > this.sourisGlisseMax)
          {
            this.vecteur.X = this.vecteur.X/norme;
            this.vecteur.Y = this.vecteur.Y/norme;
            this.vecteur.X = this.vecteur.X * this.sourisGlisseMax;
            this.vecteur.Y = this.vecteur.Y * this.sourisGlisseMax;

          }
          this.vInit = {
            x:this.vecteur.X,
            y:this.vecteur.Y
          }

          this.lever(e);
      });
      
  
      container.addEventListener("touchend",(e)=>{
        e.stopPropagation();
        e.preventDefault(); 
        this.boolPremierScale = true;
        this.boolPremierDeplacement = true;
        let norme = Math.sqrt((this.vecteur.X * this.vecteur.X)+(this.vecteur.Y * this.vecteur.Y)); // utiliser methode
        if(norme > this.sourisGlisseMax)
        {
          this.vecteur.X = this.vecteur.X/norme;
          this.vecteur.Y = this.vecteur.Y/norme;
          this.vecteur.X = this.vecteur.X * this.sourisGlisseMax;
          this.vecteur.Y = this.vecteur.Y * this.sourisGlisseMax;
        }
        this.vInit = {
          x:this.vecteur.X,
          y:this.vecteur.Y
        }
        this.lever(e);   
      })  
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
    //console.log(date)
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
      return;
  }
  
  
  bougerEn(event,x,y)
  {
    this.positionSouris = {
      x : x,
      y : y
    }

    if(this.etatJeDeplace)
    {
      this.historiquePos[0]={
        X : this.historiquePos[1].X ,
        Y : this.historiquePos[1].Y
      }
      this.historiquePos[1]={
        X : x,
        Y : y
      }
  
      this.vecteur={
        X:this.historiquePos[1].X - this.historiquePos[0].X,
        Y:this.historiquePos[1].Y - this.historiquePos[0].Y,
      }
      console.log("historiquePos",this.historiquePos);
      console.log("this.vecteur",this.vecteur)
      
      //console.log("vecteurDeplacement",this.vecteur)
      let posActuelle=this.svgPositionDonne();  
      console.log(posActuelle);
      //console.log("posActuelle",posActuelle)    
      posActuelle.X-=this.vecteur.X;
      posActuelle.Y-=this.vecteur.Y;

      // posActuelle = this.limiteDeplacement(posActuelle);
      this.svgPosition(posActuelle);

    }
    return;
  }
  
  limiteDeplacement(position)
  {
    let posActuelle = {
      X:position.X,
      Y:position.Y
    };
    let style = getComputedStyle(this.domElement);
    let chaTransformOrigin = style.getPropertyValue('transform-origin');
    let widthReel = Math.round(this.domElement.getBoundingClientRect().width);
    let heightReel = Math.round(this.domElement.getBoundingClientRect().height);

    let tabTransformOrigin = chaTransformOrigin.split(" ");
    let transformOrigin = "";
  
    for(const text of tabTransformOrigin)
    {
      let transform = text.replace("px","");
      transformOrigin += transform+" ";
    }
    let objTransformOrigin = {
      X : this.arrondirMillieme(parseInt(transformOrigin.split(" ")[0],10)/this.domElement.offsetWidth*100),
      Y : this.arrondirMillieme(parseInt(transformOrigin.split(" ")[1],10)/this.domElement.offsetHeight*100)
    }


    let theorieLimiteX = (((objTransformOrigin.X-50)/100)*(widthReel/2))+(widthReel/2);
    let theorieLimiteY = (((objTransformOrigin.Y-50)/100)*(heightReel/2))+(heightReel/2);


    if(posActuelle.X>theorieLimiteX || posActuelle.X<theorieLimiteX-widthReel)
    {
      if(posActuelle.X>theorieLimiteX)
      {
        posActuelle.X = theorieLimiteX;
      }
      else{
        posActuelle.X = theorieLimiteX-widthReel;
      }

      // posActuelle.X = theorieLimiteX * (Math.abs(posActuelle.X)/posActuelle.X);
    }

    if(posActuelle.Y>theorieLimiteY || posActuelle.Y<theorieLimiteY-heightReel)
    {
      if(posActuelle.Y>theorieLimiteY)
      {
        posActuelle.Y = theorieLimiteY;  
      }
      else{
        posActuelle.Y=theorieLimiteY-heightReel
      }

      // posActuelle.Y = theorieLimiteY * (Math.abs(posActuelle.Y)/posActuelle.Y);
    }
    return posActuelle;
  }
  stopGlisse(){
    if(this.myInterval)
    {
      clearInterval(this.myInterval);
      this.myInterval = 0;
      this.vecteur = {
        X:0,
        Y:0
      }
    }
  }
  
  
  zoom(e,scale)
  {
    this.scale = scale;
    if(this.scale < 0.1){ this.scale = 0.1;}
    this.scaleDOM();
  }
  
  
  lever(e)
  {
    this.etatJeDeplace=false;
    this.boolZoom = true;
    this.lastScale = 1;
    this.clicSouris = false;

    if(e.target == document.querySelector("#PLAN-ZOOM") || e.target == document.querySelector("#PLAN-DEZOOM"))
    {
      return;
    }
    this.t1 = Date.now();
    //this.stopGlisse();
    this.myInterval = setInterval(this.defilementScroll.bind(planDeSalle),this.intervalAnimationMs);
  }
  
  
  defilementScroll()
  {
    let SVGPos=this.svgPositionDonne();

    SVGPos = {
      X : -this.vecteur.X + SVGPos.X,
      Y : -this.vecteur.Y + SVGPos.Y
    }
    
  
    this.tt = Date.now();
    let t = (this.tt-this.t1)/this.tempsGlisse;
    let sinus = Math.sin((Math.PI/4)*(1-t))

    this.vecteur = {
      X : this.vInit.x * sinus * this.coeffGlisse,
      Y : this.vInit.y * sinus * this.coeffGlisse
    }

    if(this.tt-this.t1 >= this.tempsGlisse)
    {
      clearInterval(this.myInterval);
      this.myInterval = 0;
    }
    
    //SVGPos = this.limiteDeplacement(SVGPos);
    this.svgPosition(SVGPos);
    
    this.dernierePositionSVG = { X:this.positionSVG.X , Y:this.positionSVG.Y };
  }
  
  scaleDOM(){
    this.domElement.style.transformOrigin = `${this.transformOrigin.X}% ${this.transformOrigin.Y}%` 
    this.domElement.style.transform = `scale(${this.scale})`;
    this.domElement.style.left = `0px`;
    this.domElement.style.top = `0px`;
  }
  
  // setviewbox() // inutile ?
  // {

  //   var vp = {x: viewboxPosition.x ,  y:viewboxPosition.y};
  //   var vs = {x: viewboxSize.x * viewboxScale , y:  viewboxSize.y * viewboxScale};
  //   shape = document.getElementsByTagName("svg")[0];
  //   shape.setAttribute("viewBox", vp.x + " " + vp.y + " " + vs.x + " " + vs.y);
  // }
  
  
  
  mousemove(e) // debug
  {

    mousePosition.x = e.offsetX;
    mousePosition.y = e.offsetY;
    
    if (mouseDown)
    {
      viewboxPosition.x = viewboxStartPosition.x + (mouseStartPosition.x - e.pageX) * viewboxScale;
      viewboxPosition.y = viewboxStartPosition.y + (mouseStartPosition.y - e.pageY) * viewboxScale;
  
      this.setviewbox();
    }
    
    var mpos = {x: mousePosition.x * viewboxScale, y: mousePosition.y * viewboxScale};
    var vpos = {x: viewboxPosition.x, y: viewboxPosition.y};
    var cpos = {x: mpos.x + vpos.x, y: mpos.y + vpos.y}
  }
  
  
  
  mouseup(e) { // debug
    window.removeEventListener("mouseup", this.mouseup);
  }
  

  svgPosition(point) {
    //console.log("point",point);
    let deplacement = {
      X : point.X,
      Y : point.Y
    }

    let chaViewBox = this.getViewBox(); // @@
    let objViewBox = this.chaViewBoxVersObj(chaViewBox);
    objViewBox.x = deplacement.X;
    objViewBox.y = deplacement.Y;

    chaViewBox = this.objViewBoxVersCha(objViewBox);

    // this.domElement.setAttribute("viewBox",chaViewBox);
    this.setViewBox(chaViewBox);
  }
  
  svgPositionDonne() {
  
    let objViewBox = this.chaViewBoxVersObj(this.getViewBox()); // @@
    //console.log(objViewBox);
    //console.log("SVGPositionDonne",objViewBox);
    let point = { 
                  X : objViewBox.x, 
                  Y : objViewBox.y, 
                };

    return point;
  }
  
  reset(){
    this.stopGlisse();   
    this.scale = 1;
    this.scaleDOM()

    let objViewBox = {
      x:0,
      y:0,
      largeur:this.viewPort.largeur,
      hauteur:this.viewPort.hauteur
    }
    let chaViewBox = this.objViewBoxVersCha(objViewBox);
    this.setViewBox(chaViewBox);
    this.transformOrigin = { X:50, Y:50 }
    this.domElement.style.transformOrigin = "50% 50%";
    // this.svgPosition({X:0,Y:0});
    this.scale = 1
    this.lastScale = 1;
  }
  setViewBox(chaViewBox){
    this.domElement.setAttribute("viewBox",chaViewBox);
  }
  getViewBox(){
    return this.domElement.getAttribute("viewBox");
  }
  chaViewBoxVersObj(chaViewBox) // @UTILE
  {
    
    let tabViewBox = chaViewBox.split(" ");
    let objViewBox = {
      x:parseInt(tabViewBox[0],10),
      y:parseInt(tabViewBox[1],10),
      largeur:parseInt(tabViewBox[2],10),
      hauteur:parseInt(tabViewBox[3],10)
    };
    return objViewBox;
  }

  objViewBoxVersCha(objViewBox){ // @UTILE
    return `${objViewBox.x} ${objViewBox.y} ${objViewBox.largeur} ${objViewBox.hauteur}`
  }

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
  
  unsubscribe(fn) {
      this.observers = this.observers.filter(
          function (item) {
              if (item !== fn) {
                  return item;
              }
          }
      );
  }
  
  fire(data) {
      this.observers.forEach(function (item) {
          item.onClick(data);
      });
  }
}