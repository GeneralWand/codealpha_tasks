const login = document.getElementById("login");


login.onclick = (e) => {
    e.preventDefault();

    const usernameAddress = document.getElementById("username").value;
    const passwordAddress = document.getElementById("password").value;


    const getUser = localStorage.getItem("Username")
    const getPass = localStorage.getItem("Password")

    if (usernameAddress == "" && passwordAddress ==""){
        swal("Input field has no value")
    }else{
        if (usernameAddress == getUser && passwordAddress == getPass){
            swal(`Login successfully, hi ${usernameAddress}`)
            window.location.href = 'expense.html';
        } else{
            swal("Something is wrong")
        }
    }


}