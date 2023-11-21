import ValidaCPF from "./validaCpf.js";
import ValidaUsuarioExistente from "./ValidaUsuarioExistente.js";

class ValidaForm {
    constructor() {
        this.form = document.querySelector('.formulario');
        this.validaUsuarioExistente = new ValidaUsuarioExistente(this.gerarIdAleatorio);
        this.usuario = { alunoFipp: true };
        this.naoRetrocedaPage()
        this.eventos();
    }

    gerarIdAleatorio() {
        // Lógica simples para gerar um ID aleatório único
        return Math.floor(Math.random() * 100000000);
    }

    eventos() {
        this.form.addEventListener('submit', (evento) => {
            this.handleSubmit(evento);
        });

        // Adiciona um evento de change para o campo que pergunta se é aluno da FIPP
        const radioGroup = this.form.querySelector('.radio-group');
        radioGroup.addEventListener('change', () => {
            this.handleFippRadioChange();
        });
    }

    handleFippRadioChange() {
        const fippDetails = document.getElementById('fippDetails');
        const fippDetailsNo = document.getElementById('fippDetailsNo');

        if (document.getElementById('yes').checked) {
            fippDetails.style.display = 'block';
            fippDetailsNo.style.display = 'none';

            this.usuario.alunoFipp = true;
        } else {
            fippDetails.style.display = 'none';
            fippDetailsNo.style.display = 'block';

            this.usuario.alunoFipp = false;
        }
    }

    // Adiciona a validação do RA quando a resposta é sim
    validaRa() {
        const raField = document.getElementById('ra');
        const fippDetails = document.getElementById('fippDetails');

        // Se a opção "Sim" estiver selecionada, o campo RA é obrigatório e deve conter 9 dígitos numéricos
        if (document.getElementById('yes').checked) {
            const raValue = raField.value.replace(/\D+/g, '');

            if (raValue.length !== 9) {
                this.criaErro(raField, 'RA deve conter 9 dígitos numéricos');
                return false;
            }
        }

        // Se a opção "Não" estiver selecionada, limpa o campo RA e não o torna obrigatório
        if (document.getElementById('no').checked) {
            raField.value = ''; // Limpa o campo RA
        }

        return true;
    }

    
    validaCurso() {
        const courseField = document.getElementById('course');
        const participantTypeField = document.getElementById('participantType');
        const fippDetails = document.getElementById('fippDetails');

        if (document.getElementById('yes').checked) {
            if (!courseField.value) {
                this.criaErro(courseField, 'Escolha um curso');
                return false;
            }

            this.usuario.ocupacao = courseField.value;
        }

        if (document.getElementById('no').checked) {
            if (!participantTypeField.value) {
                this.criaErro(participantTypeField, 'Selecione seu tipo');
                return false;
            }

            this.usuario.ocupacao = participantTypeField.value;
        }

        return true;
    }


    handleSubmit(evento) {
        evento.preventDefault();

        const camposValidos = this.camposSaoValidos();
        const senhasValidas = this.senhaSaoValidas();
        const raValido = this.validaRa();
        const cursoValido = this.validaCurso();

        if (!(camposValidos && senhasValidas && raValido && cursoValido)) {
            return;
        }

        const usuario = this.obterDadosUsuario();

        // Verifica se obterDadosUsuario retornou null
        if (!usuario) {
            this.criaErro(this.form, 'Falha ao obter dados do usuário. Verifique se todos os campos estão presentes no formulário.', 'error');
            return;
        }

        const campoPrioritario = usuario.alunoFipp ? 'ra' : 'cpf';

        if (this.validaUsuarioExistente.campoJaCadastrado(campoPrioritario, usuario[campoPrioritario])) {
            alert(`${campoPrioritario.toUpperCase()} já cadastrado. Você será redirecionado para a página de login.`);
            this.redirecionarParaLogin();
            return;
        }

        if (this.validaUsuarioExistente.emailJaCadastrado(usuario.email)) {
            alert('E-mail já cadastrado. Você será redirecionado para a página de login.');
            this.redirecionarParaLogin();
            return;
        }

        if (this.validaUsuarioExistente.telefoneJaCadastrado(usuario.telefone)) {
            const campoTelefone = this.form.querySelector('#campoTelefone');
            this.criaErro(campoTelefone, 'Telefone já cadastrado. Tente outro.');
            return;
        }

        this.validaUsuarioExistente.adicionarUsuario(usuario);
        alert('FORMULÁRIO ENVIADO');
        this.form.submit()
    }


    obterDadosUsuario() {
        const nome = this.form.querySelector('#campoNome').value;
        const sobrenome = this.form.querySelector('#campoSobrenome').value;
        const cpf = this.form.querySelector('#campoCPF').value.replace(/\D+/g, '');
        const email = this.form.querySelector('#campoEmail').value;
        const senha = this.form.querySelector('#campoSenha').value;
        const telefone = this.form.querySelector('#campoTelefone').value.replace(/\D+/g, '');
        const ra = this.usuario.alunoFipp ? this.form.querySelector('#ra').value : undefined;
        const ocupacao = this.usuario.ocupacao;
        const id = this.gerarIdAleatorio();

        if (nome && sobrenome && cpf && email && senha && telefone !== undefined && ocupacao) {
            return { id, nome, sobrenome, cpf, email, senha, telefone, alunoFipp: this.usuario.alunoFipp, ra, ocupacao, concluiuPagamento: false };
        } else {
            console.error('Um ou mais campos não foram preenchidos.');
            return null;
        }
    }

    verificaRadioBoxSelecionado() {
        const radioGroup = this.form.querySelector('.radio-group');
        const radios = radioGroup.querySelectorAll('input[name="fippStudent"]');

        for (const radio of radios) {
            if (radio.checked) {
                return true;
            }
        }

        alert('Selecione uma opção para "Você é aluno da FIPP?"');
        return false;
    }


    senhaSaoValidas() {
        let valid = true;

        const senha = this.form.querySelector('#campoSenha');
        const repetirSenha = this.form.querySelector('#campoRepetirSenha');

        if (senha.value.length < 6 || senha.value.length > 12) {
            this.criaErro(senha, 'Senha deve ter entre 6 e 12 caracteres');
            valid = false;
        }

        if (senha.value !== repetirSenha.value) {
            this.criaErro(senha, "Campo Senha e Repetir Senha devem ser iguais");
            this.criaErro(repetirSenha, "Campo Senha e Repetir Senha devem ser iguais");
            valid = false;
        }

        return valid;
    }

    camposSaoValidos() {
        let valid = true;

        for (let erroText of this.form.querySelectorAll('.error-text')) {
            erroText.remove();
        }

        for (let campo of this.form.querySelectorAll('.validar')) {
            const label = campo.previousElementSibling.textContent;

            if (!campo.value.trim()) {
                this.criaErro(campo, `Campo ${label} não pode estar em branco`);
                valid = false;
            }

            if (campo.classList.contains('cpf')) {
                if (!this.validaCpf(campo)) valid = false;
            }

            if (campo.classList.contains('email')) {
                if (!this.validaEmail(campo)) valid = false;
            }

            if (campo.classList.contains('telefone')) {
                if (!this.validaTelefone(campo)) valid = false;
            }
        }

        return valid;
    }

    validaTelefone(campo) {
        // Remove caracteres não numéricos e obtém apenas os dígitos
        const numeroTelefone = campo.value.replace(/\D+/g, '');

        // Verifica se há pelo menos 10 dígitos numéricos no número de telefone
        if (numeroTelefone.length < 11) {
            this.criaErro(campo, 'Número de telefone inválido. Deve ter pelo menos 11 dígitos.');
            return false;
        }

        // Atualiza o valor do campo com apenas os dígitos
        campo.value = numeroTelefone;

        return true;
    }


    validaCpf(campo) {
        const cpf = new ValidaCPF(campo.value);

        if (!cpf.valida()) {
            this.criaErro(campo, 'CPF Inválido');
            return false;
        }

        return true;
    }

    isEmailValido(email) {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regexEmail.test(email);
    }

    validaEmail(campo) {
        const email = campo.value;

        if (!this.isEmailValido(email)) {
            this.criaErro(campo, 'E-mail inválido');
            return false;
        }

        return true;
    }

    criaErro(campo, mensagem, tipo = 'alert') {
        if (campo) { 
            const div = document.createElement('div');
            div.innerHTML = mensagem;
            div.classList.add('error-text');
            div.classList.add(tipo);

            if (tipo === 'success') {
                campo.insertAdjacentElement('beforebegin', div); // Insere antes do campo
            } else {
                campo.insertAdjacentElement('afterend', div); // Insere após o campo
            }
        }
    }


    redirecionarParaLogin() {
        // Obtém a URL do módulo atual
        const scriptUrl = new URL(import.meta.url);

        // Extrai o caminho do diretório do script
        const scriptPath = decodeURI(scriptUrl.pathname);
        const scriptDirectory = scriptPath.substring(0, scriptPath.lastIndexOf('/'));

        // Constrói o caminho da página de login
        const loginPagePath = `${scriptDirectory}/../login.html`;

        // Redireciona para a página de login
        window.location.href = loginPagePath;
    }


    naoRetrocedaPage() {
        document.addEventListener('DOMContentLoaded', function() {
            history.pushState(null, null, location.href);
            window.onpopstate = function () {
                history.go(1);
            };
        });

    }
}
const valida = new ValidaForm();
