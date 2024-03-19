
document.addEventListener('DOMContentLoaded', function() {
    // Agrega un evento al botón para ocultar el descargo de responsabilidad cuando se hace clic en "Aceptar"
    document.getElementById('accept-button').addEventListener('click', function() {
      document.getElementById('disclaimer-overlay').style.display = 'none';
    });
  });
  
  
  (async function () {
    const styleOptions = {
      hideUploadButton: false,
      botAvatarInitials: 'NB',          
      botAvatarBackgroundColor: 'rgb(0,25,49)',
      userAvatarBackgroundColor: 'rgba(75,40,109)',
      userAvatarInitials: 'You'
    };
    // const tokenEndpointURL = new URL('https://default38da2016f3ea4b0abb3376eadba89b.d8.environment.api.powerplatform.com/powervirtualagents/botsbyschema/crb36_nebulaAi/directline/token?api-version=2022-03-01-preview');
  
    const tokenEndpointURL = new URL('https://a1a980b40406e5c1bcb0e633542587.0e.environment.api.powerplatform.com/powervirtualagents/botsbyschema/crda6_copilot2/directline/token?api-version=2022-03-01-preview');
    //const tokenEndpointURL = new URL('https://default38da2016f3ea4b0abb3376eadba89b.d8.environment.api.powerplatform.com/powervirtualagents/botsbyschema/crb36_nebulaUnified/directline/token?api-version=2022-03-01-preview');
    const locale = document.documentElement.lang || 'en';
  
    const apiVersion = tokenEndpointURL.searchParams.get('api-version');
    const watermark = 1; 
  // console.log(tokenEndpointURL);
  // console.log(apiVersion);
    // const [directLineURL, token] = await Promise.all([
    //   fetch(new URL(`/powervirtualagents/regionalchannelsettings?api-version=${apiVersion}`, tokenEndpointURL))
      
    //     .then(response => {
    //       if (!response.ok) {
    //         throw new Error('Failed to retrieve regional channel settings.');
           
    //       }
    //       return response.json();
    //     })
    //     .then(({ channelUrlsById: { directline } }) => directline),
    //   fetch(tokenEndpointURL)
    //     .then(response => {
    //       if (!response.ok) {
    //         throw new Error('Failed to retrieve Direct Line token.');
    //       }
    //       return response.json();
    //     })
    //     .then(({ token }) => token)
    // ]);
     // If the token is empty, then we need to get the URL and token, otherwise there is an existing conversion and we need to 
        // use the existing token to retrieve the existing conversation
                // If the token is empty, then we need to get the URL and token, otherwise there is an existing conversion and we need to 
        // use the existing token to retrieve the existing conversation
        if(!sessionStorage['token']) {
          var [directLineURL, token] = await Promise.all([
            fetch(new URL(`/powervirtualagents/regionalchannelsettings?api-version=${apiVersion}`, tokenEndpointURL))
              .then(response => {
                if (!response.ok) {
                  throw new Error('Failed to retrieve regional channel settings.');
                }

                return response.json();
              })
              .then(({ channelUrlsById: { directline } }) => directline),
            fetch(tokenEndpointURL)
              .then(response => {
                if (!response.ok) {
                  throw new Error('Failed to retrieve Direct Line token.');
                }

                return response.json();
              })
              .then(({ token }) => token)
          ]);

          // The "token" variable is the credentials for accessing the current conversation.
          // To maintain conversation across page navigation, save and reuse the token.        
          sessionStorage['token'] = token;
          sessionStorage['directLineURL'] = directLineURL;
          
        } 
  
        // The token could have access to sensitive information about the user.
        // It must be treated like user password.
        conversationId = sessionStorage['conversationId'];  // If this is set, the there is an existing conversation to be retrieved, watermark is a const value of 1
        var directLine;
        addToStorageConvoId(sessionStorage['conversationId']);
        addToStorageToken(sessionStorage['token']);
        addToStorageButton(sessionStorage['conversationId']);

        // var listArray = [conversationId,token];
        // console.log(listArray);
        if(conversationId) { 
          directLine = WebChat.createDirectLine({ domain: new URL('v3/directline', sessionStorage['directLineURL']), token: sessionStorage['token'], conversationId: conversationId, watermark: watermark});
        }
        else {
          directLine = WebChat.createDirectLine({ domain: new URL('v3/directline', directLineURL), token: token, watermark: watermark});
        }

        let storageArray1 = JSON.parse(localStorage.getItem('ConvoArray')) || [];
        let storageArray2 = JSON.parse(localStorage.getItem('TokenArray')) || [];
        let storageArray3 = JSON.parse(localStorage.getItem('buttonArray')) || [];
        let convoId = "";
        let tokes = "";
    
        function addToStorageConvoId(value) {
            let storageArray = JSON.parse(localStorage.getItem('ConvoArray')) || [];
            storageArray.push(value);
            // if (!storageArray.includes(value) && value != null) {
            //     // Add the new item to the array
            //     storageArray.push(value);
            //     // Update the array in local storage
            //     localStorage.setItem('ConvoArray', JSON.stringify(storageArray));
            //   }
            localStorage.setItem('ConvoArray', JSON.stringify(storageArray));
            
        }
    
        function addToStorageToken(value) {
          let storageArray = JSON.parse(localStorage.getItem('TokenArray')) || [];
          storageArray.push(value);
          // if (!storageArray.includes(value) && value != null) {
          //   // Add the new item to the array
          //   storageArray.push(value);
          //   // Update the array in local storage
          //   localStorage.setItem('TokenArray', JSON.stringify(storageArray));
          // }
          localStorage.setItem('TokenArray', JSON.stringify(storageArray));
          
      }

      function addToStorageButton(value) {
        let storageArray = JSON.parse(localStorage.getItem('buttonArray')) || [];
        // storageArray.push(value);
        if (!storageArray.includes(value) && value != null) {
        //     // Add the new item to the array
            storageArray.push(value);
        //     // Update the array in local storage
            localStorage.setItem('buttonArray', JSON.stringify(storageArray));
          }
        // localStorage.setItem('ConvoArray', JSON.stringify(storageArray));
        
    }
    
      function getPairedValues(storageArray1, storageArray2) {
        let pairedValues = [];
        // Ensure both arrays are of the same length
        if (storageArray2.length === storageArray1.length) {
            for (let i = 0; i < storageArray2.length; i++) {
                pairedValues.push([storageArray1[i], storageArray2[i]]);
                localStorage.setItem('PairedValues', JSON.stringify(pairedValues));
            }
        } else {
            console.error('Arrays must have the same length');
        }
        return pairedValues;
      }    
    
    let result = getPairedValues(storageArray1, storageArray2);
    // console.log(result);
    
    function retrievePair(buttonValue) {
      let storagePairs = JSON.parse(localStorage.getItem('PairedValues')) || [];
      let result = null;
      
      for (let pair of storagePairs) {
          if (pair[0] === buttonValue) {
              result = pair;
              tokes = pair[1];
              convoId = pair[0];    
              break; // exit loop once pair is found
          }
      }
      // console.log(secondp);
      return result;
      }
    
      function sendEventMessage() {
        directLine.postActivity({
          name: 'PDTestEvent',
          type: 'event',
          // value: {
            
          // }
        }).subscribe();
      }
    
    // let resu3 = deleteDuplicates(result);
    // console.log(resu3);
    
        function displayButtons() {
            let storageArray = JSON.parse(localStorage.getItem('buttonArray')) || [];
            let buttonContainer = document.getElementById('buttonContainer');
        
            // Clear existing buttons
            buttonContainer.innerHTML = '';
        
            // Add a button for each value
            storageArray.forEach(function(value) {
              
              if (value !== null) {
                let button = document.createElement('button');
                button.textContent = value;
                button.id = "testingbtn";
                button.onclick = function() {
                  let pair = retrievePair(button.textContent);
                  if (pair) {
                    console.log(tokes);
                    console.log("that was token DirectLine");
                    console.log(convoId);
                    console.log("that was convoId");
                    // sendEventMessage();
                  } else {
                      console.log('Pair not found for button value');
                  }
                // let button = document.createElement('button');
                // button.textContent = value;
                // buttonContainer.appendChild(button);
              }
                // let button = document.createElement('button');
                // button.textContent = value;
                            // button.onclick = function() {
                //     Handle button click, e.g., alert the value
                //     alert(value);
                // let pair = retrievePair(button.textContent);
                // if (pair) {
                //     let key = pair[0];
                //     let value = pair[1];
                //     console.log(`Key: ${key}, Value: ${value}`);
                // } else {
                //     console.log('Pair not found for button value');
                // }
                // };
                buttonContainer.appendChild(button);
              }
            });
        }
    



  
    // Sends "startConversation" event when the connection is established.
    const subscription = directLine.connectionStatus$.subscribe({
      next(value) {
        if (value === 2) {
          sessionStorage['conversationId'] = directLine.conversationId; // Store the conversation id to use across refreshes and page navigations
          directLine
            .postActivity({
              localTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              locale,
              name: 'startConversation',
              type: 'event',
              value: {
                DirectLineToken: tokes,
                conversationId: convoId
              }
            })
            .subscribe();

          // Only send the event once, unsubscribe after the event is sent.
          subscription.unsubscribe();
        }
      }          
    });

    document.getElementById('chat-history-button').addEventListener('click', () => {
      sendEventMessage();
    });  


    window.onload = displayButtons;
    window.WebChat.renderWebChat({ directLine, locale, styleOptions }, document.getElementById('webchat'));
  })();
  