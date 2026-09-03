document.addEventListener("DOMContentLoaded", () => {
    const appointmentForm = document.getElementById("appointment-form");
    const paymentForm = document.getElementById("payment-form");
    const checkStatusForm = document.getElementById("check-status-form");
    
    // Garante que o objeto temporário existe no localStorage
    if (!localStorage.getItem("currentBooking")) {
        localStorage.setItem("currentBooking", JSON.stringify({}));
    }

    if (appointmentForm) {
        appointmentForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const newBooking = {
                id: Date.now(),
                name: document.getElementById("patient-name").value.trim(),
                phone: document.getElementById("patient-phone").value.trim(),
                region: document.getElementById("region-select").value,
                clinic: document.getElementById("clinic-select").value,
                doctor: document.getElementById("doctor-select").value,
                date: document.getElementById("appointment-date").value,
                total: "600 NAD (37.000 Kz)",
                status: "A aguardar validação",
                observation: "O seu talão foi submetido e está a ser verificado pela nossa equipa.",
                receiptName: "",
                receiptData: ""
            };

            localStorage.setItem("currentBooking", JSON.stringify(newBooking));

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
                    let currentBooking = JSON.parse(localStorage.getItem("currentBooking")) || {};
                    
                    currentBooking.receiptName = file.name;
                    currentBooking.receiptData = uploadEvent.target.result;
                    currentBooking.status = "A aguardar validação";
                    currentBooking.observation = "Comprovativo recebido. Aguarde a validação da equipa (até 1 hora).";

                    // Insere de imediato na lista global de marcações do painel admin
                    let allBookings = JSON.parse(localStorage.getItem("allBookings")) || [];
                    
                    // Verifica se já existe pelo ID para evitar duplicados, senão adiciona
                    const existingIndex = allBookings.findIndex(b => b.id === currentBooking.id);
                    if (existingIndex >= 0) {
                        allBookings[existingIndex] = currentBooking;
                    } else {
                        allBookings.push(currentBooking);
                    }

                    localStorage.setItem("allBookings", JSON.stringify(allBookings));
                    localStorage.setItem("currentBooking", JSON.stringify(currentBooking));

                    document.getElementById("payment-section").classList.add("hidden");
                    document.getElementById("status-section").classList.remove("hidden");
                };

                reader.readAsDataURL(file);
            }
        });
    }

    // Consulta de Estado pelo Paciente (Nome e Telemóvel)
    if (checkStatusForm) {
        checkStatusForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const searchName = document.getElementById("check-name").value.trim().toLowerCase();
            const searchPhone = document.getElementById("check-phone").value.trim();

            let allBookings = JSON.parse(localStorage.getItem("allBookings")) || [];
            
            // Procura o registo correspondente na base de dados global
            const found = allBookings.find(b => b.name && b.name.toLowerCase() === searchName && b.phone === searchPhone);

            const resultBox = document.getElementById("status-result-box");
            resultBox.classList.remove("hidden");

            if (found) {
                let badgeColor = "text-amber-600 bg-amber-50 border-amber-200";
                if (found.status === "Aprovado") badgeColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
                if (found.status === "Rejeitado") badgeColor = "text-rose-700 bg-rose-50 border-rose-200";

                resultBox.innerHTML = `
                    <div class="space-y-2">
                        <div class="flex justify-between items-center border-b pb-2">
                            <span class="font-bold text-slate-800">Paciente: ${found.name}</span>
                            <span class="px-3 py-1 rounded-full text-xs font-bold border ${badgeColor}">${found.status}</span>
                        </div>
                        <p class="text-xs text-slate-600"><strong>Médico / Clínica:</strong> ${found.doctor} — ${found.clinic} (${found.region})</p>
                        <p class="text-xs text-slate-600"><strong>Data da Consulta:</strong> ${found.date}</p>
                        <div class="bg-slate-50 p-3 rounded border border-slate-200 mt-2">
                            <p class="text-xs font-semibold text-slate-700">Observação da Equipa APSAN:</p>
                            <p class="text-xs text-slate-600 mt-1">${found.observation || 'Sem observações adicionais.'}</p>
                        </div>
                    </div>
                `;
            } else {
                resultBox.innerHTML = `<p class="text-rose-600 text-xs font-semibold text-center">Nenhuma marcação encontrada com este Nome e Telemóvel. Verifique se concluiu a submissão do comprovativo.</p>`;
            }
        });
    }

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
            <td class="p-4">
                <strong class="text-slate-900">${booking.name}</strong><br>
                <span class="text-xs text-slate-500">+244 ${booking.phone}</span>
            </td>
            <td class="p-4 text-xs text-slate-600">
                <strong>${booking.doctor}</strong><br>
                ${booking.clinic} (${booking.region})
            </td>
            <td class="p-4 text-xs text-slate-600 font-medium">${booking.date}</td>
            <td class="p-4">
                <button onclick="viewReceipt('${encodeURIComponent(booking.receiptData || '')}', '${booking.receiptName || 'Ficheiro'}')" class="text-blue-600 underline text-xs font-semibold">
                    ${booking.receiptName || 'Ver Ficheiro'}
                </button>
            </td>
            <td class="p-4">
                <textarea id="obs-${index}" rows="2" class="w-full border border-slate-300 rounded p-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none" placeholder="Escreva aqui a observação...">${booking.observation || ''}</textarea>
            </td>
            <td class="p-4 space-y-1 whitespace-nowrap">
                <button onclick="updateStatus(${index}, 'Aprovado')" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 rounded text-xs font-semibold">Aprovar</button>
                <button onclick="updateStatus(${index}, 'Rejeitado')" class="w-full bg-amber-600 hover:bg-amber-700 text-white px-2 py-1 rounded text-xs font-semibold">Rejeitar</button>
                <button onclick="deleteBooking(${index})" class="w-full bg-rose-600 hover:bg-rose-700 text-white px-2 py-1 rounded text-xs font-semibold">Eliminar</button>
            </td>
        `;
        adminTableBody.appendChild(row);
    });
}

function updateStatus(index, newStatus) {
    let allBookings = JSON.parse(localStorage.getItem("allBookings")) || [];
    const obsText = document.getElementById(`obs-${index}`).value;

    allBookings[index].status = newStatus;
    allBookings[index].observation = obsText;

    localStorage.setItem("allBookings", JSON.stringify(allBookings));
    alert(`Estado alterado para "${newStatus}" com sucesso! A observação e o estado já estão disponíveis para consulta pelo paciente.`);
    renderAdminTable();
}

function viewReceipt(dataUrl, fileName) {
    const modal = document.getElementById("receipt-modal");
    const contentArea = document.getElementById("modal-content-area");
    
    if (!dataUrl || dataUrl === "undefined") {
        contentArea.innerHTML = `<p class="text-sm text-slate-600">Nenhum ficheiro carregado.</p>`;
        modal.classList.remove("hidden");
        return;
    }

    const decodedUrl = decodeURIComponent(dataUrl);
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

function deleteBooking(index) {
    if (confirm("Tem certeza que deseja eliminar permanentemente este registo?")) {
        let allBookings = JSON.parse(localStorage.getItem("allBookings")) || [];
        allBookings.splice(index, 1);
        localStorage.setItem("allBookings", JSON.stringify(allBookings));
        renderAdminTable();
    }
}

function exportToPDF() {
    let allBookings = JSON.parse(localStorage.getItem("allBookings")) || [];
    if (allBookings.length === 0) {
        alert("Não existem dados para exportar.");
        return;
    }
    window.print();
}
