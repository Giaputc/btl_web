function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  // Sử dụng hàm
 
function save(){
 let fullname=document.getElementById('fullname').value
 let email=document.getElementById('email').value
 let phone=document.getElementById('phone').value
 let address=document.getElementById('address').value
 let gender=''
 if(document.getElementById('male').checked){
    gender=document.getElementById('male').value
 }else if(document.getElementById('famale').checked){
    gender=document.getElementById('famale').value
 
}
console.log(fullname,email,phone,address,gender)
if(_.isEmpty(fullname)){
    fullname='';
    document.getElementById('fullname-error').innerHTML=' vui lòng nhập lại'
}else if(fullname.trim().length <=2){
    fullname=''
    document.getElementById('fullname-error').innerHTML='họ tên không nhỏ hơn 2 ký tự'
}
else if(fullname.trim().length >50){
    fullname=''
    document.getElementById('fullname-error').innerHTML='họ tên không lớn hơn 50 ký tự'
}
else{
    document.getElementById('fullname-error').innerHTML=' '
}

if(_.isEmpty(email)){
    email=''
 document.getElementById('email-error').innerHTML=' vui lòng nhập lại email'
}else if(!isValidEmail(email)){
    email=''
document.getElementById('email-error').innerHTML=' email nay không đúng định dạng'
}else{
    document.getElementById('email-error').innerHTML=' '
}

if(_.isEmpty(phone)){
    phone=''
    document.getElementById('phone-error').innerHTML='vui lòng nhập lại '
}else if(phone.trim().length!=10){
    document.getElementById('phone-error').innerHTML='vui lòng nhập đúng định dạng'
}
else{
    document.getElementById('phone-error').innerHTML=' '
}

if(_.isEmpty(address)){
    address=''
    document.getElementById('address-error').innerHTML='vui lòng nhập lại'
}else{
    document.getElementById('address-error').innerHTML=' '
}

if(_.isEmpty(gender)){
    gender=''
    document.getElementById('gender-error').innerHTML='vui lòng nhập'
}else{
    document.getElementById('gender-error').innerHTML=' '
}if(fullname&&gender&&address&&phone&&gender){
    //lưu trữ vào danh sách  sinh viên
    let students = JSON.parse(localStorage.getItem('students')) || [];

     students.push({
        fullname:fullname,
        email:email,
        phone:phone,
        address:address,
        gender:gender,
    });
    
           localStorage.setItem('students',JSON.stringify(students))
           this.renderListStudent()
}
}
function renderListStudent(){
    let students = JSON.parse(localStorage.getItem('students')) || [];
    console.log(students.length)
    // Toggle list visibility based on whether students exist
    if (students.length === 0) {
        document.getElementById('list-student').style.display = 'none';
        return false;
    } else {
        document.getElementById('list-student').style.display = 'block';
    }

    let tableContent = `
        <tr>
            <td width='20'>#</td>
            <td width='90'>Họ và tên</td>
            <td>Email</td>
            <td>Điện Thoại</td>
            <td>Giới tính</td>
            <td width='90'>Địa chỉ</td>
        </tr>`;

    students.forEach((student, index) => {  
        let studentID=index
        let genderLabel = student.gender === '1' ? 'Nam' : 'Nữ';
         index++;
        tableContent += `
            <tr>
                <td>${index}</td>
                <td>${student.fullname}</td>
                <td>${student.email}</td>
                <td>${student.phone}</td>
                <td>${genderLabel}</td>
                <td>${student.address}</td>
            </tr>`;
    });

    document.getElementById('gird-studien').innerHTML = tableContent;
}

    function login() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorElement = document.getElementById('login-error');

       
        const validUsername = "adimin";
        const validPassword = "password"; // Change this to your desired password
        errorElement.textContent = '';

        if (username === validUsername && password === validPassword) {
            window.location.href = "giaovien.html"; // Change this to your target page
        } else {
            errorElement.textContent = 'Tên đăng nhập hoặc mật khẩu không chính xác.';
        }
    }

