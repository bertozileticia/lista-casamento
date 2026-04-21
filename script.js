const api_url = 'https://sheetdb.io/api/v1/b9ukia6xl96sz';

// Função para carregar os presentes
async function carregarPresentes() {
    const resposta = await fetch(api_url);
    const dados = await resposta.json();
    
    const container = document.getElementById('lista-presentes');
    container.innerHTML = ''; // Limpa a lista antes de carregar

    dados.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card-presente';
        
        // Lógica: se já tiver comprador, mostramos como reservado
        const estaReservado = item.Comprado_Por && item.Comprado_Por.trim() !== '';

        card.innerHTML = `
            <img src="${item.Imagem_URL}" alt="${item.Item}">
            <h3>${item.Item}</h3>
            <a href="${item.Link_Sugestao}" target="_blank">Ver sugestão de onde comprar</a>
            
            ${estaReservado 
                ? `<p class="reservado">Reservado por: ${item.Comprado_Por}</p>` 
                : `<div class="reserva-form">
                     <input type="text" id="nome-${item.ID}" placeholder="Teu nome">
                     <button onclick="reservarItem('${item.ID}')">Confirmar Presente</button>
                   </div>`
            }
        `;
        container.appendChild(card);
    });
}

// Função para atualizar a planilha (Reservar)
async function reservarItem(id) {
    const nome = document.getElementById(`nome-${id}`).value;
    if (!nome) return alert("Por favor, digita o teu nome.");

    const payload = {
        data: {
            "Comprado_Por": nome,
            "Status": "RESERVADO"
        }
    };

    const resposta = await fetch(`${api_url}/ID/${id}`, {
        method: 'PATCH', // Usamos PATCH para atualizar apenas colunas específicas
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (resposta.ok) {
        alert("Obrigado! Presente reservado com sucesso.");
        carregarPresentes(); // Recarrega a lista
    }
}

carregarPresentes();