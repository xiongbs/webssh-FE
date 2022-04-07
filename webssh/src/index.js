// console.log('Hello World from your main file!');
// import 'xterm/css/xterm.css';
// import initTerminal from './app/terminal'

import '../asset/css/player.css';
import('../asset/css/main.css');

// window.onload = function () {
//     let urlParams = new URLSearchParams(window.location.search);
//     if (urlParams.has('client')) {
//         import('xterm/css/xterm.css');
//         import('./app/terminal').then(terminal => {
//             let initTerminal = terminal.default;
//             initTerminal('terminal');
//              console.log(initTerminal);
//         });
//         let player = document.getElementById('asciinema-player');
//         player.remove();
//     } else {
//         let address = urlParams.get('address');
//         address = window.atob(address);
//         let player = document.getElementById('asciinema-player');
//         // let playerScript = document.getElementById('asciinema-player-script');
//         // playerScript.onload = function () {
           
//         // }
//         player.setAttribute('class', './ignored/2.cast');
//         player.addEventListener('loadedmetadata', function(e) {
//             console.log(this.duration);
//         })
        
//     }
// }
document.addEventListener('DOMContentLoaded',function(){
   
    let urlParams = new URLSearchParams(window.location.search);
    let {origin} = location;
    let urlObj = {
        filemanagerUrl: '',
        websshUrlSearch: ''
    };
    try {
        var configObj = JSON.parse(window.atob(urlParams.get('config')));
        var fileManagerUrl = configObj.file_manager_link_url;
        urlObj.filemanagerUrl = fileManagerUrl;
        urlObj.websshUrlSearch = `${configObj.link_url.replace('terminal.html',
                '')}`;
    } catch (e) {
        console.log(e);
    }
    
    let bannerDom = document.getElementById('banner');
    let fileManagerLinkDom = document.getElementById('file-manager-link');
    if (fileManagerLinkDom) {
        if (urlObj.filemanagerUrl) {
            fileManagerLinkDom.addEventListener('click', function() {
                window.open(`${origin}/filemanager?config=${urlParams.get('config')}`, '_blank');
            })
        } else {
            bannerDom.remove();
        }
    }

    try {
        let uiSetting;
        for(let k of Object.keys(sessionStorage)) {
            if (/.*uiSetting$/.test(k)) {
                uiSetting = sessionStorage.getItem(k);
            }
        }

        if(uiSetting) {
            uiSetting = JSON.parse(uiSetting);
            if (uiSetting.faviconId) {
                setFavicon(uiSetting.faviconId);
            }
        }
    } catch (error) {
        console.log('uiSettings_Error:', error);
    }


   

    if (urlObj.websshUrlSearch) {
        import('xterm/css/xterm.css');
        import('./app/terminal').then(terminal => {
            let initTerminal = terminal.default;
            initTerminal('terminal', new URLSearchParams(urlObj.websshUrlSearch));
             console.log(initTerminal);
        });
        let player = document.getElementById('asciinema-player');
        player.remove();
    } else {
        let bannerDom = document.getElementById('banner');
        if (bannerDom) {
            bannerDom.remove();
        }
        let address = urlParams.get('address');
        address = window.atob(address);
        let player = document.getElementById('asciinema-player');
        // let playerScript = document.getElementById('asciinema-player-script');
        // playerScript.onload = function () {
           
        // }
        player.setAttribute('src', address);
        player.addEventListener('loadedmetadata', function(e) {
            console.log(this.duration);
        })
        
    }
})


function setFavicon(faviconId) {
    // 设置浏览器图标
    let oldLink = document.getElementById('favicon');
    if (oldLink) {
        document.head.removeChild(oldLink);
    }
    let link = document.createElement('link');
    link.id = 'favicon';
    link.type = 'image/x-icon';
    link.rel = 'icon';
    if (faviconId) {
        const faviconUrl = 'tenants/ui-setting/:id/icon'.replace(':id', faviconId);
        link.href = `${window.CONSTANTS.BASE_URL}${faviconUrl}`;
    } else {
        link.href = `src/favicon.ico`;
    }
    document.getElementsByTagName('head')[0].appendChild(link);
}