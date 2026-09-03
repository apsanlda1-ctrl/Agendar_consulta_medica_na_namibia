document.addEventListener("DOMContentLoaded", () => {
    const appointmentForm = document.getElementById("appointment-form");
    const paymentForm = document.getElementById("payment-form");
    const checkStatusForm = document.getElementById("check-status-form");
    
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
                    currentBooking.observation = "Comprovativo submetido com sucesso. Aguarde a validação e as instruções da agenda pela equipa.";

                    let allBookings = JSON.parse(localStorage.getItem("allBookings")) || [];
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

    // Consulta de Estado pelo Paciente na Página Principal
    if (checkStatusForm) {
        checkStatusForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const searchName = document.getElementById("check-name").value.trim().toLowerCase();
            const searchPhone = document.getElementById("check-phone").value.trim();

            let allBookings = JSON.parse(localStorage.getItem("allBookings")) || [];
            const found = allBookings.find(b => b.name && b.name.toLowerCase() === searchName && b.phone === searchPhone);

            const resultBox = document.getElementById("status-result-box");
            resultBox.classList.remove("hidden");

            if (found) {
                let badgeColor = "text-amber-600 bg-amber-50 border-amber-200";
                if (found.status === "Aprovado") badgeColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
                if (found.status === "Rejeitado") badgeColor = "text-rose-700 bg-rose-50 border-rose-200";

                resultBox.innerHTML = `
                    <div class="space-y-3 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                        <div class="flex justify-between items-center border-b pb-2">
                            <span class="font-bold text-slate-900 text-base">Paciente: ${found.name}</span>
                            <span class="px-3 py-1 rounded-full text-xs font-bold border ${badgeColor}">${found.status}</span>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-600">
                            <p><strong>Especialidade:</strong> ${found.doctor}</p>
                            <p><strong>Local:</strong> ${found.clinic} (${found.region})</p>
                            <p><strong>Data Pretendida:</strong> ${found.date}</p>
                            <p><strong>Telemóvel:</strong> +244 ${found.phone}</p>
                        </div>
                        <div class="bg-blue-50 p-3 rounded-lg border border-blue-100 mt-2">
                            <p class="text-xs font-bold text-blue-900 mb-1">📋 Resposta e Observação da Agenda (Administração):</p>
                            <p class="text-xs text-slate-700 whitespace-pre-line">${found.observation || 'Ainda sem observações detalhadas da equipa.'}</p>
                        </div>
                    </div>
                `;
            } else {
                resultBox.innerHTML = `<p class="text-rose-600 text-xs font-semibold text-center py-2">Nenhum registo encontrado para este Nome e Telemóvel. Verifique se os dados estão corretos ou se já concluiu a submissão.</p>`;
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
            <td class="p-4 align-top">
                <strong class="text-slate-900">${booking.name}</strong><br>
                <span class="text-xs text-slate-500">+244 ${booking.phone}</span>
            </td>
            <td class="p-4 align-top text-xs text-slate-600">
                <strong>${booking.doctor}</strong><br>
                ${booking.clinic} (${booking.region})<br>
                <span class="text-slate-500">Data: ${booking.date}</span>
            </td>
            <td class="p-4 align-top">
                <button onclick="viewReceipt('${encodeURIComponent(booking.receiptData || '')}', '${booking.receiptName || 'Ficheiro'}')" class="text-blue-600 underline text-xs font-semibold">
                    ${booking.receiptName || 'Ver Ficheiro'}
                </button>
            </td>
            <td class="p-4 align-top">
                <textarea id="obs-${index}" rows="3" class="w-full border border-slate-300 rounded p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Escreva aqui a resposta sobre a agenda, data de atendimento ou instruções...">${booking.observation || ''}</textarea>
            </td>
            <td class="p-4 align-top space-y-2 whitespace-nowrap">
                <button onclick="saveAdminResponse(${index}, 'Aprovado')" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded text-xs font-semibold shadow-sm transition-colors">Aprovar e Enviar Resposta</button>
                <button onclick="saveAdminResponse(${index}, 'Rejeitado')" class="w-full bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded text-xs font-semibold shadow-sm transition-colors">Rejeitar / Pedir Ajuste</button>
                <button onclick="deleteBooking(${index})" class="w-full bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded text-xs font-semibold shadow-sm transition-colors">Eliminar Registo</button>
            </td>
        `;
        adminTableBody.appendChild(row);
    });
}

function saveAdminResponse(index, newStatus) {
    let allBookings = JSON.parse(localStorage.getItem("allBookings")) || [];
    const obsText = document.getElementById(`obs-${index}`).value.trim();

    allBookings[index].status = newStatus;
    allBookings[index].observation = obsText;

    localStorage.setItem("allBookings", JSON.stringify(allBookings));
    alert(`Resposta da agenda e estado (${newStatus}) guardados com sucesso! O paciente já pode consultar esta informação na página principal.`);
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
