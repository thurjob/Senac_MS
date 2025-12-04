//  Navbar
function loadNavbar() {
    const user = DB.currentUser();
    const nav = document.getElementById('navbar-placeholder');
    if (!nav) return;

    let links = '';
    if (user) {
        links = `
            <div class="flex items-center gap-4">
                <span class="hidden md:block text-sm font-bold text-slate-700">${user.name}</span>
                <a href="dashboard.html" class="text-sm font-bold text-slate-600 hover:text-secondary-500">Dashboard</a>
                <button onclick="DB.logout(); window.location.href='index.html'" class="text-sm font-bold text-red-500 hover:text-red-600">Sair</button>
            </div>
        `;
    } else {
        links = `
            <div class="flex items-center gap-3">
                <a href="login.html" class="text-sm font-bold text-slate-600 hover:text-slate-900">Entrar</a>
                <a href="register.html" class="bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition">Criar Conta</a>
            </div>
        `;
    }

    nav.innerHTML = `
        <header class="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
            <div class="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
                <a href="index.html" class="flex items-center gap-2 group">
                    <div class="bg-slate-900 text-white p-2 rounded-lg shadow-lg">
                        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    </div>
                    <span class="text-xl font-extrabold text-slate-900 tracking-tight">Build<span class="text-secondary-500">Pro</span></span>
                </a>
                <nav class="hidden md:flex gap-6 text-sm font-bold text-slate-500">
                    <a href="index.html" class="hover:text-slate-900">Início</a>
                    <a href="marketplace.html" class="hover:text-slate-900">Profissionais</a>
                </nav>
                ${links}
            </div>
        </header>
    `;
}

document.addEventListener('DOMContentLoaded', loadNavbar);
