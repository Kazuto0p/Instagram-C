

async function verify(e) {
    e.preventDefault()

    const otp = document.getElementById('otp').value
    console.log(otp)

    let email = localStorage.getItem("email")
    
    let data = {otp,email}
    let options = {
        headers:{"Content-Type":"application/json"},
        method:"POST",
        body:JSON.stringify(data)
    }
    

    try {
        const response = await fetch('/api/verifyotp',options)
        const data = await response.json()
        if (response.status === 200) {
            alert(data.message)
            window.location.href="/password_reset.html"
        } else {
            alert(data.message)
        }
        
    } catch (error) {
        console.log(error)
        alert(error)
    }

}