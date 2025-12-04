// Auth Logic
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

// LOGIN HANDLER
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        const user = DB.login(email, password);
        
        if (user) {
            localStorage.setItem('buildpro_current_user', JSON.stringify(user));
            // Show loading state or feedback if needed
            window.location.href = 'dashboard.html';
        } else {
            alert('Email ou senha incorretos!');
        }
    });
}

// QUICK LOGIN (DEMO)
function quickLogin(email) {
    // For demo purposes, we assume '123' is the password for demo accounts
    const user = DB.login(email, '123');
    if(user) {
        localStorage.setItem('buildpro_current_user', JSON.stringify(user));
        window.location.href = 'dashboard.html';
    } else {
        alert("Erro na conta demo. Tente fazer login manualmente.");
    }
}

// REGISTER HANDLER
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Basic Fields
        const type = document.querySelector('input[name="type"]:checked').value;
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if(!password || password.length < 3) {
            alert("A senha deve ter pelo menos 3 caracteres.");
            return;
        }
        
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password, // Storing plain text for this frontend-only demo
            type,
            avatar: `https://ui-avatars.com/api/?name=${name}&background=random&color=fff`
        };

        // Provider Specific Fields
        if (type === 'PROVIDER') {
            const category = document.getElementById('category').value;
            const hourlyRate = document.getElementById('hourlyRate').value;

            if(!category || !hourlyRate) {
                alert("Preencha todos os campos do perfil profissional.");
                return;
            }

            newUser.category = category;
            newUser.hourlyRate = hourlyRate;
            newUser.bio = `Olá, sou ${name}, especialista em serviços de ${category}.`;
            newUser.rating = 5.0; // New users start with 5 stars for encouragement in this demo
            newUser.reviewCount = 0;
            newUser.portfolio = []; 
        }

        try {
            DB.register(newUser);
            
            // Auto-login after register
            localStorage.setItem('buildpro_current_user', JSON.stringify(newUser));
            
            alert("Conta criada com sucesso!");
            window.location.href = 'dashboard.html';
        } catch (err) {
            alert(err.message);
        }
    });
}