// Marketplace
const urlParams = new URLSearchParams(window.location.search);
const initialCat = urlParams.get('cat');
const initialQuery = urlParams.get('q');

if(initialCat) document.getElementById('filter-cat').value = initialCat;
if(initialQuery) document.getElementById('filter-search').value = initialQuery;

let selectedProvider = null;

function renderProviders() {
    const cat = document.getElementById('filter-cat').value;
    const query = document.getElementById('filter-search').value;
    const providers = DB.getProviders(cat, query);
    const grid = document.getElementById('providers-grid');
    
    grid.innerHTML = providers.map(p => `
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all group">
            <div class="h-24 bg-slate-900 relative">
                 <div class="absolute top-4 right-4 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Verificado</div>
            </div>
            <div class="px-6 relative">
                <img src="${p.avatar}" class="w-20 h-20 rounded-2xl border-4 border-white absolute -top-10 shadow-md">
                <div class="pt-12 mb-4">
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="font-bold text-lg text-slate-900">${p.name}</h3>
                            <div class="text-secondary-600 text-xs font-bold uppercase">${p.category}</div>
                        </div>
                        <div class="text-right">
                             <div class="text-lg font-bold">R$ ${p.hourlyRate}<span class="text-xs text-slate-400 font-normal">/h</span></div>
                        </div>
                    </div>
                    <p class="text-sm text-slate-500 mt-2 line-clamp-2">${p.bio}</p>
                </div>
                <button onclick="openQuoteModal('${p.id}')" class="w-full mb-6 bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition shadow-lg shadow-slate-900/10">Solicitar Orçamento</button>
            </div>
        </div>
    `).join('');
    
    if(providers.length === 0) {
        grid.innerHTML = '<div class="col-span-2 text-center py-20 text-slate-400">Nenhum profissional encontrado.</div>';
    }
}

window.openQuoteModal = (id) => {
    const user = DB.currentUser();
    if(!user) {
        alert('Faça login para continuar.');
        window.location.href = 'login.html';
        return;
    }
    if(user.type === 'PROVIDER') {
        alert('Apenas clientes podem solicitar serviços.');
        return;
    }
    
    const p = DB.getUsers().find(u => u.id === id);
    selectedProvider = p;
    document.getElementById('modal-provider-name').innerText = p.name;
    document.getElementById('quote-modal').classList.remove('hidden');
    document.getElementById('quote-modal').classList.add('flex');
};

window.closeQuoteModal = () => {
    document.getElementById('quote-modal').classList.add('hidden');
    document.getElementById('quote-modal').classList.remove('flex');
};

window.submitQuote = () => {
    const desc = document.getElementById('quote-desc').value;
    if(!desc) return alert('Descreva o pedido.');
    
    const user = DB.currentUser();
    DB.createRequest({
        id: Date.now().toString(),
        clientId: user.id,
        providerId: selectedProvider.id,
        clientName: user.name,
        providerName: selectedProvider.name,
        title: `Serviço para ${selectedProvider.category}`,
        description: desc,
        status: 'PENDING',
        createdAt: Date.now()
    });
    
    alert('Solicitação enviada!');
    closeQuoteModal();
    window.location.href = 'dashboard.html';
};

renderProviders();
