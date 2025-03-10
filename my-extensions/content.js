document.addEventListener('DOMContentLoaded', (event) => {
  const scriptReact = document.createElement('script');
  scriptReact.src = chrome.runtime.getURL('libs/react.js');
  document.head.appendChild(scriptReact);

  const scriptReactDOM = document.createElement('script');
  scriptReactDOM.src = chrome.runtime.getURL('libs/react-dom.js');
  document.head.appendChild(scriptReactDOM);

  scriptReactDOM.onload = () => {
      console.error('Failed to load ReactDOM script');
      init();
  };
  
  function init() {
    function App(){
        const { image_emoji, setImage_emoji, uploadResultMessage_emoji, sendImage_emoji } = Emoji();
        const { image_auth, setImage_auth, photoURL, setPhotoURL, authPhotoURL, uploadResultMessage_auth
            , isAuth, handleFileChange, sendImage_auth, sendImage_auth2 } = auth();
        const { isCameraOpen, videoRef, handleStartCamera, h`andleTakePhoto, handleCancel } = camera(setImage_emoji, setImage_auth, setPhotoURL);
        handlekeys();
        
    
        const displaycenter = {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            color: '#FFFFFF'
        };
    
        const image_size = {
            maxWidth: '250px',
            maxHeight: '250px'
        };
  
        
        return React.createElement(
          "div",
          {},
          isCameraOpen &&
            React.createElement(
              "div",
              { style: { ...displaycenter, flexDirection: "column" } },
              React.createElement("video", {
                ref: videoRef,
                autoPlay: true,
                playsInline: true,
                muted: true,
                style: { width: "32%", height: "18%" },
              }),
              React.createElement(
                "div",
                {},
                React.createElement(
                  "button",
                  { onClick: handleTakePhoto },
                  "Take Photo"
                ),
                React.createElement("button", { onClick: handleCancel }, "Cancel")
              )
            ),
          React.createElement(
            "div",
            { style: { ...displaycenter, alignItems: "top" } },
            React.createElement(
              "div",
              {},
              React.createElement(
                "div",
                { style: { textAlign: "center" } },
                uploadResultMessage_emoji
              ),
              React.createElement(
                "div",
                {},
                React.createElement("h3", {}, "Selected Photo"),
                React.createElement("img", {
                  src:
                    image_emoji instanceof Blob
                      ? URL.createObjectURL(image_emoji)
                      : image_emoji,
                  alt: "emoji",
                  style: image_size,
                })
              ),
              React.createElement(
                "div",
                {},
                React.createElement("input", {
                  type: "text",
                  id: "insert",
                  style: { width: "300px", marginLeft: "0", marginBottom: "10px" },
                })
              ),
              React.createElement(
                "form",
                { id: "emojiform", style: { ...displaycenter, marginTop: "10px" }, onSubmit: sendImage_emoji },
                React.createElement("input", {
                  className: "other",
                  type: "file",
                  name: "image",
                  accept: "image/*",
                  onChange: (e) => setImage_emoji(e.target.files[0]),
                }),
                React.createElement(
                  "button",
                  { className: "other", type: "submit" },
                  "Emoji"
                ),
                React.createElement(
                  "button",
                  { className: "other", onClick: handleStartCamera },
                  "Camera"
                )
              )
            ),
            React.createElement(
              "div",
              { className: "Auth" },
              React.createElement(
                "div",
                { style: { ...displaycenter, flexDirection: "column" } },
                React.createElement(
                  "div",
                  { className: isAuth ? "success" : "failure" },
                  uploadResultMessage_auth
                ),
                React.createElement(
                  "div",
                  {},
                  React.createElement("h3", {}, "Selected Photo"),
                  React.createElement("img", {
                    src: photoURL || image_auth,
                    alt: "Captured",
                    style: image_size,
                  })
                ),
                React.createElement(
                  "div",
                  {},
                  React.createElement("h3", {}, "Latest Authenticated Photo"),
                  authPhotoURL &&
                    React.createElement("img", {
                      src: authPhotoURL,
                      alt: "Authenticated",
                      style: image_size,
                    })
                ),
                React.createElement(
                  "form",
                  { onSubmit: sendImage_auth, style: { ...displaycenter, width: "450px" } },
                  React.createElement("input", {
                    className: "other",
                    type: "file",
                    name: "image",
                    accept: "image/*",
                    onChange: handleFileChange,
                  }),
                  React.createElement(
                    "button",
                    { className: "other", type: "submit" },
                    "Auth"
                  ),
                  React.createElement(
                    "button",
                    { className: "other", onClick: handleStartCamera },
                    "Camera"
                  )
                ),
                React.createElement(
                  "form",
                  { onSubmit: sendImage_auth2, style: { ...displaycenter, width: "450px" } },
                  React.createElement("input", {
                    type: "text",
                    id: "first",
                    name: "first",
                    placeholder: "first",
                  }),
                  React.createElement("input", {
                    type: "text",
                    id: "last",
                    name: "last",
                    placeholder: "last",
                  }),
                  React.createElement("button", { type: "submit" }, "Register")
                )
              )
            )
          )
        );
        
      }  
    

            
    const root = ReactDOM.createRoot(document.getElementById('recog'));

    root.render(
      React.createElement(
        React.StrictMode,
        null,
        React.createElement(App)
      )
    );
        
  
  }
  console.log("Content script loaded.");
  document.addEventListener('keydown', (event) => {
    if (event.altKey && event.code === 'KeyA') {
      // 當 Ctrl+Shift+Y 按下時，執行以下操作
      console.log('Shift+F pressed');
      chrome.runtime.sendMessage({ action: "start_insert" });
    }
  });


  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "update-input") {
      const inputField = document.activeElement;
      console.log('update-input', inputField);
      if (inputField && inputField.tagName === 'INPUT' && inputField.type === 'text') {
        const start = inputField.selectionStart;
        const end = inputField.selectionEnd;
        const value = inputField.value;
  
        inputField.value = value.slice(0, start) + message.result + value.slice(end);
        inputField.selectionStart = inputField.selectionEnd = start + message.result.length;
        inputField.focus();
        return;
      }
      if(inputField && inputField.isContentEditable) {
        const selection = window.getSelection();
        if (!selection.rangeCount) return false;
        const range = selection.getRangeAt(0);
        
        range.deleteContents();
        range.insertNode(document.createTextNode(message.result));
        inputField.focus();
      }
    }
  });
});