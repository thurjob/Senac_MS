// Auth 
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

// LOGIN 
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        const user = DB.login(email, password);
        
        if (user) {
            localStorage.setItem('buildpro_current_user', JSON.stringify(user));
            window.location.href = 'dashboard.html';
        } else {
            alert('Email ou senha incorretos!');
        }
    });
}

//  LOGIN (DEMO)
function quickLogin(email) {
    const user = DB.login(email, '123');
    if(user) {
        localStorage.setItem('buildpro_current_user', JSON.stringify(user));
        window.location.href = 'dashboard.html';
    } else {
        alert("Erro na conta demo. Tente fazer login manualmente.");
    }
}

// REGISTER 
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
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
            password,
            type,
            avatar: `https://ui-avatars.com/api/?name=${name}&background=random&color=fff`
        };

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
            newUser.rating = 5.0;
            newUser.reviewCount = 0;
            newUser.portfolio = []; 
        }

        try {
            DB.register(newUser);
            
            // Auto-login 
            localStorage.setItem('buildpro_current_user', JSON.stringify(newUser));
            
            alert("Conta criada com sucesso!");
            window.location.href = 'dashboard.html';
        } catch (err) {
            alert(err.message);
        }
    });
}