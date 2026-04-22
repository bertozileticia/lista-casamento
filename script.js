// Cole aqui o "URL do app da Web" que o Google vai gerar após você implantar o Apps Script
const api_url = 'https://script.google.com/macros/s/AKfycbw9IeWBggohg9-SrUf4m01topCrcY1qHvafSH1iJU9W-6k-JPqJ9Ccb60GxLtgjQpIf/exec'; 

async function carregarPresentes() {
    const resposta = await fetch(api_url);
    const dados = await resposta.json();
    
    const container = document.getElementById('lista-presentes');
    container.innerHTML = ''; 

    dados.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card-presente';
        
        // Ajustado para ler o 'p' minúsculo
        const estaReservado = item.Comprado_por && item.Comprado_por.trim() !== '';

        card.innerHTML = `
            <img src="${item.Imagem_URL}" alt="${item.Item}">
            <h3>${item.Item}</h3>
            <a href="${item.Link_Sugestao}" target="_blank">Ver sugestão de onde comprar</a>
            
            ${estaReservado 
                ? `<p class="reservado">Reservado por: ${item.Comprado_por}</p>` 
                : `<div class="reserva-form">
                     <input type="text" id="nome-${item.ID}" placeholder="Seu nome">
                     <button onclick="reservarItem('${item.ID}')">Confirmar Presente</button>
                   </div>`
            }
        `;
        container.appendChild(card);
    });
}

async function reservarItem(id) {
    const nome = document.getElementById(`nome-${id}`).value;
    if (!nome) return alert("Por favor, digite seu nome.");

    const payload = {
        "ID": id,
        "Comprado_por": nome // Ajustado para enviar com 'p' minúsculo
    };

    // O Google Apps Script recebe requisições POST para atualização
    const resposta = await fetch(api_url, {
        method: 'POST',
        body: JSON.stringify(payload)
    });

    if (resposta.ok) {
        alert("Obrigado! Presente reservado com sucesso.");
        carregarPresentes(); 
    } else {
        alert("Houve um erro ao reservar. Tente novamente.");
    }
}

carregarPresentes();