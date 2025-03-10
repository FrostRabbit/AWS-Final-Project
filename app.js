import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';

// function getInputValue(){
//   // Get the input element
//   const firstElement = document.getElementById('first');
//   const lastElement = document.getElementById('last');
//   // Get the value of the input element
//   const firstValue = firstElement.value;
//   const lastValue = lastElement.value;
//   const fullName = firstValue + '_' + lastValue;
//   alert('The name is2: ' + fullName);
//   return fullName;
// };



function App() {
  const [image, setImage] = useState(null);
  const [uploadResultMessage, setUploadResultMessage] = useState('Please upload an image to authenticate');
  const [isAuth, setAuth] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [photoURL, setPhotoURL] = useState(null); // For captured photo
  const [uploadedPhotoURL, setUploadedPhotoURL] = useState(null); // For uploaded photo
  const [authPhotoURL, setAuthPhotoURL] = useState(null); // For latest authenticated photo

  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);


  useEffect(() => {
    // Cleanup the object URL when the component unmounts or image changes
    return () => {
      if (uploadedPhotoURL) {
        URL.revokeObjectURL(uploadedPhotoURL);
      }
      if (authPhotoURL) {
        URL.revokeObjectURL(authPhotoURL);
      }
    };
  }, [uploadedPhotoURL, authPhotoURL]);

  const handleStartCamera = () => {
    setIsCameraOpen(true);
    startCamera();
  };

  const handleTakePhoto = () => {
    takePhoto();
    setIsCameraOpen(false);
  };

  const handleCancel = () => {
    setIsCameraOpen(false);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setStream(stream);
    } catch (error) {
      console.error('Cannot access camera: ', error);
    }
  };

  const takePhoto = () => {
    //alert('test');
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    //alert('test2');

   
    const url = canvas.toDataURL('image/png'); //modify
    setPhotoURL(url);
    //alert(url);

    // Convert DataURL to a File object
    const arr = url.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const file = new File([u8arr], 'photo.png', { type: mime });
    setImage(file);
    console.log('Photo taken:', url);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const fileURL = URL.createObjectURL(file);
      setUploadedPhotoURL(fileURL);
      setImage(file);
    }
  };
  
  const sendImage = async (e) => {
    e.preventDefault();
    if (!image) {
      alert("hi");
      setUploadResultMessage('No image selected. Please choose an image or take a photo.');
      return;
    }

    const visitorImageName = uuidv4();
    try {
      await fetch(`https://*********.execute-api.us-east-1.amazonaws.com/dev/chris-storage-2/${visitorImageName}.jpg`, {
        method: 'PUT',
        headers: {
          'Content-Type': image.type
        },
        body: image
      });

      const response = await authenticate(visitorImageName);
      if (response.Message === 'Success') {
        setAuth(true);
        setUploadResultMessage(`Hi ${response.firstName} ${response.lastName}, welcome to work. Hope you have a productive day today!`);
      } else {
        setAuth(false);
        setUploadResultMessage('Authentication Failed: this person is not an employee.');
      }

      // Set the authenticated photo URL for display
      const newAuthPhotoURL = URL.createObjectURL(image);
      setAuthPhotoURL(newAuthPhotoURL);

    } catch (error) {
      setAuth(false);
      setUploadResultMessage('There was an error during the authentication process. Please try again.');
      console.error(error);
    }
  };

  const sendImage2 = async (e) => {
    e.preventDefault();
    if (!image) {
      setUploadResultMessage('No image selected. Please choose an image or take a photo.');
      return;
    }

     // Get the input element
    var firstElement = document.getElementById('first');
    var lastElement = document.getElementById('last');
    // Get the value of the input element
    var firstValue = firstElement.value;
    var lastValue = lastElement.value;
    var name = firstValue + '_' + lastValue;
   
     // let name = 'a'; //getInputValue();
     // alert(getInputValue());
    alert(name);
     

    const visitorImageName = name;  //uuidv4();
    try {
      await fetch(`https://*********.execute-api.us-east-1.amazonaws.com/dev/christorage/${visitorImageName}.jpg`, {
        method: 'PUT',
        headers: {
          'Content-Type': image.type
        },
        body: image
      });

      

    } catch (error) {
      setUploadResultMessage('There was an error during register. Please try again.');
      console.error(error);
    }
  };

  const authenticate = async (visitorImageName) => {
    const requestUrl = `https://*********.execute-api.us-east-1.amazonaws.com/dev/employee?objectKey=${visitorImageName}.jpg`;
    try {
      const response = await fetch(requestUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return { Message: 'Error' };
    }
  };

  return (
    <div className="App">
      <h2>Chris Facial Recognition System</h2>
      {isCameraOpen ? (
        <div>
          <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%' }}></video>
          <div>
            
            <button onClick={handleTakePhoto} >Take Photo</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      ) : (
        <div>
          <form onSubmit={sendImage}>
            <input type='file' name='image' accept='image/*' onChange={handleFileChange} />
            <button type='submit'>Authenticate</button>
          </form>
          
          <form onSubmit={sendImage2}>
            <input type='text' id="first" name="first" placeholder="first"></input>
            <input type='text' id="last" name="last" placeholder="last"></input>
            <button type='submit'>Register</button>
          </form> 
          <button onClick={handleStartCamera}>Open Camera</button>
          
          <div>
            <h3>Uploaded Photo</h3>
            {uploadedPhotoURL && (
              <img src={uploadedPhotoURL} alt="Uploaded" height={250} />
            )}
          </div>
          
          <div>
            <h3>Captured Photo</h3>
            {photoURL && (
              <img src={photoURL} alt="Captured" height={250} />
            )}
          </div>
            
            
            
          <div>
            <h3>Latest Authenticated Photo</h3>
            {authPhotoURL && (
              <img src={authPhotoURL} alt="Authenticated" height={250} />
            )}
          </div>

          <div className={isAuth ? 'success' : 'failure'}>{uploadResultMessage}</div>
        </div>
      )}
    </div>
  );
}

export default App;

// 203: <button onClick={getInputValue}>Confirm Name</button>