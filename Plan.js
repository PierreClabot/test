

class Plan {

    constructor(canvas,objets,largeur,hauteur) {
        
        this.planReady=false;

        this.objets=objets;
        this.zoomBuffer=1;
        this.zoom=1;

        this.canvas=canvas;
        this.ctx2d=canvas.getContext('2d');
        
        //this.canvasB1=document.getElementById('B1'); //createElement('canvas');
        this.canvasB1=document.createElement("canvas");
        this.canvasB1.width=largeur;
        this.canvasB1.height=hauteur;
        this.ctx2dB1=this.canvasB1.getContext('2d');

        //this.canvasBHR=document.getElementById('TT'); //createElement('canvas');
        this.canvasBHR=document.createElement("canvas");
        this.canvasBHR.width=largeur;
        this.canvasBHR.height=hauteur;
        this.canvasBHR.sca
        this.ctx2dBHR=this.canvasBHR.getContext('2d');
        console.log("this.ctx2dBHR=",this.ctx2dBHR.width);
                
        this.domDbg=document.getElementById('DBG');
        
        this.bounds={
            x:0,y:0,width:this.canvas.width,height:this.canvas.height
        }

        this.boundsB1={
            x:0,y:0,width:this.canvasB1.width,height:this.canvasB1.height
        }
        this.boundsBHR={
            x:0,y:0,width:this.canvasBHR.width,height:this.canvasBHR.height
        }

        this.viewPort=new DOMRect(0,0,this.boundsB1.width,this.boundsB1.height);
                
        this.abortController=null;
        this.qt=new Quadtree(this.bounds,150,4);
  
        // window.URL = window.URL || window.webkitURL;
        // let response2=this.workerJob.toString().replace('workerJob()', '');
        // try {
        //    this.blob = new Blob([response2], {type: 'application/javascript'});
        //    console.log(this.blob);
        // } catch (e) { // Backwards-compatibility
        //     window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
        //     this.blob = new BlobBuilder();
        //     this.blob.append(response2);
        //     this.blob = this.blob.getBlob();
        // }
        
        this.prepare();
    }

    /* ne pas modifier le nom de cette fonction Cf : let response2=this.workerJob.toString().replace('workerJob()', ''); */
    /* Routine utilisée par le worker */
    ____workerJob() {
        let nbObjDessines=0;
        onmessage = (e) => {
            //console.log('**Message received from main script');
            //console.log("**Datas worker datas=",e.data);
            //console.log("**Datas commabd=",e.data[0]);
            //console.log("**Datas worker obj len="+e.data[1].length);
            //console.log("**Datas worker view=",e.data[2]);
            //console.log("**Datas worker zoom=",e.data[3]);
            //console.log("**Datas QTObs=",e.data[4]);
            
            if(e.data[0]=='hello') {
                self.postMessage(['hello']);
                return;
            }

            if(e.data[0]=='Draw' || e.data[0]=='Init' ) {
                
                let workerResult=dessineOffLine(e.data);
                if (workerResult!=null) {
                    dd=[e.data[0],workerResult,e.data[1].length];
                    self.postMessage(dd);
                    return;
                } 
                self.close();
                return;
            }

            postMessage(['err','commande de worker non connue']);
        }
    
    
       ____dessineOffLine=function(datas) {
            
            let objets=datas[1];
            let domRect=datas[2];
            let zoom=datas[3];
            
            let lar=Math.floor(domRect.width*zoom);
            let hau=Math.floor(domRect.height*zoom);
            
            let offCan=new OffscreenCanvas(lar,hau);
            let ctx=offCan.getContext('2d');
            
                        
            ctx.clearRect(0,0,lar,hau);
    
            ctx.fillStyle = "#D0D0D0";
            ctx.strokeStyle = "#808080";
            ctx.font = (Math.floor(48*zoom))+"px serif";
            
            //ctx.fillText("Hello world "+objets.length, 10*zoom, 50*zoom);
             
            // objet trouvé dans le viewport
            //         let bb={x:e.offsetX/this.zoom,y:e.offsetY/this.zoom,width:0,height:0};
            //         
            //         this.dessineTrouve(rs,this.zoom);
            nbObjDessines=0;
            if (objets!=null && objets.length>0) {
                    for (var i=0; (i<objets.length) ; i++) {
                        ctx.fillRect  ((objets[i].x-domRect.x)*zoom,(objets[i].y-domRect.y)*zoom,objets[i].width*zoom,objets[i].height*zoom);
                        ctx.strokeRect((objets[i].x-domRect.x)*zoom,(objets[i].y-domRect.y)*zoom,objets[i].width*zoom,objets[i].height*zoom);
                        nbObjDessines++;
                        //   for (var z=1; (z<200) && (drw_plan_cancel==false); z++) {
                        //       for (var xx=1; (xx<500) && (drw_plan_cancel==false); xx++) {
                        //   }
                        //   }
                    }
            }
            //console.log("finishen the job");

                      
             return ctx.getImageData(0,0,lar,hau);
             
        }
    }

    ____workerPrepare() {
        //console.log("preapring wrker");
        this.worker = new Worker(URL.createObjectURL(this.blob));
        

        this.worker.onmessage= (e)=> {

            //console.log('Message received from worker',e.data);
            
            if (e.data[0]=='hello') {
                //console.log("woerker respond hello!");
                //this.worker.terminate();
                //this.worker=null;
                return;
            }
            if (e.data[0]=='cancel') {
                console.log("CLIENT worked has cancelled treatùet");
                this.worker=null;
                return;
            }
            if (e.data[0]=='Draw') {
                
                this.worker.terminate();
                this.worker=null;
                //console.log("IMG finalized");
                
                 this.ctx2dBHR.putImageData(e.data[1],0,0);
                                 
                //     console.log("K");
                this.renderFinal();
               
                this.zoomBuffer=this.zoom;
                
                return;
            }
            if (e.data[0]=='Init') {
                console.log("WRK RET INIt");
                this.worker=null;
                //console.log("IMG finalized");
                this.ctx2dB1.putImageData(e.data[1],0,0);
                this.planReady=true;
                this.onReady();
                return;
            }
            if (e.data[0]=='Stop') {
                console.log("woerker respond stop!");
                //this.worker.terminate();
                //this.worker=null;
                return;
            }
            console.log("retour non traité");            
            
            
        };
        

        //this.worker.postMessage(["hello"]);
    }

    onReady() {

        this.dessineThread();
    }

    debugClear(cha) {
        this.domDbg.innerHTML='';
    }
    debug(cha) {
        this.domDbg.innerHTML=`<pre>${cha}</pre>`;
    }

    prepare() {
        // Buff
        // Quad Tree
        for (var i=0; i<this.objets.length; i++) {
            this.qt.insert(this.objets[i]);      
        }

        this.recentre();
        this.calculeViewPort();
        this.dessinePlanB1();
    }

    update() {
        this.ctx2d.clearRect(0,0,this.bounds.width,this.bounds.height);
        // copier le viewport de buffer dans bounds complet du canvas final utilisé pour affichage

        this.ctx2d.drawImage(this.canvasB1,this.viewPort.x,this.viewPort.y,this.viewPort.width,this.viewPort.height,
            0,0,this.bounds.width,this.bounds.height);


        
        
    }

    ____dessineOffLine2(datas) {
        dessineOffLine=function(datas) {
            
            let objets=datas[1];
            let domRect=datas[2];
            let zoom=datas[3];
            
            let lar=Math.floor(domRect.width*zoom);
            let hau=Math.floor(domRect.height*zoom);
            
            let offCan=document.createElement('canvas');
            let ctx=offCan.getContext('2d');
                        
            ctx.clearRect(0,0,lar,hau);
    
            ctx.fillStyle = "#D0D0D0";
            ctx.strokeStyle = "#808080";
            ctx.font = (Math.floor(48*zoom))+"px serif";
            
            //ctx.fillText("Hello world "+objets.length, 10*zoom, 50*zoom);
             
            // objet trouvé dans le viewport
            //         let bb={x:e.offsetX/this.zoom,y:e.offsetY/this.zoom,width:0,height:0};
            //         
            //         this.dessineTrouve(rs,this.zoom);
            nbObjDessines=0;
            if (objets!=null && objets.length>0) {
                    for (var i=0; (i<objets.length) ; i++) {
                        ctx.fillRect  ((objets[i].x-domRect.x)*zoom,(objets[i].y-domRect.y)*zoom,objets[i].width*zoom,objets[i].height*zoom);
                        ctx.strokeRect((objets[i].x-domRect.x)*zoom,(objets[i].y-domRect.y)*zoom,objets[i].width*zoom,objets[i].height*zoom);
                        nbObjDessines++;
                        //   for (var z=1; (z<200) && (drw_plan_cancel==false); z++) {
                        //       for (var xx=1; (xx<500) && (drw_plan_cancel==false); xx++) {
                        //   }
                        //   }
                    }
            }
            //console.log("finishen the job");

                      
             return ctx.getImageData(0,0,lar,hau);
             
        }
    
    }

    dessineXX(ctx,datas) {
        
        ctx.fillStyle='#FF0';
        ctx.fillRect(0,0,128,128);

        let objets=datas[1];
        let domRect=datas[2];
        let tzoom=datas[3];
        
        let lar=Math.floor(domRect.width*tzoom);
        let hau=Math.floor(domRect.height*tzoom);

        // console.log("dess lar="+lar);
        // console.log("dess lar="+hau);
                            
        ctx.clearRect(0,0,lar,hau);

        ctx.fillStyle = "#D0FFD0";
        ctx.strokeStyle = "#4080FF";
        ctx.font = (Math.floor(48*tzoom))+"px serif";
        
        
        if (objets!=null && objets.length>0) {
                for (var i=0; (i<objets.length) ; i++) {
                    ctx.fillRect  ((objets[i].x-domRect.x)*tzoom,(objets[i].y-domRect.y)*tzoom,objets[i].width*tzoom,objets[i].height*tzoom);
                    ctx.strokeRect((objets[i].x-domRect.x)*tzoom,(objets[i].y-domRect.y)*tzoom,objets[i].width*tzoom,objets[i].height*tzoom);
                }
        }
        //console.log("finishen the job");
        let ii=ctx.getImageData(0,0,lar,hau);
        return ii



    }
    
    workerC(datas) {
         //console.log('**Message received from main script');
            // console.log("**Datas worker datas=",datas);
            // console.log("**Datas commabd=",datas[0]);
            // console.log("**Datas worker obj len="+datas[1].length);
            // console.log("**Datas worker view=",datas[2]);
            // console.log("**Datas worker zoom=",datas[3]);
         
            return new Promise((resolve, reject) => {
                let c =  document.createElement('canvas');
                c.width=this.bounds.width;
                c.height=this.bounds.height;
                
                //c=document.createCanvas(512,512);
                if (c==null) {
                    reject(['Fail',null]);
                } else
                {
                    let ctx=c.getContext('2d');

                    setTimeout(() => {
                        let ret=this.dessineXX(ctx,datas);
                        //this.renderFinal();
                        resolve(['Draw',ret]);
                        
                      }, 0)
                    


                    

                }
            });

    }


    async dessinePlanB1() {
        try{
            const test1 = this.workerC(['Init',this.objets,this.boundsB1,1]);
            test1.then( (datas)=> {
                console.log('INT0:=',datas[0]);
                console.log('INT1:=',datas[1]);
                //this.ctx2dBHR.putImageData(datas[1],0,0);
                this.ctx2dB1.putImageData(datas[1],0,0);
                this.planReady=true;
                this.onReady();
                    //     console.log("K");
                    this.renderFinal();
            }
            );
            console.log('INit:',test1);
            
        }catch(err){
            console.log(err);
            alert(err);
        }
    }

    ___dessinePlanB1_OLD() {
        this.workerPrepare();
        console.log(" request init thread with zoom="+this.zoom,this.boundsB1);
        let qtObjs=this.qt.retrieve(this.viewPort);
        console.log("QtObs=",qtObjs);
        this.worker.postMessage(['Init',this.objets,this.boundsB1,1,qtObjs]);
    }
    
    dessineThread() {
        try{

        //let view=new DOMRect(0,0,this.bounds.width/this.zoom,this.bounds.height/this.zoom);
        //console.log(" request draw thread with zoom="+this.zoom,this.viewPort);
        let vport={
            x:this.viewPort.x,
            y:this.viewPort.y,
            width:this.viewPort.width,
            height:this.viewPort.height
        }

        let dats=['Draw',this.objets,vport,this.zoom];

        const test1 = this.workerC(dats);
            
            test1.then( (datas)=> {
                //console.log('DRA0:=',datas[0]); -->'Draw'
                //console.log('DRAW1:=',datas[1]); -->ImageData d'un ctx
                this.ctx2dBHR.putImageData(datas[1],0,0);
            

        //         this.ctx2dBHR.beginPath(); 
        //         this.ctx2dBHR.strokeStyle="#F0F";
        //         this.ctx2dBHR.lineWidth=4;
        // this.ctx2dBHR.moveTo(this.viewPort.x, 0); 
        // this.ctx2dBHR.lineTo (this.bounds.width,this.bounds.height);
        // this.ctx2dBHR.stroke();
        // this.ctx2dBHR.beginPath(); 
        // this.ctx2dBHR.moveTo(this.bounds.width, 0); 
        // this.ctx2dBHR.lineTo (0,this.bounds.height);
        // this.ctx2dBHR.stroke();
        setTimeout(() => {
            this.renderFinal();
            
          }, 1)
          
        
                
            }
            )
            //console.log('Draw:',test1);
        }catch(err){
            console.log(err);
            alert(err);
        }
    }

    ____dessineThread_OLD () {
      

        if (this.worker==null) {
            this.workerPrepare();
        } else {
            //this.worker.postMessage(['Stop']);
            this.worker.terminate();
            this.workerPrepare();
        }
        
        //let view=new DOMRect(0,0,this.bounds.width/this.zoom,this.bounds.height/this.zoom);
        //console.log(" request draw thread with zoom="+this.zoom,this.viewPort);
        let vport={
            x:this.viewPort.x,
            y:this.viewPort.y,
            width:this.viewPort.width,
            height:this.viewPort.height
        }
        
        //let qtObjs=this.qt.retrieve(this.viewPort);
        
        //let dats=['Draw',this.objets,vport,this.zoom,qtObjs];
        let dats=['Draw',this.objets,vport,this.zoom];
        //console.log("Dats=",dats);
        this.worker.postMessage(dats);

    }

    renderFinal() {
        this.ctx2d.clearRect(0,0,this.bounds.width,this.bounds.height);

        this.ctx2d.drawImage(this.canvasBHR,0,0,this.canvasBHR.width,this.canvasBHR.height,
                        0,0,this.bounds.width,this.bounds.height);

               
        this.renderQuad();
    }

    objetXY(x,y,tbNode) {
        if(tbNode==null) {
            return null;
        }
        for (let i=0; i<tbNode.length; i++) {
            if ( (y>=tbNode[i].y) && (y<tbNode[i].y+tbNode[i].height) && (x>=tbNode[i].x) && (x<tbNode[i].x+tbNode[i].width) ) {
                return tbNode[i];
          }

        }
        return null;
    }

    drawNode(node,zzoom)    {
        
        var bnounds =  node.bounds ;
        this.ctx2d.strokeRect(
                Math.floor(bnounds.x)*this.zoom-this.viewPort.x*this.zoom,
                Math.floor(bnounds.y)*this.zoom-this.viewPort.y*this.zoom,
                Math.floor(bnounds.width *this.zoom),
                Math.floor(bnounds.height*this.zoom)
            );
        
         for(var i = 0; i < node.nodes.length; i++)
         {
             this.drawNode(node.nodes[i],zzoom);
         }
        
    }

    renderQuad() {
        this.ctx2d.strokeStyle="#FF40FF";
        this.drawNode(this.qt);
    }

    dessineObjet(rs,fill,stroke) {
        
        this.ctx2d.fillStyle = stroke;
        this.ctx2d.fillStyle = fill;
        this.ctx2d.strokeStyle = stroke;
        let xshape=(rs.x-this.viewPort.x)*this.zoom;
        let yshape=(rs.y-this.viewPort.y)*this.zoom;
        let wshape=rs.width*this.zoom;
        let hshape=rs.height*this.zoom;
        this.ctx2d.fillRect  (xshape,yshape,wshape,hshape);
        this.ctx2d.strokeRect(xshape,yshape,wshape,hshape);
   }

    aim(x,y) {
        this.renderFinal();


        // objet trouvé en XY en rouge
        let xP=(x/this.zoom)+this.viewPort.x; 
        let yP=(y/this.zoom)+this.viewPort.y; 
               
        let bb={x:xP,y:yP,width:0,height:0};
        let rs=this.qt.retrieve(bb);
        this.dessineTrouve(rs);

        let ob=this.objetXY(xP,yP,rs);
       
         if (ob!=null) {
            
               this.dessineObjet(ob,"red","#400");
               //this.dessineObjet(ob,this.zoom);
        }
        this.ctx2d.strokeStyle = "#DD0";
        this.ctx2d.beginPath(); 
        this.ctx2dBHR.lineWidth=1;
        this.ctx2d.moveTo(0, y); 
        this.ctx2d.lineTo (this.bounds.width,y);
        this.ctx2d.stroke();
        this.ctx2d.beginPath(); 
        this.ctx2d.moveTo(x, 0); 
        this.ctx2d.lineTo (x,this.bounds.height);
        this.ctx2d.stroke();
    }

    dessineTrouve(rs,zzoom) {
        for (var i=0; i<rs.length; i++) {
            this.dessineObjet(rs[i],"blue","cyan");
        }
        this.renderQuad();

    }

    recentre() {
       this.zoom=this.bounds.width/this.boundsB1.width;
    //    console.log("eoom reccenre=",this.zoom);
    //    console.log("this.bounds",this.bounds);
    //    console.log("this.boundB1",this.boundsB1);
    //    console.log("zoom=",this.zoom);
       this.viewPort=new DOMRect(
        0,
        0,
        this.bounds.width*this.zoom,
        this.bounds.height*this.zoom
    );
    }

    calculeViewPort() {
        
        //console.log("ivew por=",this.viewPort);
        //console.log("ùzoom=",this.zoom);
        this.viewPort.width=this.bounds.width/this.zoom;
        this.viewPort.height=this.bounds.height/this.zoom;
        //console.log("new ivew por=",this.viewPort);
    }

    ezoom(newZoom) {
        this.zoom*=newZoom;
        // calculer new view port
        console.log("zoom ezoom"+this.zoom)
        this.calculeViewPort();
        this.update();
        this.dessineThread();
    }

    bouge(vect) {
        this.viewPort.x+= -(vect.x/this.zoom);
        this.viewPort.y+= -(vect.y/this.zoom);
        this.update();
        this.dessineThread();
    }
    setPosition(point){
        this.viewPort.x=point.x/this.zoom;
        this.viewPort.y=point.y/this.zoom;
        this.update();
        this.dessineThread();
    }
    getZoom(){
        return this.zoom;
    }
    getPosition(){
        return this.viewPort;
    }

}