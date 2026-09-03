let paymentTimerInterval = null;

document.addEventListener("DOMContentLoaded", () => {
    const appointmentForm = document.getElementById("appointment-form");
    const paymentForm = document.getElementById("payment-form");
    const checkStatusForm = document.getElementById("check-status-form");
    
    if (!localStorage.getItem("currentBooking")) {
        localStorage.setItem("currentBooking", JSON.stringify({}));
    }

    // Passo 1: Submeter dados do agendamento
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

            startPaymentTimer(2700);
        });
    }

    // Passo 2: Submeter o comprovativo de pagamento (Corrigido para garantir avanço imediato)
    if (paymentForm) {
        paymentForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const fileInput = document.getElementById("receipt-file");
            let currentBooking = JSON.parse(localStorage.getItem("currentBooking")) || {};
            
            if (paymentTimerInterval) clearInterval(paymentTimerInterval);

            // Função interna para guardar e avançar o ecrã
            const finalizeSubmission = (fileName, fileData) => {
                currentBooking.receiptName = fileName;
                currentBooking.receiptData = fileData;
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

                // Esconde a secção de pagamento e mostra a de sucesso
                document.getElementById("payment-section").classList.add("hidden");
                document.getElementById("status-section").classList.remove("hidden");
            };

            // Se o utilizador escolheu um ficheiro, tenta ler. Se falhar ou não houver, avança na mesma.
            if (fileInput && fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const reader = new FileReader();

                reader.onload = function(uploadEvent) {
                    finalizeSubmission(file.name, uploadEvent.target.result);
                };

                reader.onerror = function() {
                    finalizeSubmission(file.name, "");
                };

                try {
                    reader.readAsDataURL(file);
                } catch (err) {
                    finalizeSubmission(file.name, "");
                }
            } else {
                finalizeSubmission("Comprovativo Digital", "");
            }
        });
    }

    // Consulta de Estado pelo Paciente
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
                            <p class="text-xs font-bold text-blue-900 mb-1">📋 Mensagem / Observação da Equipa APSAN:</p>
                            <p class="text-xs text-slate-700 whitespace-pre-line">${found.observation || 'Ainda sem observações detalhadas da equipa.'}</p>
                        </div>
                    </div>
                `;
            } else {
                resultBox.innerHTML = `<p class="text-rose-600 text-xs font-semibold text-center py-2">Nenhum registo encontrado para este Nome e Telemóvel. Verifique se os dados estão corretos.</p>`;
            }
        });
    }

    if (document.getElementById("admin-table-body")) {
        renderAdminTable();
    }
});

// Temporizador Regressivo Dinâmico (45 minutos)
function startPaymentTimer(durationInSeconds) {
    let timer = durationInSeconds;
    const display = document.getElementById("timer-display");

    if (paymentTimerInterval) clearInterval(paymentTimerInterval);

    paymentTimerInterval = setInterval(() => {
        let minutes = parseInt(timer / 60, 10);
        let seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        if (display) {
            display.textContent = minutes + ":" + seconds;
        }

        if (--timer < 0) {
            clearInterval(paymentTimerInterval);
            alert("O tempo limite de 45 minutos para efetuar o pagamento expirou. O formulário foi reiniciado.");
            localStorage.removeItem("currentBooking");
            location.reload();
        }
    }, 1000);
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
                <button type="button" onclick="viewReceipt('${encodeURIComponent(booking.receiptData || '')}', '${booking.receiptName || 'Ficheiro'}')" class="text-blue-600 underline text-xs font-semibold">
                    ${booking.receiptName || 'Ver Ficheiro'}
                </button>
            </td>
            <td class="p-4 align-top">
                <textarea id="obs-${index}" rows="3" class="w-full border border-slate-300 rounded p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Escreva aqui a mensagem ou instrução para o paciente...">${booking.observation || ''}</textarea>
            </td>
            <td class="p-4 align-top space-y-2 whitespace-nowrap">
                <button type="button" onclick="saveAdminResponse(${index}, 'Aprovado')" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded text-xs font-semibold shadow-sm transition-colors">Aprovar e Enviar</button>
                <button type="button" onclick="saveAdminResponse(${index}, 'Rejeitado')" class="w-full bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded text-xs font-semibold shadow-sm transition-colors">Rejeitar / Ajustar</button>
                <button type="button" onclick="deleteBooking(${index})" class="w-full bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded text-xs font-semibold shadow-sm transition-colors">Eliminar</button>
            </td>
        `;
        adminTableBody.appendChild(row);
    });
}

function saveAdminResponse(index, newStatus) {
    let allBookings = JSON.parse(localStorage.getItem("allBookings")) || [];
    const obsTextNode = document.getElementById(`obs-${index}`);
    
    if (obsTextNode) {
        const obsText = obsTextNode.value.trim();
        allBookings[index].status = newStatus;
        allBookings[index].observation = obsText;

        localStorage.setItem("allBookings", JSON.stringify(allBookings));
        alert(`Mensagem e estado (${newStatus}) guardados com sucesso! O paciente já pode consultá-los no site.`);
        renderAdminTable();
    } else {
        alert("Erro ao localizar o campo de texto da observação.");
    }
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
