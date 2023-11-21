import ValidaUsuarioExistente from "./ValidaUsuarioExistente.js";

class SelecaoManager {
    constructor() { }

    async adicionarCursosEPalestrasAoUsuario() {
        try {
            const validaUsuarioExistente = new ValidaUsuarioExistente();
            const ultimosUsuarios = validaUsuarioExistente.obterUsuariosDoJSON();
            const ultimoUsuario = ultimosUsuarios[ultimosUsuarios.length - 1];

            const cursosEPalestrasSelecionados = this.obterSelecionados('table-cursos', 'table-palestras');

            this.verificarSelecao(cursosEPalestrasSelecionados);

            const confirmacao = await this.exibirConfirmacao();
            if (!confirmacao) {
                throw new Error('Seleção cancelada.');
            }

            // Separa cursos e palestras
            const cursosSelecionados = cursosEPalestrasSelecionados.filter(item => item.tipo === 'curso');
            const palestrasSelecionadas = cursosEPalestrasSelecionados.filter(item => item.tipo === 'palestra');

            // Atualiza os eventos selecionados do último usuário
            ultimoUsuario.cursosSelecionados = cursosSelecionados;
            ultimoUsuario.palestrasSelecionadas = palestrasSelecionadas;

            // Salva o usuário atualizado no localStorage
            this.salvarUsuarioAtualizado(ultimoUsuario);
            this.limparCheckboxes('table-cursos', 'table-palestras');

            return 'Seleção concluída com sucesso.';
        } catch (error) {
            console.error(error);
            alert("SELECIONE PELO MENOS UM EVENTO")
            throw new Error('Erro ao processar seleção.');
        }
    }

    async exibirConfirmacao() {
        return new Promise(resolve => {
            const confirmacao = confirm('Deseja realmente finalizar a seleção? Pressione "Ok" para confirmar.');
            resolve(confirmacao);
        });
    }

    verificarSelecao(cursosEPalestrasSelecionados) {
        if (cursosEPalestrasSelecionados.length === 0 || this.todosCheckboxesVazios('table-cursos', 'table-palestras')) {
            throw new Error('Selecione pelo menos um curso ou uma palestra.');
        }
    }

    obterSelecionados(...tableIds) {
        const selecionados = [];

        for (const tableId of tableIds) {
            const tabela = document.querySelector(`#${tableId}`);
            const checkboxes = tabela.querySelectorAll('input[type="checkbox"]:checked');

            checkboxes.forEach(checkbox => {
                const id = checkbox.value;
                const nome = checkbox.parentElement.parentElement.querySelector('.fs-5')?.innerText || "";

                // Adiciona a propriedade 'tipo' com base no ID
                const tipo = id >= 5 ? 'palestra' : 'curso';

                selecionados.push({ id, nome, tipo });
            });
        }

        return selecionados;
    }

    limparCheckboxes(...tableIds) {
        for (const tableId of tableIds) {
            const tabela = document.querySelector(`#${tableId}`);
            const checkboxes = tabela.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => checkbox.checked = false);
        }
    }

    todosCheckboxesVazios(...tableIds) {
        for (const tableId of tableIds) {
            const tabela = document.querySelector(`#${tableId}`);
            const checkboxes = tabela.querySelectorAll('input[type="checkbox"]:checked');
            if (checkboxes.length > 0) {
                return false;
            }
        }
        return true;
    }

    salvarUsuarioAtualizado(usuario) {
        const validaUsuarioExistente = new ValidaUsuarioExistente();
        const usuarios = validaUsuarioExistente.obterUsuariosDoJSON();

        // Busca o índice do usuário no array
        const indexUsuario = usuarios.findIndex(u => u.id === usuario.id);

        // Substitui o usuário com os eventos selecionados
        usuarios[indexUsuario] = usuario;

        // Salva a lista atualizada no localStorage
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }
}

export default SelecaoManager;