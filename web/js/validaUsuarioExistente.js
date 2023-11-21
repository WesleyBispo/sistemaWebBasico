class ValidaUsuarioExistente {
    constructor(gerarIdAleatorio) {
        this.gerarIdAleatorio = gerarIdAleatorio;
        this.usuarios = this.obterUsuariosDoJSON() || [];
    }

    destruirUsuarioPorCPF(cpf) {
        // Filtra o usuário com base no CPF
        this.usuarios = this.usuarios.filter(usuario => usuario.cpf !== cpf);

        // Atualiza o localStorage com a lista atualizada de usuários
        this.salvarUsuariosNoJSON();
    }

    obterUsuariosDoJSON() {
        const usuariosJSON = localStorage.getItem('usuarios');
        return usuariosJSON ? JSON.parse(usuariosJSON) : [];
    }

    salvarUsuariosNoJSON() {
        localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
    }

    gerarIdAleatorio() {
        return Math.floor(Math.random() * 100000000);
    }

    campoJaCadastrado(campo, valor) {
        return this.usuarios.some(usuario => usuario[campo] === valor);
    }

    emailJaCadastrado(email) {
        return this.campoJaCadastrado('email', email);
    }

    telefoneJaCadastrado(telefone) {
        return this.campoJaCadastrado('telefone', telefone);
    }

    obterUsuarioPorCPF(cpf) {
         cpf = cpf.replace(/\D/g, '')
        return this.usuarios.find(usuario => usuario.cpf === cpf);
    }

    adicionarUsuario(usuario) {
        usuario.id = this.gerarIdAleatorio();
        this.usuarios.push(usuario);
        this.salvarUsuariosNoJSON();
    }
    verificarConcluiuPagamento(cpf) {
        const usuario = this.obterUsuarioPorCPF(cpf);
    
        if (usuario) {
            console.log('Usuário encontrado:', usuario);
            return this.usuarioConcluiuPagamento(usuario);
        } else {
            console.log('Usuário não encontrado para CPF:', cpf);
        }
    
        return false;
    }
    
    usuarioConcluiuPagamento(usuario) {
        console.log('Verificando se o usuário concluiu o pagamento:', usuario.concluiuPagamento);
        return usuario.concluiuPagamento;
    }
    
}

export default ValidaUsuarioExistente;
