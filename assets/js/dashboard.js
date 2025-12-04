// Dashboard Logic
const user = DB.currentUser();
if (!user) window.location.href = 'login.html';

// Setup User Info
document.getElementById('user-name').innerText = user.name;
document.getElementById('user-role').innerText = user.type === 'CLIENT' ? 'Cliente' : `Profissional • ${user.category}`;
document.getElementById('user-avatar').src = user.avatar;

// Tab Switching
window.switchTab = (tabId) => {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => {
        el.classList.remove('bg-slate-900', 'text-white');
        el.classList.add('text-slate-500', 'hover:bg-slate-50');
    });
    
    document.getElementById(`tab-${tabId}`).classList.add('active');
    const btn = document.querySelector(`button[data-tab="${tabId}"]`);
    if(btn) {
        btn.classList.remove('text-slate-500', 'hover:bg-slate-50');
        btn.classList.add('bg-slate-900', 'text-white');
    }
    
    loadData();
};

function loadData() {
    const requests = DB.getRequests(user.id, user.type);
    
    // Stats
    const active = requests.filter(r => r.status === 'NEGOTIATING' || r.status === 'IN_PROGRESS').length;
    const pending = requests.filter(r => r.status === 'PENDING').length;
    const completed = requests.filter(r => r.status === 'COMPLETED').length;
    
    document.getElementById('stat-active').innerText = active;
    document.getElementById('stat-pending').innerText = pending;
    document.getElementById('stat-completed').innerText = completed;

    // Render Lists
    const listContainer = document.getElementById('requests-list');
    const recentContainer = document.getElementById('recent-activity-list');
    
    listContainer.innerHTML = '';
    recentContainer.innerHTML = '';

    requests.forEach(req => {
        const card = createRequestCard(req);
        listContainer.appendChild(card);
        // Add only first 3 to recent
        if (recentContainer.children.length < 3) {
            const recentCard = card.cloneNode(true);
            recentContainer.appendChild(recentCard);
        }
    });

    if (requests.length === 0) {
        listContainer.innerHTML = '<div class="text-center text-slate-400 py-10">Nenhuma solicitação encontrada.</div>';
    }
}

function createRequestCard(req) {
    const div = document.createElement('div');
    div.className = 'bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-4 hover:border-secondary-500 transition-colors';
    
    const statusColors = {
        'PENDING': 'bg-amber-100 text-amber-700',
        'NEGOTIATING': 'bg-blue-100 text-blue-700',
        'IN_PROGRESS': 'bg-purple-100 text-purple-700',
        'COMPLETED': 'bg-emerald-100 text-emerald-700'
    };

    const labels = {
        'PENDING': 'Aguardando',
        'NEGOTIATING': 'Em Negociação',
        'IN_PROGRESS': 'Em Andamento',
        'COMPLETED': 'Concluído'
    };

    const otherName = user.type === 'CLIENT' ? req.providerName : req.clientName;

    div.innerHTML = `
        <div class="flex justify-between items-start mb-4">
            <div>
                <span class="text-xs font-bold px-2 py-1 rounded-full ${statusColors[req.status]} uppercase tracking-wider">${labels[req.status]}</span>
                <h3 class="text-lg font-bold text-slate-900 mt-2">${req.title}</h3>
                <p class="text-sm text-slate-500">Com: ${otherName}</p>
            </div>
            <button onclick="openChat('${req.id}')" class="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold text-sm">Chat</button>
        </div>
        <div class="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
            "${req.description}"
        </div>
        ${getActionButtons(req)}
    `;
    return div;
}

function getActionButtons(req) {
    if (user.type !== 'PROVIDER') return '';
    let btn = '';
    if (req.status === 'PENDING') {
        btn = `<button onclick="updateStatus('${req.id}', 'NEGOTIATING')" class="mt-4 w-full bg-emerald-500 text-white font-bold py-2 rounded-lg hover:bg-emerald-600">Aceitar Pedido</button>`;
    } else if (req.status === 'NEGOTIATING') {
        btn = `<button onclick="updateStatus('${req.id}', 'IN_PROGRESS')" class="mt-4 w-full bg-blue-500 text-white font-bold py-2 rounded-lg hover:bg-blue-600">Iniciar Serviço</button>`;
    } else if (req.status === 'IN_PROGRESS') {
        btn = `<button onclick="updateStatus('${req.id}', 'COMPLETED')" class="mt-4 w-full bg-green-600 text-white font-bold py-2 rounded-lg hover:bg-green-700">Concluir Serviço</button>`;
    }
    return btn;
}

window.updateStatus = (id, status) => {
    DB.updateRequestStatus(id, status);
    loadData();
};

// Chat Logic
let currentReqId = null;
let chatInterval = null;

window.openChat = (reqId) => {
    currentReqId = reqId;
    const req = DB.getRequests(user.id, user.type).find(r => r.id === reqId);
    document.getElementById('chat-title').innerText = req.title;
    document.getElementById('chat-modal').classList.remove('hidden');
    document.getElementById('chat-modal').classList.add('flex');
    loadMessages();
    chatInterval = setInterval(loadMessages, 2000);
};

window.closeChat = () => {
    document.getElementById('chat-modal').classList.add('hidden');
    document.getElementById('chat-modal').classList.remove('flex');
    clearInterval(chatInterval);
};

function loadMessages() {
    const msgs = DB.getMessages(currentReqId);
    const container = document.getElementById('chat-messages');
    container.innerHTML = msgs.map(m => `
        <div class="flex ${m.senderId === user.id ? 'justify-end' : 'justify-start'}">
            <div class="${m.senderId === user.id ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200'} p-3 rounded-lg max-w-[80%] text-sm">
                ${m.text}
            </div>
        </div>
    `).join('');
}

window.sendMessage = () => {
    const txt = document.getElementById('chat-input').value;
    if (!txt) return;
    DB.sendMessage({
        id: Date.now().toString(),
        requestId: currentReqId,
        senderId: user.id,
        text: txt,
        timestamp: Date.now()
    });
    document.getElementById('chat-input').value = '';
    loadMessages();
};

// Initial Load
loadData();
