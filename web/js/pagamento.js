import ValidaCPF from "./validaCpf.js";
import DetalhesEventos from './detalhesEventos.js';
import ExibirDadosTela from './exibirDadosTela.js';


class PagamentoManager {
  constructor() {
    this.metodos = Array.from(document.querySelectorAll('.pagamento-metodo'));
    this.inputMetodo = document.querySelector('.pagamento-metodos input');
  }

  inicializar() {
    this.configurarEventos();
    this.exibirMetodoPadrao();
  }

  configurarEventos() {
    this.metodos.forEach(metodo => {
      metodo.addEventListener('click', () => {
        this.metodos.forEach(el => {
          el.classList.remove('active');
          document.querySelector('#' + el.dataset.metodo).style.display = 'none';
        });
        metodo.classList.add('active');
        document.querySelector('#' + metodo.dataset.metodo).style.display = 'block';
        this.inputMetodo.value = metodo.dataset.metodo;
      })
    })

    const btnFinalizarPagamento = document.getElementById('btn-finalizar-pagamento');
    btnFinalizarPagamento.addEventListener('click', () => {
      // Verifica qual método foi selecionado e chama a função de validação apropriada
      if (this.inputMetodo.value === 'cartao-credito') {
        this.validaCartaoAoFinalizar();
      } else if (this.inputMetodo.value === 'boleto') {
        this.validaBoletoAoFinalizar();
      }
    });
  }
  validaCartaoAoFinalizar() {
    this.limparMensagensErro()

    const campoNome = document.getElementById('campoNomeTitular');
    const campoNumeroCartao = document.getElementById('campoNumeroCartao');
    const campoDataValidade = document.getElementById('campoDataValidade');
    const campoCVV = document.getElementById('campoCVV');

    // Verifica se todos os campos obrigatórios estão preenchidos
    if (!this.validaCampoNaoVazio(campoNome, 'Nome') || !this.validaCampoNaoVazio(campoNumeroCartao, 'Número do cartão') || !this.validaCampoNaoVazio(campoDataValidade, 'Data de validade') || !this.validaCampoNaoVazio(campoCVV, 'Código de segurança')) {
      return;
    }

    // Validações básicas do cartão de crédito 
    // Aqui estou apenas verificando se o número do cartão tem 16 dígitos
    if (campoNumeroCartao.value.replace(/\D/g, '').length !== 16) {
      this.criaErro(campoNumeroCartao, 'Número do cartão inválido. Digite um número com 16 dígitos.');
      return;
    }

    // Validações básicas da data de validade 
    // Aqui estou apenas verificando se o formato é MM/AA
    const dataValidadeRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!dataValidadeRegex.test(campoDataValidade.value)) {
      this.criaErro(campoDataValidade, 'Data de validade inválida. Digite no formato MM/AA.');
      return;
    }

    // Verifica se a data de validade está no passado
    const hoje = new Date();
    const [mes, ano] = campoDataValidade.value.split('/');
    const dataValidade = new Date(`20${ano}`, mes - 1);

    if (dataValidade < hoje) {
      this.criaErro(campoDataValidade, 'Cartão vencido. Insira uma data de validade válida.');
      return;
    }

    if(campoCVV.value.length !== 3) {
      this.criaErro(campoCVV, 'Código segurança deve conter 3 números')
      return
    }

    window.removeEventListener('beforeunload', this.beforeUnloadHandler);
    // Finaliza o pagamento se todas as validações passarem
    this.finalizarPagamento();
  }

  validaBoletoAoFinalizar() {
    this.limparMensagensErro()
    const campoNome = document.getElementById('campoNome');
    const campoCPF = document.getElementById('campoCPF');
    const campoCep = document.getElementById('campoCep');

    // Verifica se todos os campos obrigatórios estão preenchidos
    if (!this.validaCampoNaoVazio(campoNome, 'Nome') || !this.validaCampoNaoVazio(campoCPF, 'CPF') || !this.validaCampoNaoVazio(campoCep, 'CEP')) {
      return;
    }

    // Validação específica para CPF usando a classe ValidaCPF
    const validaCpf = new ValidaCPF(campoCPF.value);
    if (!validaCpf.valida()) {
      this.criaErro(campoCPF, 'CPF inválido. Digite um CPF válido.');
      return;
    }

    // Remove traços e espaços do CEP
    campoCep.value = campoCep.value.replace(/\D/g, '');

    // Verifica o formato do CEP
    const cepRegex = /^[0-9]{8}$/;
    if (!cepRegex.test(campoCep.value)) {
      this.criaErro(campoCep, 'CEP inválido. Digite um CEP válido com 8 dígitos.');
      return;
    }

    window.removeEventListener('beforeunload', this.beforeUnloadHandler);
    // Finaliza o pagamento se todas as validações passarem
    this.finalizarPagamento();
  }

  validaCampoNaoVazio(campo, nomeCampo) {
    if (!campo.value.trim()) {
      this.criaErro(campo, `${nomeCampo} não pode estar vazio.`);
      return false;
    }
    return true;
  }

  exibirMetodoPadrao() {
    const metodoPadrao = this.metodos[0];
    metodoPadrao.click();
  }


  criaErro(campo, mensagem, tipo = 'alert') {
    if (campo) {
      const div = document.createElement('div');
      div.innerHTML = mensagem;
      div.classList.add('error-text');
      div.classList.add(tipo);

      if (tipo === 'alert') {
        campo.insertAdjacentElement('afterend', div); // Insere após o campo
      }
    }
  }

  limparMensagensErro() {
    const mensagensErro = document.querySelectorAll('.error-text');
    mensagensErro.forEach(mensagem => mensagem.remove());
  }

  finalizarPagamento() {
    
    const usuarios = JSON.parse(localStorage.getItem('usuarios'));

    // Obtém o último usuário na lista
    const usuarioAtivo = usuarios[usuarios.length - 1];

    if (usuarioAtivo) {
      // Altera a propriedade concluiuPagamento para true no último usuário
      usuarioAtivo.concluiuPagamento = true;

      // Atualiza a lista de usuários no localStorage
      localStorage.setItem('usuarios', JSON.stringify(usuarios));

      alert('Pagamento finalizado com sucesso! Você será redirecionado para a página de login');
      // Redireciona para a página de login
      this.redirecionarParaLogin();
    } else {
      console.error('Nenhum usuário encontrado.');
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


  beforeUnloadHandler(event) {
    event.returnValue = "Você ainda não concluiu o pagamento. Tem certeza que deseja sair?";
}

  
}

// Adiciona um evento de carga à página
window.addEventListener('load', function () {
  const pagamentoManager = new PagamentoManager();
  const detalhesEventos = new DetalhesEventos();
  const exibirDadosTela = new ExibirDadosTela(detalhesEventos);

  pagamentoManager.inicializar();

  // Chama métodos para exibir os detalhes na tela
  const usuarios = JSON.parse(localStorage.getItem('usuarios'));
  const usuarioAtivo = usuarios[usuarios.length - 1];

  // Exibe detalhes do usuário
  exibirDadosTela.exibirInfoUsuario(usuarioAtivo);

  //Exibe o preco
  exibirDadosTela.exibirPreco(usuarioAtivo)

  // Exibe detalhes dos cursos e palestras
  exibirDadosTela.exibirDetalhesCursos(usuarioAtivo.cursosSelecionados);
  exibirDadosTela.exibirDetalhesPalestras(usuarioAtivo.palestrasSelecionadas);

  // Configura o evento beforeunload
  window.addEventListener('beforeunload', pagamentoManager.beforeUnloadHandler.bind(pagamentoManager));
});

