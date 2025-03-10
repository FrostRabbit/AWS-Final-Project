let emoji;

function Emoji() {
    const [image_emoji,setImage_emoji] = React.useState('images/default.jpg');
    const [uploadResultMessage_emoji, setUploadResultMessage] = React.useState('Please upload an image'); 
   

    function insertemoji(emoji){
        let input = document.activeElement;

        if(input && input.tagName === 'INPUT' && input.type === 'text'){
            const start = input.selectionStart;
            const end = input.selectionEnd;
            const value = input.value;

            input.value = value.slice(0, start) + emoji + value.slice(end);
            input.selectionStart = input.selectionEnd = start + emoji.length;
            input.focus();
        } else if(!input || input.tagName !== 'INPUT'){
            input = document.querySelector('input[id="insert"]');
            const value = input.value;
            input.value = value + emoji;
        }
    }

    async function sendImage_emoji(e) { 
        e.preventDefault();
        if(!is_auth && !idToken){
            alert("Please sign in first");
            return;
        }
        if (image_emoji == 'images/default.jpg') {
            setUploadResultMessage('No image selected.');
            return;
        }
        const visitorImageName = uuidv4();

        // Convert the image to a Base64 string
        const reader = new FileReader();
        reader.readAsDataURL(image_emoji);
        reader.onloadend = async function() {
            const base64Image = reader.result.split(',')[1];

            // Create a JSON object with the image and filename
            const data = JSON.stringify({
                file: base64Image,
                name: visitorImageName
            });

            // Send the JSON data to the API Gateway
            const response = await fetch(`https://*********.execute-api.us-east-1.amazonaws.com/dev/emoji`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: data
            });
            const responseData = await response.json();
            const body = JSON.parse(responseData.body);
            setUploadResultMessage('Your emotion is  '+body);
            insertemoji(body);
            emoji = responseData.emotion;
        }
    }
    return { image_emoji, setImage_emoji, uploadResultMessage_emoji, sendImage_emoji };
}

function handlekeys() {
    const [keys, setKeys] = React.useState({});
    async function handleKeyDown(e) {
        setKeys(keys => {
            const newKeys = {...keys, [e.key]: true};
            if (newKeys['Alt'] && newKeys['v']) {
                e.preventDefault();
                console.log('Control was pressed');
                document.getElementById('emojiform').requestSubmit();
            }
            if (newKeys['Alt'] && newKeys['c']) {
                e.preventDefault();
                console.log('Alt+c was pressed');
                new Promise((resolve, reject) => {
                    document.getElementById('emojiform').requestSubmit();
                    resolve();
                }).then(() => {
                    if (emoji) {
                        emoji_trigger(emoji);
                    } else {
                        console.error('Emoji is undefined');
                    }
                });
            }
            return newKeys;
        });
    }

    function handleKeyUp(e) {
        e.preventDefault();
        setKeys(keys => ({...keys, [e.key]: false}));
    }


    React.useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);
}
