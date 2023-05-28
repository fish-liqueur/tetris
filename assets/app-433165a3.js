var T=Object.defineProperty;var z=(o,e,t)=>e in o?T(o,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[e]=t;var h=(o,e,t)=>(z(o,typeof e!="symbol"?e+"":e,t),t);var u=(o=>(o.i="#ff2a6d",o.j="#ff415a",o.l="#05d9e8",o.o="#0485b8",o.s="#d255e0",o.t="#4cffb4",o.z="#ebe04d",o.uiYellow="#FCED5E",o.uiPink="#ff577d",o.empty="#ccc",o))(u||{});class I{constructor(e,t){h(this,"rootElement");h(this,"width");h(this,"height");h(this,"viewSizeConstants");h(this,"canvas");h(this,"context");h(this,"opacityFull",1);h(this,"blockColors",["none",u.i,u.j,u.l,u.o,u.s,u.t,u.z]);this.rootElement=document.getElementById(e);const s=this.rootElement.offsetWidth<650?this.rootElement.offsetWidth:650;this.width=this.height=s,this.viewSizeConstants=this.getSizeConstants(s,t),this.canvas=document.createElement("canvas"),this.canvas.width=this.width,this.canvas.height=this.height,this.context=this.canvas.getContext("2d"),this.rootElement.appendChild(this.canvas)}getSizeConstants(e,t){const i=e/2*.02;return{width:e,height:e,relativeUnit:Math.round(e*.05),borderWidth:i,blockSide:(e/2-i*2)/t}}renderGame(e){const{board:t,gameSizeInBlocks:i,pause:s,started:n,lost:c}=e,f=s||!n||c;this.opacityFull=f?.5:1,this.clearView(),this.renderGameBoard(t,i),this.renderInfoBoard(e),f&&this.renderOverlay(e)}clearView(){this.context.clearRect(0,0,this.width,this.height)}renderGameBoard(e,t){const i=this.context,s=this.viewSizeConstants.width/2,n=this.viewSizeConstants.height-this.viewSizeConstants.borderWidth*2,{blockSide:c,borderWidth:f}=this.viewSizeConstants;i.globalAlpha=this.opacityFull,i.fillStyle="rgba(100, 100, 100, 0.2)",i.fillRect(0,0,s,n),i.lineWidth=this.viewSizeConstants.borderWidth,i.strokeStyle=u.uiPink,i.strokeRect(this.viewSizeConstants.borderWidth/2,this.viewSizeConstants.borderWidth/2,s-this.viewSizeConstants.borderWidth,n-this.viewSizeConstants.borderWidth);for(let d=0;d<t.height;d++)for(let l=0;l<t.width;l++)this.renderBlock({block:e[d][l],xInBlocks:l,yInBlocks:d,topX:c*.05+f,topY:c*.05+f})}renderInfoBoard(e){const{speed:t,speedChanged:i,score:s,scoreChanged:n,lines:c,linesChanged:f,nextPiece:d}=e,l=this.context,r=this.viewSizeConstants.width/2+this.viewSizeConstants.blockSide,{relativeUnit:a}=this.viewSizeConstants,w=this.wrapPieceWithEmptyBlocks(d),S=w.length,m=w[0].length;l.globalAlpha=this.opacityFull,l.textAlign="start",l.textBaseline="top",l.fillStyle=u.uiYellow,l.font=`normal ${.8*a}px VT323`,l.fillText(`Speed: ${t}`,r,a),i&&(l.fillStyle=u.uiPink,l.fillText(`+${i}`,r+2.5*a+t.toString().length*.3*a,a),l.fillStyle=u.uiYellow),l.fillText(`Score: ${s}`,r,a*2),n&&(l.fillStyle=u.uiPink,l.fillText(`+${n}`,r+2.5*a+s.toString().length*.3*a,a*2),l.fillStyle=u.uiYellow),l.fillText(`Lines: ${c}`,r,a*3),f&&(l.fillStyle=u.uiPink,l.fillText(`+${f}`,r+2.5*a+c.toString().length*.3*a,a*3),l.fillStyle=u.uiYellow),l.fillText("Next piece:",r,a*4),l.fillStyle="rgba(100, 100, 100, 0.2)",l.fillRect(r,a*5,m*this.viewSizeConstants.blockSide+this.viewSizeConstants.borderWidth,S*this.viewSizeConstants.blockSide+this.viewSizeConstants.borderWidth),l.lineWidth=this.viewSizeConstants.borderWidth/2,l.strokeStyle=u.uiPink,l.strokeRect(r-this.viewSizeConstants.borderWidth/4,a*5-this.viewSizeConstants.borderWidth/4,m*this.viewSizeConstants.blockSide+this.viewSizeConstants.borderWidth/2,S*this.viewSizeConstants.blockSide+this.viewSizeConstants.borderWidth/2);for(let v=0;v<S;v++)for(let p=0;p<m;p++)this.renderBlock({block:w[v][p],xInBlocks:p,yInBlocks:v,topX:r,topY:a*5})}renderBlock(e){const{block:t,xInBlocks:i,yInBlocks:s,topX:n,topY:c}=e,f=this.context,{blockSide:d}=this.viewSizeConstants;t?(f.globalAlpha=this.opacityFull,f.fillStyle=this.blockColors[t],f.fillRect(n+d*i,c+d*s,d*.9,d*.9)):(f.globalAlpha=.2,f.lineWidth=1,f.strokeStyle=u.empty,f.strokeRect(n+d*i,c+d*s,d*.9,d*.9))}renderOverlay(e){const{speed:t,score:i,lines:s,started:n,lost:c}=e,{relativeUnit:f,width:d,blockSide:l}=this.viewSizeConstants,r=this.context,a=d/2+l;r.globalAlpha=1,r.font=`${.8*f}px VT323`,r.textAlign="left",r.textBaseline="middle",r.fillStyle=u.uiYellow,n?c?(r.fillText("What a game!",a,d/2+f),r.fillStyle=u.uiPink,r.fillText("And by the numbers:",a,d/2+3*f),r.fillText(`🏆 score: ${i}`,a,d/2+4*f),r.fillText(`🧨 lines destroyed: ${s}`,a,d/2+5*f),r.fillText(`🔥 highest speed: ${t}`,a,d/2+6*f),r.fillStyle=u.uiYellow,r.fillText("Press Space to restart",a,d/2+8*f)):(r.fillText("Game paused",a,d/2+f),r.fillText("Press Space to resume",a,d/2+2*f)):(r.fillText("Press Space",a,d/2+f),r.fillText("to start the game!",a,d/2+2*f))}wrapPieceWithEmptyBlocks(e){const{figure:t}=e,{addLeft:i,addRight:s,addTop:n,addBottom:c,removeBottom:f}=t.reduce((r,a,w)=>{var S;if(w===0&&(r.addTop=a.some(m=>m!==0)),a[0]&&(r.addLeft=!0),a[a.length-1]&&(r.addRight=!0),w===e.height-1){const m=a.some(p=>p!==0),v=(S=t[e.height-2])==null?void 0:S.some(p=>p!==0);m?r.addBottom=!0:v||(r.removeBottom=!0)}return r},{addLeft:!1,addRight:!1,addTop:!1,addBottom:!1,removeBottom:!1}),d=i||s,l=n||c;if(d)for(const r of t)i&&r.unshift(0),s&&r.push(0);if(l){const a=this.getFigureString(t[0].length,0);n&&t.unshift(a),c&&t.push(a)}return f&&t.splice(e.height-1,1),t}getFigureString(e,t){const i=[];for(let s=0;s<e;s++)i.push(t);return i}}function C(o,e,t){const i=t.value;return{configurable:!0,get(){return i.bind(this)}}}var W=Object.defineProperty,R=Object.getOwnPropertyDescriptor,E=(o,e,t,i)=>{for(var s=i>1?void 0:i?R(e,t):e,n=o.length-1,c;n>=0;n--)(c=o[n])&&(s=(i?c(e,t,s):c(s))||s);return i&&s&&W(e,t,s),s};class k{constructor(e){h(this,"model");this.model=e,document.addEventListener("keydown",this.handleKeyDown)}handleKeyDown(e){switch(e.code){case"Space":this.model.handlePressSpace();break;case"ArrowLeft":this.model.handleNewTurn("left");break;case"ArrowUp":this.model.handleNewTurn("rotate");break;case"ArrowRight":this.model.handleNewTurn("right");break;case"ArrowDown":this.model.handleNewTurn("down");break}}}E([C],k.prototype,"handleKeyDown",1);function B(o){return JSON.parse(JSON.stringify(o))}function y(o){const e=new o.constructor;return Object.assign(e,o),e}class g{constructor(e){h(this,"y",-1);h(this,"x");h(this,"type");h(this,"figure");h(this,"fieldWidth");const i="ijlostz"[Math.floor(Math.random()*7)],s={i:[[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],j:[[0,0,0],[2,2,2],[0,0,2]],l:[[0,0,0],[3,3,3],[3,0,0]],o:[[0,0,0,0],[0,4,4,0],[0,4,4,0],[0,0,0,0]],s:[[0,0,0],[0,5,5],[5,5,0]],t:[[0,0,0],[6,6,6],[0,6,0]],z:[[0,0,0],[7,7,0],[0,7,7]]};this.fieldWidth=e,this.figure=s[i],this.type=i,this.x=Math.floor((e-this.figure[0].length)/2)}get width(){return this.figure[0].length}get height(){return this.figure.length}moveLeft(){this.x--}moveRight(){this.x++}moveDown(){this.y++}rotate(e=!0){const t=B(this.figure);e?this.figure=t[0].map((i,s)=>t.map(n=>n[s]).reverse()):this.figure=t[0].map((i,s)=>t.map(n=>n[n.length-1-s]))}}class P{constructor(e,t){h(this,"width");h(this,"height");h(this,"matrix");if(typeof e=="number"&&typeof t=="number"||!e){this.width=e||10,this.height=t||20;let i=[];for(let s=0;s<this.height;s++){const n=[];for(let c=0;c<this.width;c++)n.push(0);i.push(n)}this.matrix=i}else if(typeof e=="object"&&e[0])this.matrix=e,this.width=this.matrix[0].length,this.height=this.matrix.length;else throw new Error("Wrong params!")}deleteFilledRows(){const e=this.matrix.filter(i=>i.some(s=>s===0)),t=this.height-e.length;for(let i=0;i<t;i++)e.unshift(this.createEmptyRow());return this.matrix=e,t}addPieceToMatrix(e){this.matrix=x.mergePieceToBoard(this,e)}createEmptyRow(){const e=[];for(let t=0;t<this.width;t++)e.push(0);return e}}var _=Object.defineProperty,D=Object.getOwnPropertyDescriptor,N=(o,e,t,i)=>{for(var s=i>1?void 0:i?D(e,t):e,n=o.length-1,c;n>=0;n--)(c=o[n])&&(s=(i?c(e,t,s):c(s))||s);return i&&s&&_(e,t,s),s};const b=class{constructor(o,e){h(this,"view");h(this,"started");h(this,"pause");h(this,"lost",!1);h(this,"speed",0);h(this,"speedChanged",0);h(this,"score",0);h(this,"scoreChanged",0);h(this,"lines",0);h(this,"linesChanged",0);h(this,"interval");h(this,"gameSizeInBlocks");h(this,"gameBoardStatic");h(this,"currentPiece");h(this,"nextPiece");this.view=o,this.started=!1,this.pause=!0,this.interval=null,this.gameSizeInBlocks=e,this.gameBoardStatic=new P(this.gameSizeInBlocks.width,this.gameSizeInBlocks.height),this.currentPiece=new g(this.gameSizeInBlocks.width),this.nextPiece=new g(this.gameSizeInBlocks.width),this.view.renderGame(this.getState)}get getState(){return{speed:this.speed,speedChanged:this.speedChanged,score:this.score,scoreChanged:this.scoreChanged,lines:this.lines,linesChanged:this.linesChanged,board:b.mergePieceToBoard(this.gameBoardStatic,this.currentPiece),nextPiece:this.nextPiece,started:this.started,pause:this.pause,lost:this.lost,gameSizeInBlocks:this.gameSizeInBlocks}}startTimer(){const o=1e3-this.speed*100;this.pause=!1,this.view.renderGame(this.getState),this.interval||(this.interval=setInterval(this.handleNewTurn,o>0?o:100))}stopTimer(){this.interval&&(this.pause=!0,clearInterval(this.interval),this.interval=null),this.view.renderGame(this.getState)}handlePressSpace(){this.started?this.lost?this.resetGame():this.interval?this.stopTimer():this.startTimer():(this.started=!0,this.startTimer())}handleNewTurn(o){if(!(this.pause||this.lost)){if(o){let e;switch(o){case"left":e=this.handleIfPossible([[g.prototype.moveLeft]]);break;case"right":e=this.handleIfPossible([[g.prototype.moveRight]]);break;case"down":e=this.handleIfPossible([[g.prototype.moveDown]]);break;case"rotate":e=this.rotateCurrentPiece();break;default:e=!1}if(!e)return;o==="down"&&(this.scoreChanged=this.speed+1,this.score+=this.scoreChanged)}else{const e=this.handleIfPossible([[g.prototype.moveDown]]);if(!e&&this.currentPiece.y<0){this.lost=!0,this.view.renderGame(this.getState);return}e||(this.gameBoardStatic.addPieceToMatrix(this.currentPiece),this.updatePieces());const t=this.gameBoardStatic.deleteFilledRows();let i;if(this.lines+=t,this.linesChanged=t,this.scoreChanged=t?b.getScoreMultiplier(t)*(this.speed+1):0,this.score+=this.scoreChanged,i=Math.floor(this.lines/10),this.speedChanged=i-this.speed,this.speed=i,this.speedChanged){this.stopTimer(),this.startTimer();return}}this.view.renderGame(this.getState)}}rotateCurrentPiece(){const o=this.currentPiece.x<0?[[g.prototype.rotate],[g.prototype.moveRight,g.prototype.rotate],[g.prototype.moveRight,g.prototype.moveRight,g.prototype.rotate]]:this.currentPiece.x+this.currentPiece.width>this.gameBoardStatic.width?[[g.prototype.rotate],[g.prototype.moveLeft,g.prototype.rotate],[g.prototype.moveLeft,g.prototype.moveLeft,g.prototype.rotate]]:[[g.prototype.rotate]];return this.handleIfPossible(o)}handleIfPossible(o){for(let e=0;e<o.length;e++){const t=y(this.gameBoardStatic),i=y(this.currentPiece);if(o[e].forEach(s=>{s.call(i)}),!b.hasCollision(t,i))return o[e].forEach(s=>{s.call(this.currentPiece)}),!0}return!1}updatePieces(){this.currentPiece=this.nextPiece,this.nextPiece=new g(this.gameSizeInBlocks.width)}resetGame(){this.stopTimer(),this.lost=!1,this.started=!0,this.gameBoardStatic=new P(this.gameSizeInBlocks.width,this.gameSizeInBlocks.height),this.currentPiece=new g(this.gameSizeInBlocks.width),this.nextPiece=new g(this.gameSizeInBlocks.width),this.speed=0,this.speedChanged=0,this.score=0,this.scoreChanged=0,this.lines=0,this.linesChanged=0,this.startTimer()}static mergePieceToBoard(o,e){const{figure:t,y:i,x:s}=e,n=e.height,c=e.width,f=B(o.matrix);for(let d=0;d<n;d++)for(let l=0;l<c;l++){const r=t[d][l];r!==0&&(f[d+i][l+s]=r)}return f}static hasCollision(o,e){const{figure:t,y:i,x:s}=e;for(let n=0;n<e.height;n++)for(let c=0;c<e.width;c++)if(t[n][c]&&(!o.matrix[n+i]||o.matrix[n+i][c+s]===void 0||o.matrix[n+i][c+s]))return!0;return!1}static getScoreMultiplier(o){return[40,100,300,1200][o-1]||1}};let x=b;N([C],x.prototype,"handleNewTurn",1);class M{constructor(){h(this,"model");h(this,"view");h(this,"controller");h(this,"width",10);h(this,"height",20);const{height:e,width:t}=this;this.view=new I("game",t),this.model=new x(this.view,{height:e,width:t}),this.controller=new k(this.model)}}new M;