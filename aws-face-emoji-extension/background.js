let port = null;
let uploadWindowId = null;

chrome.runtime.onInstalled.addListener(() => {
  console.log("Emoji Inserter Extension Installed");

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'start_insert') {
      console.log('start_insert');
      chrome.runtime.sendMessage({ action: "send_emoji" });
    }
  });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Processing complete message received:", message);
    if (message.action === "send_emoji_to_background") {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          chrome.tabs.sendMessage(tabs[0].id, { action: "update-input", result: message.result }, (response) => {
            if (chrome.runtime.lastError) {
              console.error("Error sending message to content script:", chrome.runtime.lastError);
            }
          });
        }
      });
    }
  });

  // Listen for message from content script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "process-complete") {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "update-input", result: message.result });
      });
    }
  });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "need_auth") {
      console.log('need_auth');
      chrome.windows.update(uploadWindowId, { focused: true });
    }
  });
    
});


chrome.commands.onCommand.addListener((command) => {
  if (command === "open-window") {
    // if window already open, focus on it
    if (uploadWindowId) {
      chrome.windows.update(uploadWindowId, { focused: true });
      return;
    }
    
    chrome.windows.create({
      url: chrome.runtime.getURL("popup.html"),
      type: "popup",
      width: 800,
      height: 500,
      top: 100,
      left: 100
    }, (window) => {
      port = chrome.tabs.connect(window.tabs[0].id);
      uploadWindowId = window.id;
      console.log("port", port);
      console.log("uploadWindowId", uploadWindowId);
      console.log("Window name:", window.name);
      

    });
  }
});

chrome.windows.onRemoved.addListener(function(windowId) {
  
  console.log("Window closed, disconnecting port.");
  port.disconnect();
  port = null;
  uploadWindowId = null;

});



