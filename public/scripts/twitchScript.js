    // ==UserScript==
    // @name         New Userscript
    // @namespace    http://tampermonkey.net/
    // @version      0.1    
    // @description  try to take over the world!
    // @author       You
    // @match        https://www.twitch.tv/*
    // @icon         https://www.google.com/s2/favicons?domain=twitch.tv
    // @require      http://code.jquery.com/jquery-3.4.1.min.js
    // @grant        none
    // ==/UserScript==

    /*

    ---------------------------------------

    // ==UserScript==
    // @name         New Userscript
    // @namespace    http://tampermonkey.net/
    // @version      0.1
    // @description  try to take over the world!
    // @author       You
    // @match        https://www.twitch.tv/*
    // @icon         https://www.google.com/s2/favicons?domain=twitch.tv
    // @require      http://code.jquery.com/jquery-3.4.1.min.js
    // @grant        none
    // ==/UserScript==

    (function() {
        var script = document.createElement('script');
        script.onload = function () {

            window['TwitchScript'].init();

        };
        script.src = 'http://localhost:3000/twitchScript.js';

        document.head.appendChild(script);
    })();

    ---------------------------------------

    */

    function waitForSelector(selector) {
        return new Promise((resolve) => {
            const startedAt = Date.now();

            const tryFind = () => {
                const j = $(selector);
                if(j.length > 0) {
                    resolve(j);   
                    return;             
                }

                if(Date.now() >= startedAt + 5000) {
                    resolve(undefined);
                    return;
                }

                setTimeout(() => tryFind(), 100);
            }
            tryFind();
        });
    }

    class Message {
        user = undefined
        content = ""
    }

    class User {
        username = ""
        messages = []
    }

    function setNativeValue(element, value) {
        let lastValue = element.value;
        element.value = value;
        let event = new Event("input", { target: element, bubbles: true });
        // React 15
        event.simulated = true;
        // React 16
        let tracker = element._valueTracker;
        if (tracker) {
            tracker.setValue(lastValue);
        }
        element.dispatchEvent(event);
    }

    window['setNativeValue'] = setNativeValue;

    class TwitchScript {
        static users = new Map();

        static _lastMessageElement = undefined;
        static _lastMessageElementIndex = -1;
        static _lastAmountMessages = -1;

        static _receiveMessageCallbacks = [];

        static _musicName = undefined;
        
        static _initialized = false;

        static async init() {
            const self = this;

            if(this._initialized) return;
            this._initialized = true;

            
            console.log("init")

            await this.initMusicListener();

            setInterval(() => self.findMessages(), 100);

        }

        static async initMusicListener() {
            const self = this;

            const sendButton = await waitForSelector(`[data-a-target="chat-send-button"]`);
            sendButton[0].onclick = function() {
                const value = chatInput[0].value;
                self.processSendMessage(value);
            }

            const chatInput = await waitForSelector(`[data-a-target="chat-input"]`);
            chatInput[0].addEventListener('keydown', (e) => {
                if(e.keyCode == 13) {
                    const value = chatInput[0].value;
                    self.processSendMessage(value);
                }
            });

            self.onReceiveMessage((message) => {
                const text = message.content.replaceAll("ú", "u");

                if(text.includes("musica?") && text.includes("qual")) {
                    if(self._musicName != undefined) {
                        self.sendMessage(`@${message.user.username} ${self._musicName}`);
                    }
                }
            })
        }

        static processSendMessage(text) {
            console.log(`SENT: %c%s`, "color: green", text);

            this.processMusicCommand(text);
        }

        static processMusicCommand(text) {
            var command = `/music`;
            //var text = `   /music 124g 12 dd`

            if(text.includes("/music")) {

                var music = text.slice(text.indexOf(command) + command.length + 1);

                if(music.length < 5) {
                    this._musicName = undefined;
                } else {
                    this._musicName = music;
                }

                console.log(`Music set to: %c%s`, "color: green", this._musicName);
                alert(`Music set to ${this._musicName}`)

            }
        }
        

        static sendMessage(text) {
            setNativeValue($(`[data-a-target="chat-input"]`)[0], text);
            $(`[data-a-target="chat-send-button"]`)[0].click()
        }

        static onReceiveMessage(fn) {
            this._receiveMessageCallbacks.push(fn);
        }

        static processNewMessage(message) {
            console.log(`%c%s: %c%s`, "color: red", message.user.username, "color: blue", message.content);

            for (const fn of this._receiveMessageCallbacks) {
                fn(message);
            }
        }

        static findMessages() {
            const self = TwitchScript;

            const elements = [];
            $(".chat-scrollable-area__message-container .chat-line__message").each(function(index, element) {
                elements.push(element);
            });

            const indexDiff = this._lastMessageElementIndex - elements.indexOf(this._lastMessageElement);

            const lengthDiff = elements.length - this._lastAmountMessages;
            const startAt = elements.length - (lengthDiff + indexDiff);

            for (const element of elements) {
                if(elements.indexOf(element) < startAt) continue;
                if(!$(element).find('span[data-test-selector="chat-line-message-body"]')[0]) continue;

                const username = $(element).find('.chat-line__username-container')[0].textContent;
                const content = $(element).find('span[data-test-selector="chat-line-message-body"]')[0].textContent;

                if(!self.users.has(username)) {
                    const u = new User();
                    u.username = username;
                    self.users.set(username, u);
                }

                const user = self.users.get(username);
        
                const message = new Message();
                message.user = user;
                message.content = content;

                user.messages.push(message);

                this.processNewMessage(message);

                //console.log(username, content)
            }

            //console.log(elements.length - this._lastAmountMessages)

            this._lastMessageElement = elements[elements.length-1];
            this._lastMessageElementIndex = elements.indexOf(this._lastMessageElement);
            this._lastAmountMessages = elements.length;

            //console.log(`${this._lastAmountMessages} messages; ${this._lastMessageElementIndex}`);

            
        }
        
    }

    window['TwitchScript'] = TwitchScript;

    TwitchScript.init()