(self.webpackChunkWebssh=self.webpackChunkWebssh||[]).push([[1],[,(e,n,t)=>{"use strict";t.r(n),t.d(n,{default:()=>l});var o=t(320),i=t(617);function r(e,n){return JSON.stringify({operate:e,command:n})}function a(e){console.log(e)}function c(e){window.dispatchEvent(e)}console.log("dqwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww"),new URL(location.href);const l=function(e,n){var t=document.getElementById("banner"),l=window.innerHeight-16+"px";t&&(l=window.innerHeight-34-16+"px"),document.location.protocol,document.location.port&&document.location.port;var d,s,w,u,f,m,g=(document.location.hostname,"");if(m=n.get("client"),f=n.get("connectionID"),m&&f){u=new window.WebSocket(m);var p=function(e,n,t){var r=function(){var e=16,n=localStorage.getItem("LunaSetting");return null!==n&&(e=JSON.parse(n).fontSize),(!e||e<5||e>50)&&(e=13),e}();document.getElementById("terminal").style.height=t,navigator.userAgent.toLowerCase().indexOf("windows");var a=new o.Terminal({rendererType:"canvas",disableStdin:!1,cursorBlink:!0,theme:{foreground:"#ffffff",background:"#002833",cursor:"help",lineHeight:16},fontFamily:'monaco, Consolas, "Lucida Console", monospace',lineHeight:1.2,fontSize:r,rightClickSelectsWord:!0}),c=new i.FitAddon;return a.loadAddon(c),a.open(document.getElementById(n)),c.fit(),a.focus(),a.cols,a.rows,{term:a,fitAddon:c}}(0,e,l);d=p.term,s=p.fitAddon,window.SendTerminalData=function(e){u.readyState!==WebSocket.CLOSING&&u.readyState!==WebSocket.CLOSED&&u.send(r(g,"TERMINAL_DATA"))},window.addEventListener("resize",(function(){window.requestAnimationFrame((function(){document.getElementById("terminal").style.height=l,s.fit(),d.focus();var e=d.cols,n=d.rows;null!=w&&null!=u&&u.send(r("TERMINAL_RESIZE",JSON.stringify({cols:e,rows:n})))}))}));var h=function(){var e="0",n=localStorage.getItem("LunaSetting");return null!==n&&(e=JSON.parse(n).quickPaste),e}();document.getElementById(e).addEventListener("contextmenu",(function(e){e.ctrlKey||"1"!==h||navigator.clipboard&&navigator.clipboard.readText&&(navigator.clipboard.readText().then((function(e){u.send(r("command",e))})),e.preventDefault())})),u.onopen=function(){window.requestAnimationFrame((function(){document.getElementById("terminal").style.height=l,d&&(s.fit(),d.focus(),d.cols,d.rows),null!=u&&u.send(JSON.stringify({operate:"pre_connect",connectionID:f}))}))},u.onerror=function(e){d.writeln("Connection error"),c(new Event("CLOSE",{})),a(e)},u.onclose=function(e){d.writeln("Connection closed"),c(new Event("CLOSE",{})),a(e)},u.onmessage=function(e){new Date,function(e,n){if(void 0!==n){var t=JSON.parse(n);switch(t.type){case"pre_connect_date":g=t.id,s.fit();var o=e.cols,i=e.rows;u.send(JSON.stringify({operate:"connect",connectionID:f,width:o,height:i})),w=!0,e.write(t.message);break;case"terminal_data":case"fobbiden_data":e.write(t.message);break;default:console.log(n)}}}(d,e.data)},d.onData((function(e,n){console.log(n),null!==u&&(new Date,u.send(r("command",e)))}))}else console.error("no client url",m)}}]]);