// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateInput(value, fieldName, errorElementId, validationRules) {
    const errorElement = document.getElementById(errorElementId);
    
    if (_.isEmpty(value)) {
        errorElement.innerHTML = `Vui lòng nhập ${fieldName}`;
        return false;
    }

    if (validationRules) {
        const validationResult = validationRules(value);
        if (!validationResult.isValid) {
            errorElement.innerHTML = validationResult.message;
            return false;
        }
    }

    errorElement.innerHTML = '';
    return true;
}

let currentStudents = []; // Biến lưu trữ danh sách sinh viên hiện tại

// Student CRUD Operations
function save() {
    const studentData = {
        fullname: document.getElementById('fullname').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        gender: document.querySelector('input[name="gender"]:checked')?.value || ''
    };

    // Validation rules
    const validations = {
        fullname: (value) => {
            if (value.trim().length <= 2) return { isValid: false, message: 'Họ tên không nhỏ hơn 2 ký tự' };
            if (value.trim().length > 50) return { isValid: false, message: 'Họ tên không lớn hơn 50 ký tự' };
            return { isValid: true };
        },
        email: (value) => ({
            isValid: isValidEmail(value),
            message: 'Email không đúng định dạng'
        }),
        phone: (value) => ({
            isValid: value.trim().length === 10,
            message: 'Số điện thoại phải có 10 số'
        })
    };

    // Validate all fields
    const isFullnameValid = validateInput(studentData.fullname, 'họ tên', 'fullname-error', validations.fullname);
    const isEmailValid = validateInput(studentData.email, 'email', 'email-error', validations.email);
    const isPhoneValid = validateInput(studentData.phone, 'số điện thoại', 'phone-error', validations.phone);
    const isAddressValid = validateInput(studentData.address, 'địa chỉ', 'address-error');
    const isGenderValid = validateInput(studentData.gender, 'giới tính', 'gender-error');

    if (isFullnameValid && isEmailValid && isPhoneValid && isAddressValid && isGenderValid) {
        let students = JSON.parse(localStorage.getItem('students')) || [];
        students.push(studentData);
        localStorage.setItem('students', JSON.stringify(students));
        currentStudents = students; // Cập nhật danh sách hiện tại
        renderListStudent();
        clearForm();
    }
}
function renderListStudent(students = null) {
    // Nếu không có danh sách được truyền vào, sử dụng danh sách hiện tại hoặc lấy từ localStorage
    students = students || currentStudents || JSON.parse(localStorage.getItem('students')) || [];
    currentStudents = students;

    const studentList = document.getElementById('list-student');
    const studentGrid = document.getElementById('gird-studien');
    const genderFilter = document.getElementById('genderFilter').value;

    studentList.style.display = 'block';

    if (students.length === 0) {
        let message = 'Không có dữ liệu';
        
        // Thêm thông báo cụ thể cho trường hợp lọc giới tính
        if (genderFilter !== 'all') {
            message = `Không có sinh viên ${genderFilter === '1' ? 'Nam' : 'Nữ'}`;
        }
        
        studentGrid.innerHTML = `<tr><td colspan="7">${message}</td></tr>`;
        return;
    }

    const tableContent = `
        <tr>
            <td width='20'>#</td>
            <td width='90'>Họ và tên</td>
            <td>Email</td>
            <td>Điện Thoại</td>
            <td>Giới tính</td>
            <td width='90'>Địa chỉ</td>
            <td width='90'>Hành động</td>
        </tr>
        ${students.map((student, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${student.fullname}</td>
                <td>${student.email}</td>
                <td>${student.phone}</td>
                <td>${student.gender === '1' ? 'Nam' : 'Nữ'}</td>
                <td>${student.address}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-warning btn-sm" onclick="editStudent(${index})">Sửa</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteStudent(${index})">Xóa</button>
                    </div>
                </td>
            </tr>
        `).join('')}
    `;

    studentGrid.innerHTML = tableContent;
}

function searchStudents() {
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    const genderFilter = document.getElementById('genderFilter').value;
    const allStudents = JSON.parse(localStorage.getItem('students')) || [];

    const filteredStudents = allStudents.filter(student => {
        // Checks if student's name starts with the search term
        const nameMatch = student.fullname.toLowerCase().startsWith(searchTerm);
        const genderMatch = genderFilter === 'all' || student.gender === genderFilter;
        return nameMatch && genderMatch;
    });

    renderListStudent(filteredStudents);
}

function deleteStudent(id) {
    if (confirm('Bạn có chắc muốn xóa sinh viên này?')) {
        let students = JSON.parse(localStorage.getItem('students')) || [];
        students.splice(id, 1);
        localStorage.setItem('students', JSON.stringify(students));
        currentStudents = students; // Cập nhật danh sách hiện tại
        renderListStudent();
    }
}

function editStudent(id) {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const student = students[id];

    // Fill the form with the selected student's data
    document.getElementById('fullname').value = student.fullname;
    document.getElementById('email').value = student.email;
    document.getElementById('phone').value = student.phone;
    document.getElementById('address').value = student.address;
    document.getElementById(student.gender === '1' ? 'male' : 'famale').checked = true;

    // Change the save button to an update button
    const saveButton = document.querySelector('button[onclick="save()"]');
    saveButton.textContent = 'Cập nhật';
    saveButton.onclick = () => updateStudent(id);
}


function updateStudent(id) {
    const studentData = {
        fullname: document.getElementById('fullname').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        gender: document.querySelector('input[name="gender"]:checked')?.value || ''
    };

    // Retrieve the current student list, update the student, and save it back
    let students = JSON.parse(localStorage.getItem('students')) || [];
    students[id] = studentData;
    localStorage.setItem('students', JSON.stringify(students));
    currentStudents = students; // Update the current student list in memory

    renderListStudent();
    clearForm();
    resetSaveButton();
}


function clearForm() {
    document.getElementById('fullname').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('address').value = '';
    document.querySelectorAll('input[name="gender"]').forEach(radio => radio.checked = false);
    clearErrors();
}

function clearErrors() {
    const errorElements = document.querySelectorAll('[id$="-error"]');
    errorElements.forEach(element => element.innerHTML = '');
}

function resetSaveButton() {
    const saveButton = document.querySelector('button[onclick="save()"]');
    saveButton.textContent = 'Lưu lại';
    saveButton.onclick = save;
}

// Event listeners
document.getElementById('searchInput').addEventListener('input', searchStudents);
document.getElementById('genderFilter').addEventListener('change', searchStudents);

// Load danh sách sinh viên khi trang được tải
window.onload = function() {
    currentStudents = JSON.parse(localStorage.getItem('students')) || [];
    renderListStudent();
};