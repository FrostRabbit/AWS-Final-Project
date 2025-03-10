function auth(){
    const [image_auth, setImage_auth] = React.useState('default.jpg');
    const [uploadResultMessage_auth, setUploadResultMessage] = React.useState('Please upload an image to authenticate');
    const [isAuth, setAuth] = React.useState(false);

    const [photoURL, setPhotoURL] = React.useState(null); // For captured photo
    const [authPhotoURL, setAuthPhotoURL] = React.useState(null); // For latest authenticated photo
    

    React.useEffect(() => {
      // Cleanup the object URL when the component unmounts or image changes
      return () => {
        if (authPhotoURL) {
          URL.revokeObjectURL(authPhotoURL);
        }
      };
    }, [authPhotoURL]);
  

  
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const fileURL = URL.createObjectURL(file);
        setPhotoURL(fileURL);
        setImage_auth(file);
      }
    };
  
    const sendImage_auth = async (e) => {
      e.preventDefault();
      if (!photoURL) {
        setUploadResultMessage('No image selected.');
        return;
      }
  
      const visitorImageName = uuidv4();
      try {
        await fetch(`https://*********.execute-api.us-east-1.amazonaws.com/dev/chris-storage-2/${visitorImageName}.jpg`, {
          method: 'PUT',
          headers: {
            'Content-Type': image_auth.type
          },
          body: image_auth
        });
  
        const response = await authenticate(visitorImageName);
        if (response.Message === 'Success') {
          setAuth(true);
          is_auth = true;
          setUploadResultMessage(`Hi ${response.firstName} ${response.lastName}, welcome to work. Hope you have a productive day today!`);
        } else {
          setAuth(false);
          is_auth = false;
          setUploadResultMessage('Authentication Failed: this person is not an employee.');
        }
  
        // Set the authenticated photo URL for display
        const newAuthPhotoURL = URL.createObjectURL(image_auth);
        setAuthPhotoURL(newAuthPhotoURL);
  
      } catch (error) {
        setAuth(false);
        is_auth = false;
        setUploadResultMessage('There was an error during the authentication process. Please try again.');
        console.error(error);
      }
    };

    const sendImage_auth2 = async (e) => {
      e.preventDefault();
      if (!image_auth) {
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
            'Content-Type': image_auth.type
          },
          body: image_auth
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
    return { image_auth, setImage_auth, photoURL, setPhotoURL, authPhotoURL, uploadResultMessage_auth, isAuth, handleFileChange, sendImage_auth, sendImage_auth2 };
    
}