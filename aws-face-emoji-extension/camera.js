function camera(setImage_auth, setImage_emoji, setPhotoURL){
    const [isCameraOpen, setIsCameraOpen] = React.useState(false);
    const videoRef = React.useRef(null);
    const [stream, setStream] = React.useState(null);
    
    const handleStartCamera = () => {
        setIsCameraOpen(true);
        startCamera();
      };
    
      const handleTakePhoto = () => {
        takePhoto();
        setIsCameraOpen(false);
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
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
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
        const url = canvas.toDataURL('image/png');
        setPhotoURL(url);
    
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
        setImage_auth(file);
        setImage_emoji(file);
        console.log('Photo taken:', url);
      };
    
      return { isCameraOpen, videoRef, handleStartCamera, handleTakePhoto, handleCancel };
}