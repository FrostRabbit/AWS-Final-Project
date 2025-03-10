window.idToken = null;
window.is_auth = false;

// callAPI function that takes the base and exponent numbers as parameters
function callAPI (base,type,number){
    console.log(is_auth);
    //check if already signed in
    if(!is_auth && !idToken){
        alert("Please sign in first");
        return;
    }
    // check if base or number is empty
    if(base === "" || number === "" ){
        alert("Please enter a number");
        return;
    }
    if(isNaN(base) || isNaN(number)){
        alert("Please enter a valid number");
        return;
    }
    if(type === "divide" && number === "0"){
        alert("Cannot divide by zero");
        return;
    }
    // instantiate a headers object
    var myHeaders = new Headers();
    // add content type header to object
    myHeaders.append("Content-Type", "application/json");
    // using built in JSON utility package turn object to string and store in a variable
    var raw = JSON.stringify({"base":base,"type":type,"number":number});
    // create a JSON object with parameters for API call and store in a variable
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    // make API call with parameters and use promises to get response
    fetch("https://*********.execute-api.us-east-1.amazonaws.com/dev", requestOptions)
    .then(response => response.text())
    .then(result => {
        document.getElementById('base').value = JSON.parse(result).body
        document.getElementById(type).value = null
    })
    .catch(error => console.log('error', error));
}

function emoji_trigger(emoji){
    console.log('image_emoji');
    var number = 0;
    const base = document.getElementById('base').value;
    console.log(emoji);
    switch(emoji){
        case "HAPPY":
            number = document.getElementById('add').value;
            callAPI(base,"add",number);
            break;
        case "SAD":
            number = document.getElementById('subtract').value;
            callAPI(base,"subtract",number);
            break;
        case "ANGRY":
            number = document.getElementById('multiply').value;
            callAPI(base,"multiply",number);
            break;
        case "SURPRISED":
            number = document.getElementById('divide').value;
            callAPI(base,"divide",number);
            break;
        default:
            break;
    }
}

function changeImage(){

    var pastry_name_str = "cat_default";


    if(document.cookie !== "" && document.cookie.split('=')[1] !== ""){

        pastry_name_str = document.cookie.split("=")[1];

    }

    $("[data-role2='special_highlight']").attr("src", "images/"+pastry_name_str+".jpg");

}

window.WEB_CONFIG = {
    // API Gateway URL
    API_BASE_URL_STR: "https://*********.execute-api.us-east-1.amazonaws.com/dev",
    COGNITO_LOGIN_BASE_URL_STR: "https://*********.auth.us-east-1.amazoncognito.com/login?client_id=*********&response_type=token&scope=email+openid&redirect_uri=Fcallback.html"

};

async function signIn() {
    window.location.href = 'https://*********.auth.us-east-1.amazoncognito.com/oauth2/authorize?client_id=*********&response_type=token&scope=email+openid&redirect_uri=*********.cloudfront.net';
}

async function signOut() {
    
    window.location.href = 'https://*********.auth.us-east-1.amazoncognito.com/logout?client_id=*********&logout_uri=*********.cloudfront.net';
}

window.onload = function() {
    const urlParams = new URLSearchParams(window.location.hash.replace(/^#/, '?'));
    idToken = urlParams.get('id_token');
    const accessToken = urlParams.get('access_token');
    const expiresIn = urlParams.get('expires_in');
    
    if (idToken !== null) {
        console.log('ID Token:', idToken);
        console.log('Access Token:', accessToken);
        console.log('Token Expires In:', expiresIn);
    }
};
$(document).ready(function() {
    changeImage();
});