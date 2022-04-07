import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
let MaxTimeout = 30 * 1000
let templateSchema = '192.168.2.142';
let parsedUrl = new URL(location.href);



function message(type, data) {
    return JSON.stringify({
        operate: type,
        command: data,
    });

    return JSON.stringify({
        "operate": "command",
        command: data 
    })

}

function handleError(reason) {
    console.log(reason);
}

function initTerminal(elementId, urlParams) {
    let bannerDom = document.getElementById('banner');
    let terminalHeight = (window.innerHeight - 16) + 'px'
    if(bannerDom) {
        terminalHeight = (window.innerHeight - 34 - 16) + 'px'
    }
    let scheme = document.location.protocol == "https:" ? "wss" : "ws";
    let port = document.location.port ? ":" + document.location.port : "";
    let baseWsUrl = scheme + "://" + document.location.hostname + port;
    let pingInterval;
    let resizeTimer;
    let term, fitAddon;
    let lastSendTime;
    let lastReceiveTime;
    let initialed;
    let ws;
    let terminalId = "";
    let termSelection = "";
    let connectionID = '';
    let wsURL = '';
    wsURL = urlParams.get('client');
    connectionID = urlParams.get('connectionID');

    // debug wsURL | connectionID
    // wsURL = 'wss://192.168.86.60/listener1-ws/webssh';
    // connectionID = 'bf9af512-db86-4d75-ab9c-eaac6f7c3852';
    if (!wsURL || !connectionID) {
        console.error('no client url', wsURL);
        return;
    }
    ws = new window.WebSocket(wsURL);
    let termAndFitAddon = createTerminalById(ws, elementId, terminalHeight);
    term = termAndFitAddon.term;
    fitAddon = termAndFitAddon.fitAddon;

    function resizeTerminal() {
        // 延迟调整窗口大小
        if (resizeTimer != null) {
            clearTimeout(resizeTimer);
        }

        window.requestAnimationFrame(function () {
            const termRef = document.getElementById('terminal')
            termRef.style.height = terminalHeight;
            fitAddon.fit();
            term.focus();
            let cols = term.cols;
            let rows = term.rows;
            if (initialed == null || ws == null) {
                return
            }
            ws.send(message('TERMINAL_RESIZE',
                JSON.stringify({cols, rows})));
        });

    }

    function dispatch(term, data) {
        if (data === undefined) {
            return
        }
    
        let msg = JSON.parse(data)
        switch (msg.type) {
            case 'pre_connect_date':
                terminalId = msg.id;
                fitAddon.fit();
                let cols = term.cols;
                let rows = term.rows;
                ws.send(JSON.stringify({
                    operate: 'connect',
                    connectionID: connectionID,
                    width: cols,
                    height: rows
                }));
                initialed = true;
                term.write(msg.message);
                break
            // case "CLOSE":
            //     term.writeln("Connection closed");
            //     fireEvent(new Event("CLOSE", {}))
            //     break
            // case "PING":
            //     break
            case 'terminal_data':
            case 'fobbiden_data':
                term.write(msg.message);
                break
            default:
                console.log(data)
        }
    }

    window.SendTerminalData = function (data) {
        if (ws.readyState === WebSocket.CLOSING ||
            ws.readyState === WebSocket.CLOSED) {
            return
        }
        ws.send(message(terminalId, 'TERMINAL_DATA', data));
    }

    window.addEventListener('resize', resizeTerminal);

    let quickPaste = getQuickPaste();
    let terminalContext = document.getElementById(elementId);
    terminalContext.addEventListener('contextmenu', function ($event) {
        if ($event.ctrlKey || quickPaste !== '1') {
            return;
        }
        if (navigator.clipboard && navigator.clipboard.readText) {
            navigator.clipboard.readText().then((text) => {
                ws.send(message('command', text))
            })
            $event.preventDefault();
        } else if (termSelection !== "") {
            ws.send(message('command', termSelection))
            $event.preventDefault();
        }
    })

    
    // term.onSelectionChange = () => {
    //     document.execCommand('copy');
    //     // this ==> term object
    //     termSelection = this.getSelection().trim();
    // }

    ws.onopen = () => {
        // if (pingInterval !== null) {
        //     clearInterval(pingInterval);
        // }

        window.requestAnimationFrame(function () {
            const termRef = document.getElementById('terminal')
            termRef.style.height = terminalHeight;
            let cols = 80;
            let rows = 24;
            if (term) {
                fitAddon.fit();
                term.focus();
                cols = term.cols;
                rows = term.rows;
            }
           
            
            if (ws == null) {
                return
            }
            
            // ws.send(JSON.stringify({
            //     operate: 'connect',
            //     connectionID: connectionID,
            //     width: cols,
            //     height: rows
            // }));

            ws.send(JSON.stringify({
                operate: 'pre_connect',
                connectionID: connectionID
            }));
        });
       
        //  lastReceiveTime = new Date();
        //  pingInterval = setInterval(function () {
        //     if (ws.readyState === WebSocket.CLOSING ||
        //         ws.readyState === WebSocket.CLOSED) {
        //         clearInterval(pingInterval)
        //         return
        //     }
        //     let currentDate = new Date();
        //     if ((lastReceiveTime - currentDate) > MaxTimeout) {
        //         console.log("more than 30s do not receive data")
        //     }
        //     let pingTimeout = (currentDate - lastSendTime) - MaxTimeout
        //     if (pingTimeout < 0) {
        //         return;
        //     }
        //     ws.send(message(terminalId, 'PING', ""));
        // }, 25 * 1000);
    }
    ws.onerror = (e) => {
        term.writeln("Connection error");
        fireEvent(new Event("CLOSE", {}))
        handleError(e)
    }
    ws.onclose = (e) => {
        term.writeln("Connection closed");
        fireEvent(new Event("CLOSE", {}))
        handleError(e)
    }
    ws.onmessage = (e) => {
        lastReceiveTime = new Date();
        dispatch(term, e.data);
    }

    term.onData((data, arg2) => {
        console.log(arg2);
        if (ws === null) {
            return
        }
        lastSendTime = new Date();
        ws.send(message('command', data));
    })
}



function createTerminalById(ws, elementId, terminalHeight) {
    let fontSize = getFontSize();
    const termRef = document.getElementById('terminal')
    termRef.style.height = terminalHeight;
    const ua = navigator.userAgent.toLowerCase();
    let lineHeight = 1;
    if (ua.indexOf('windows') !== -1) {
        lineHeight = 1.2;
    }
    let term = new Terminal({
        rendererType: "canvas", //渲染类型
        //   scrollback: 50, //终端中的回滚量
        disableStdin: false, //是否应禁用输入。
        cursorBlink: true, //光标闪烁
        theme: {
        //   foreground: "#7e9192", //字体
          foreground: '#ffffff',
          background: "#002833", //背景色
          cursor: "help", //设置光标,
          lineHeight: 16
        },
        fontFamily: 'monaco, Consolas, "Lucida Console", monospace',
        lineHeight: 1.2,
        fontSize: fontSize,
        rightClickSelectsWord: true
    });
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(document.getElementById(elementId));
    fitAddon.fit();
    term.focus();
    let cols = term.cols;
    let rows = term.rows;
    // term.attachCustomKeyEventHandler(function (e) {
    //     if (e.ctrlKey && e.key === 'c' && term.hasSelection()) {
    //         return false;
    //     }
    //     return !(e.ctrlKey && e.key === 'v');
    // });
    return {term: term, fitAddon: fitAddon}
}

function fireEvent(e) {
    window.dispatchEvent(e)
}

function getFontSize() {
    let fontSize = 16
    // localStorage.getItem default null
    let localSettings = localStorage.getItem('LunaSetting')
    if (localSettings !== null) {
        let settings = JSON.parse(localSettings)
        fontSize = settings['fontSize']
    }
    if (!fontSize || fontSize < 5 || fontSize > 50) {
        fontSize = 13;
    }
    return fontSize
}

function getQuickPaste() {
    let quickPaste = "0"
    let localSettings = localStorage.getItem('LunaSetting')
    if (localSettings !== null) {
        let settings = JSON.parse(localSettings)
        quickPaste = settings['quickPaste']
    }
    return quickPaste
}

export default initTerminal;