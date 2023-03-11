let submitButton = document.getElementById("signUp");


function signUp() {

    const email = document.getElementById("email").value
    const password = document.getElementById("psw").value


    if (ValidateEmail(email) == true && ValidatePassword(psw) == true) {

        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((cred) => {
                console.log(cred);
                db.collection('myDatabase').doc(cred.user.uid).set({

                    email: email,
                    password: password,

                })
                // .then(() => {

                //     // alert("signed up")
                //     // document.write('User is added!!!!');

                // });
                alert("Sign Up Successful!!")
                // document.write('User is added!!!!');
            })

            .catch((error) => {

                console.log(error.message);
                alert(error.message)

            })

    }
    document.getElementById("myForm").reset();

}


function signIn() {

    const email = document.getElementById("email").value
    const password = document.getElementById("psw").value

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => {

            window.location.replace("home.html");

            // document.write("login successful")
        })

        .catch((error) => {
            document.getElementById("myForm").reset();
            console.log(error);
            alert(error.message)
        });
}


//validate
function ValidateEmail(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return (true)
    }
    alert("You have entered an invalid email address!")
    return (false)
}


function ValidatePassword(psw) {
    if (psw < 6) {
        alert("Password must be atleast 6 characters!")
        return false
    }
    else {
        return true
    }
}

