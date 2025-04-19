



async function forgot (e){
    e.preventDefault()
    let email=document.getElementById("email").value
    console.log(email)
    let data={email}
    let options = {
        headers:{"Content-Type":"application/json"},
        method:"POST",
        body:JSON.stringify(data)
    }

    try {
        
        const response=await fetch("/api/sendotp",options)
        const data = await response.json()
        if (response.status===200){

            alert(data.message)
            
            // save email to localstorage to get email on verify == otp
            
            
            localStorage.setItem("email",email)
            window.location.href="/verifyotp.html"
        }

    } catch(err){
        console.log(err)
    }
}