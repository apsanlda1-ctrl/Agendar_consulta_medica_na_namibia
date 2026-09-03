document.addEventListener("DOMContentLoaded", () => {
    const appointmentForm = document.getElementById("appointment-form");
    const paymentForm = document.getElementById("payment-form");
    
    // Armazenamento temporário de dados na sessão do browser (LocalStorage)
    let currentBooking = JSON.parse(localStorage.getItem("currentBooking")) || {};

    if (appointmentForm) {
        appointmentForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            currentBooking = {
                id: Date.now(),
                name: document.getElementById("patient-name").value,
                phone: document.getElementById("patient-phone").value,
                doctor: document.getElementById("doctor-select").value,
                date: document.getElementById("appointment-date").value,
                status: "Pendente"
            };

            localStorage.setItem("currentBooking", JSON.stringify(currentBooking));

            // Transição de ecrã no frontend
            document.getElementById("booking-section").classList.add("hidden");
            document.getElementById("payment-section").classList.remove("hidden");
        });
    }

    if (paymentForm) {
        paymentForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const fileInput = document.getElementById("receipt-file");
            
            if (fileInput.files.length > 0) {
                // Guardamos o nome do ficheiro simulando o talão
                currentBooking.receipt = fileInput.files[0].name;
                currentBooking.status = "A aguardar validação";

                // Salvar na lista geral de marcações do admin
                let allBookings = JSON.parse(localStorage.getItem("allBookings")) || [];
                allBookings.push(currentBooking);
                localStorage.setItem("allBookings", JSON.stringify(allBookings));

                // Mudar para o estado final de espera
                document.getElementById("payment-section").classList.add("hidden");
                document.getElementById("status-section").classList.remove("hidden");
            }
        });
    }

    // Lógica do Painel Administrativo
    const adminTableBody = document.getElementById("admin-table-body");
    if (adminTableBody) {
        renderAdminTable();
    }
});

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
            <td class="p-4 text-slate-600">${booking.phone}</td>
            <td class="p-4 text-slate-600">${booking.doctor}</td>
            <td class="p-4 text-slate-600">${booking.date}</td>
            <td class="p-4"><span class="text-blue-600 underline text-xs font-semibold cursor-pointer">${booking.receipt || 'Ver Ficheiro'}</span></td>
            <td class="p-4 space-x-2">
                <button onclick="approveBooking(${index})" class="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded text-xs font-semibold">Aprovar</button>
                <button onclick="rejectBooking(${index})" class="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded text-xs font-semibold">Rejeitar</button>
            </td>
        `;
        adminTableBody.appendChild(row);
    });
}

function approveBooking(index) {
    let allBookings = JSON.parse(localStorage.getItem("allBookings")) || [];
    alert(`Consulta de ${allBookings[index].name} aprovada com sucesso! O sistema dispararia o SMS/WhatsApp de confirmação.`);
    allBookings.splice(index, 1);
    localStorage.setItem("allBookings", JSON.stringify(allBookings));
    renderAdminTable();
}

function rejectBooking(index) {
    let allBookings = JSON.parse(localStorage.getItem("allBookings")) || [];
    alert(`Comprovativo rejeitado. Será solicitado um novo talão ao paciente.`);
    allBookings.splice(index, 1);
    localStorage.setItem("allBookings", JSON.stringify(allBookings));
    renderAdminTable();
}
