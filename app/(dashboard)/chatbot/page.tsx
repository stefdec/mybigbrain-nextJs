"use client";

export default function Home() {
  return (
    <div className="flex flex-col justify-center align-middle min-h-full">
      <iframe
        id="bpFull"
        className="flex-1 w-full h-full"
        srcDoc={`<!DOCTYPE html><html><body>
          <script src='https://cdn.botpress.cloud/webchat/v2.2/inject.js'></script>
          <script src='https://files.bpcontent.cloud/2024/10/12/01/20241012013920-K93RBTEH.js'></script>
          <script>
            // Open webchat
            window.botpress.on('webchat:ready', (conversationId) => { botpress.open(); });
            window.botpress.on('conversation', (conversationId) => { botpress.open(); });
            window.botpress.on('webchat.open', (conversationId) => { 
              botpress.open();window.botpress.sendEvent({
                  type: 'custom',
                  id: '106117210796623775541',
                  payload: {}
              });
              console.log("event sent?");
              });
          </script>
          <style>
            @media (min-width:768px) {
              .bpWebchat { width: 100%; height: 100%; right: 0; bottom: 0; max-height: 100%; overflow: auto; -webkit-overflow-scrolling: touch; }
            }
          </style>
          </body></html>`}
      ></iframe>
    </div>
  );
}