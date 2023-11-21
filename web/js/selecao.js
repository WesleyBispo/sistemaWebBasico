import cursos from './data/cursos.js';
import palestras from './data/palestras.js';
import SelecaoManager from './selecaoManager.js';

naoRetrocedaPage()

function naoRetrocedaPage() {
  document.addEventListener('DOMContentLoaded', function() {
      history.pushState(null, null, location.href);
      window.onpopstate = function () {
          history.go(1);
      };
  });

}

function formatarDataEHora(evento) {
  const data = new Date(evento.data + " " + evento.hora);
  const dia = data.getDate();
  const mes = data.getMonth() + 1;
  const horas = data.getHours();
  const minutos = data.getMinutes();

  return `Dia ${dia}/${mes} às ${horas}:${minutos < 10 ? '0' : ''}${minutos}hrs`;
}


(function () {

  const tableCursos = document.querySelector('#table-cursos');
  const tablePalestras = document.querySelector('#table-palestras');

  var modeloRowPalestra = `
    <tr>
      <td>
        <div class="d-inline-flex align-items-center">
          <img src="{{IMAGE}}" alt="" width="50" class="img-fluid me-2">
          <span class="fs-5 text-white">{{NOME}}</span>
        </div>
        <div class="font14 text-white">{{DATAHORA}}</div>
      </td>
      <td class="position-relative">
        <input class="form-check-input position-absolute top-50 start-50 translate-middle m-0" type="checkbox" value="{{ID}}">
      </td>
    </tr>
  `;

  var modeloRowCurso = `
    <tr>
      <td>
        <span class="fs-5 text-white">{{NOME}}</span>
        <div class="font14 text-white">{{DATAHORA}}</div>
      </td>
      <td class="position-relative">
          <input class="form-check-input position-absolute top-50 start-50 translate-middle m-0" type="checkbox" value="{{ID}}">
      </td>
    </tr>
  `;

  palestras.forEach(p => {
    var palestra = modeloRowPalestra
      .replace('{{IMAGE}}', p.imagem)
      .replace('{{NOME}}', p.nome)
      .replace('{{DATAHORA}}', formatarDataEHora(p))
      .replace('{{ID}}', p.id);
    
    tablePalestras.innerHTML += palestra;
  });

  cursos.forEach(c => {
    var curso = modeloRowCurso
      .replace('{{NOME}}', c.nome)
      .replace('{{DATAHORA}}', formatarDataEHora(c))
      .replace('{{ID}}', c.id);
    
    tableCursos.innerHTML += curso;
  });


}());


const selecaoManager = new SelecaoManager();

const btnFinalizarSelecao = document.querySelector('#selecaoBtnFinalizar');
btnFinalizarSelecao.addEventListener('click', async () => {
    try {
        const resultado = await selecaoManager.adicionarCursosEPalestrasAoUsuario();
        alert(resultado);
        // Redireciona para a página de pagamento
        redirecionarParaPagamento()
    } catch (error) {
        // Exibe mensagem de erro (opcional)
        console.error(error);
    }
});

// Intercepta a tentativa de sair da página antes de concluir a seleção
window.addEventListener('beforeunload', (event) => {
    const cursosEPalestrasSelecionados = selecaoManager.obterSelecionados('table-cursos', 'table-palestras');
    if (cursosEPalestrasSelecionados.length > 0) {
        event.returnValue = 'Você ainda não concluiu a seleção. Tem certeza que deseja sair?';
    }
});


function redirecionarParaPagamento() {
  // Obtém a URL do módulo atual
  const scriptUrl = new URL(import.meta.url);

  // Extrai o caminho do diretório do script
  const scriptPath = decodeURI(scriptUrl.pathname);
  const scriptDirectory = scriptPath.substring(0, scriptPath.lastIndexOf('/'));

  // Constrói o caminho da página de login
  const loginPagePath = `${scriptDirectory}/../pagamento.html`;

  // Redireciona para a página de login
  window.location.href = loginPagePath;
}

