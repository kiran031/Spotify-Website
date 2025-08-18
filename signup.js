//signup page
let passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

document.querySelector(".signupform").addEventListener('submit', (e) => {
    e.preventDefault();
    let email = document.querySelector("#email").value;
    let number = document.querySelector("#number").value;
    let password = document.querySelector("#password").value;
    let conpassword = document.querySelector("#confirm-password").value;
    let formData = new URLSearchParams();
    formData.append("email", email);
    formData.append("number", number);
    formData.append("password", password);
    if (number.length === 10 && passwordPattern.test(password) && password === conpassword) {
        try {
            let sendUserData = async () => {
                let response = await fetch("http://localhost:1234/SpotifyData/signup", {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    // body: JSON.stringify({
                    //     email: email.value,
                    //     number: number.value,
                    //     password: password.value
                    // })
                    body:formData
                })
                if (!response.ok) {
                    console.log(`http server is failed ${response.status}`);
                }
                response = await response.text();
                console.log(response);
            }
            sendUserData();
        } catch (error) {
            console.log("error occured");
        }
    } else {
        console.log("invalid");
    }
    //clear all form
    document.querySelector(".signupform").reset();
})