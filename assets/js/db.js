
const STORAGE_KEYS = {
    USERS: 'buildpro_users',
    REQUESTS: 'buildpro_requests',
    MESSAGES: 'buildpro_messages',
    CURRENT_USER: 'buildpro_current_user'
};

const SEED_PROVIDERS = [
    {
      id: 'p1', name: 'Carlos Silva', email: 'carlos@example.com', password: '123', type: 'PROVIDER', category: 'Pedreiro',
      location: 'São Paulo, SP', hourlyRate: 80, rating: 4.8, reviewCount: 12,
      bio: 'Especialista em alvenaria e acabamentos com 15 anos de experiência.',
      avatar: 'https://ui-avatars.com/api/?name=Carlos+Silva&background=0D8ABC&color=fff',
      portfolio: ['https://images.unsplash.com/photo-1581094794329-cd1096d7a43f?w=400', 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400']
    },
    {
      id: 'p2', name: 'Ana Souza', email: 'ana@example.com', password: '123', type: 'PROVIDER', category: 'Eletricista',
      location: 'Rio de Janeiro, RJ', hourlyRate: 120, rating: 5.0, reviewCount: 8,
      bio: 'Instalações elétricas residenciais e prediais. Certificada NR-10.',
      avatar: 'https://ui-avatars.com/api/?name=Ana+Souza&background=F59E0B&color=fff',
      portfolio: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400']
    },
    {
        id: 'c1', name: 'Maria Cliente', email: 'maria@example.com', password: '123', type: 'CLIENT', 
        avatar: 'https://ui-avatars.com/api/?name=Maria+Cliente&background=10B981&color=fff'
    }
];

const DB = {
    init() {
        if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_PROVIDERS));
        }
    },

    getUsers() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    },

    saveUsers(users) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    },

    login(email, password) {
        const users = this.getUsers();
        return users.find(u => u.email === email && u.password === password);
    },

    register(user) {
        const users = this.getUsers();
        if (users.find(u => u.email === user.email)) throw new Error('Este email já está cadastrado.');
        users.push(user);
        this.saveUsers(users);
        return user;
    },

    getProviders(category, query) {
        let users = this.getUsers().filter(u => u.type === 'PROVIDER');
        if (category) users = users.filter(u => u.category === category);
        if (query) {
            const q = query.toLowerCase();
            users = users.filter(u => u.name.toLowerCase().includes(q) || u.bio.toLowerCase().includes(q));
        }
        return users;
    },

    getRequests(userId, type) {
        const reqs = JSON.parse(localStorage.getItem(STORAGE_KEYS.REQUESTS) || '[]');
        if (type === 'CLIENT') return reqs.filter(r => r.clientId === userId);
        return reqs.filter(r => r.providerId === userId);
    },

    createRequest(req) {
        const reqs = JSON.parse(localStorage.getItem(STORAGE_KEYS.REQUESTS) || '[]');
        reqs.push(req);
        localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(reqs));
    },

    updateRequestStatus(id, status) {
        const reqs = JSON.parse(localStorage.getItem(STORAGE_KEYS.REQUESTS) || '[]');
        const idx = reqs.findIndex(r => r.id === id);
        if (idx !== -1) {
            reqs[idx].status = status;
            localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(reqs));
        }
    },

    getMessages(reqId) {
        const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES) || '[]');
        return all.filter(m => m.requestId === reqId).sort((a,b) => a.timestamp - b.timestamp);
    },

    sendMessage(msg) {
        const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES) || '[]');
        all.push(msg);
        localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(all));
    },

    currentUser() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER));
    },

    logout() {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
};

// Iniciar DB 
DB.init();