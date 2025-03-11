document.getElementById('interactButton').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: interactWithPage
      });
    });
  });
  
  function interactWithPage() {
    alert('This is an interaction with the page from the window!');
    // 這裡可以加入更多與當前頁面的互動邏輯
  }