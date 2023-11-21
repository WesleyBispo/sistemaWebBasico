import ValidaUsuarioExistente from "./ValidaUsuarioExistente.js";

class ValidaLogin {
    constructor() {
        this.form = document.querySelector('.formulario');
        this.validaUsuarioExistente = new ValidaUsuarioExistente();
        this.eventos();
    }

    eventos() {
        this.form.addEventListener('submit', (evento) => {
            this.handleSubmit(evento);
        });
    }

    handleSubmit(evento) {
        evento.preventDefault();

        const campoSenha = this.form.querySelector('#campoSenha');
        const campoCPF = this.form.querySelector('#campoCPF');

        if (!this.camposPreenchidos(campoCPF, campoSenha)) {
            this.criaErro(null, "Por favor, preencha todos os campos.", "alert");
            return;
        }

        const usuario = this.validaUsuarioExistente.obterUsuarioPorCPF(campoCPF.value);

        if (!usuario) {
            this.criaErro(campoCPF, "CPF não encontrado. Por favor, verifique o CPF digitado.", "erro");
        } else {
            if (usuario.senha === campoSenha.value) {
                if (this.validaUsuarioExistente.verificarConcluiuPagamento(campoCPF.value)) {
                    alert(`Bem-vindo, ${usuario.nome}! Redirecionando para a página do participante...`);
                    this.redirecionarParaPaginaParticipante();
                } else {
                    console.log(usuario)
                    alert('Seu cadastro não foi computado. Por favor, volte ao início e refaça o cadastro.');
                    //this.validaUsuarioExistente.destruirUsuarioPorCPF(usuario.cpf);
                   // this.redirecionarParaPaginaCadastro();
                }
            } else {
                this.criaErro(campoSenha, "Senha incorreta. Por favor, verifique a senha digitada.", "erro");
            }
        }
    }


    camposPreenchidos(...campos) {
        for (const campo of campos) {
            if (!campo || campo.value.trim() === '') {
                this.criaErro(campo, "Por favor, preencha este campo.", "erro");
                return false;
            }
        }
        return true;
    }

    criaErro(campo, mensagem, tipo = 'alert') {
        if (campo) {
            const divErro = campo.nextElementSibling;

            // Remove erro anterior se existir
            if (divErro && divErro.classList.contains('error-text', "alert")) {
                divErro.remove();
            }

            const div = document.createElement('div');
            div.innerHTML = mensagem;
            div.classList.add('error-text', "alert");
            div.classList.add(tipo);

            campo.insertAdjacentElement('afterend', div); // Insere após o campo
        }
    }


    redirecionarParaPaginaParticipante() {
    
        const scripts = document.querySelectorAll('script');
        const currentScript = scripts[scripts.length - 1];

        // Obtém o caminho do diretório do script
        const currentScriptDirectory = currentScript.src ? currentScript.src.substring(0, currentScript.src.lastIndexOf('/')) : '';

        const participantePagePath = `${currentScriptDirectory}/../paginaParticipante.html`;
        window.location.href = participantePagePath;
    }


    redirecionarParaPaginaCadastro() {
        const scripts = document.querySelectorAll('script');
        const currentScript = scripts[scripts.length - 1];

        // Obtém o caminho do diretório do script
        const currentScriptDirectory = currentScript.src ? currentScript.src.substring(0, currentScript.src.lastIndexOf('/')) : '';

        const cadastroPagePath = `${currentScriptDirectory}/../cadastro.html`;
        window.location.href = cadastroPagePath;
    }
}



const validaLogin = new ValidaLogin();
