document.addEventListener("DOMContentLoaded", () => {
    const appointmentForm = document.getElementById("appointment-form");
    const paymentForm = document.getElementById("payment-form");
    const loginForm = document.getElementById("login-form");
    
    let currentBooking = JSON.parse(localStorage.getItem("currentBooking")) || {};

    if (appointmentForm) {
        appointmentForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            currentBooking = {
                id: Date.now(),
                name: document.getElementById("patient-name").value,
                phone: document.getElementById("patient-phone").value,
                region: document.getElementById("region-select").value,
                clinic: document.getElementById("clinic-select").value,
                doctor: document.getElementById("doctor-select").value,
                date: document.getElementById("appointment-date").value,
                total: "600 NAD (37.000 Kz)",
                status: "Pendente"
            };

            localStorage.setItem("currentBooking", JSON.stringify(currentBooking));

            document.getElementById("booking-section").classList.add("hidden");
            document.getElementById("payment-section").classList.remove("hidden");
        });
    }

    if (paymentForm) {
        paymentForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const fileInput = document.getElementById("receipt-file");
            
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const reader = new FileReader();

                reader.onload = function(uploadEvent) {
                    currentBooking.receiptName = file.name;
                    currentBooking.receiptData = uploadEvent.target.result; // Salva a imagem em base64 para o admin ver
                    currentBooking.status = "A aguardar validação";

                    let allBookings = JSON.parse(localStorage.getItem("allBookings")) || [];
                    allBookings.push(currentBooking);
                    localStorage.setItem("allBookings", JSON.stringify(allBookings));

                    document.getElementById("payment-section").classList.add("hidden");
                    document.getElementById("status-section").classList.remove("hidden");
                };

                reader.readAsDataURL(file);
            }
        });
    }

    // Sistema de Login Admin simples (Passe: apsan2026)
    if (loginForm) {
        const isAdminLoggedIn = sessionStorage.getItem("adminLoggedIn");
        if (isAdminLoggedIn === "true") {
            document.getElementById("login-overlay").classList.add("hidden");
        }

        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const pass = document.getElementById("admin-password").value;
            if (pass === "apsan2026") {
                sessionStorage.setItem("adminLoggedIn", "true");
                document.getElementById("login-overlay").classList.add("hidden");
            } else {
                alert("Palavra-passe incorreta!");
            }
        });
    }

    const adminTableBody = document.getElementById("admin-table-body");
    if (adminTableBody) {
        renderAdminTable();
    }
});

function logoutAdmin() {
    sessionStorage.removeItem("adminLoggedIn");
    location.reload();
}

function renderAdminTable() {
    const adminTableBody = document.getElementById("admin-table-body");
    const noData = document.getElementById("no-data");
    let allBookings = JSON.parse(localStorage.getItem("allBookings")) || [];

    adminTableBody.innerHTML = "";

    if (allBookings.length === 0) {
        noData.classList.remove("hidden");
        return;
    } else {
        noData.classList.add("hidden");
    }

    allBookings.forEach((booking, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="p-4 font-medium text-slate-900">${booking.name}</td>
            <td class="p-4 text-slate-600">+244 ${booking.phone}</td>
            <td class="p-4 text-slate-600">${booking.region} <br><span class="text-xs text-blue-600">${booking.clinic}</span></td>
            <td class="p-4 text-slate-600">${booking.doctor}</td>
            <td class="p-4 text-slate-600">${booking.date}</td>
            <td class="p-4 font-semibold text-blue-900">${booking.total}</td>
            <td class="p-4">
                <button onclick="viewReceipt('${encodeURIComponent(booking.receiptData)}', '${booking.receiptName}')" class="text-blue-600 underline text-xs font-semibold">
                    ${booking.receiptName || 'Ver Comprovativo'}
                </button>
            </td>
            <td class="p-4 space-x-2 whitespace-nowrap">
                <button onclick="approveBooking(${index})" class="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded text-xs font-semibold">Aprovar</button>
                <button onclick="rejectBooking(${index})" class="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded text-xs font-semibold">Rejeitar</button>
            </td>
        `;
        adminTableBody.appendChild(row);
    });
}

function viewReceipt(dataUrl, fileName) {
    const modal = document.getElementById("receipt-modal");
    const contentArea = document.getElementById("modal-content-area");
    
    decodedUrl = decodeURIComponent(dataUrl);
    if (decodedUrl.startsWith("data:image")) {
        contentArea.innerHTML = `<img src="${decodedUrl}" alt="${fileName}" class="max-h-[60vh] rounded border">`;
    } else {
        contentArea.innerHTML = `<p class="text-sm text-slate-600">Ficheiro carregado: <strong>${fileName}</strong></p>`;
    }
    modal.classList.remove("hidden");
}

function closeModal() {
    document.getElementById("receipt-modal").classList.add("hidden");
}

function approveBooking(index) {
    let allBookings = JSON.parse(localStorage.getItem("allBookings")) || [];
    alert(`Consulta de ${allBookings[index].name} aprovada! A equipa será notificada para realizar a marcação presencial na Namíbia.`);
    allBookings.splice(index, 1);
    localStorage.setItem("allBookings", JSON.stringify(allBookings));
    renderAdminTable();
}

function rejectBooking(index) {
    let allBookings = JSON.parse(localStorage.getItem("allBookings")) || [];
    alert(`Comprovativo rejeitado. O registo foi removido para correção pelo paciente.`);
    allBookings.splice(index, 1);
    localStorage.setItem("allBookings", JSON.stringify(allBookings));
    renderAdminTable();
}
