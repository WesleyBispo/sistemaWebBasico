class ExibirDadosTela {
    constructor(detalhesEventos) {
        this.detalhesEventos = detalhesEventos;
    }

    exibirDetalhesCursos(cursos) {
        const infoCursos = document.getElementById('infoCursos');
        infoCursos.innerHTML = ''; // Limpa conteúdo anterior

        cursos.forEach(curso => {
            const detalhesCurso = this.detalhesEventos.obterDetalhesCurso(curso.id);
            const li = document.createElement('li');
            li.innerHTML = `<div class="font12 fw-bold lh-1">${detalhesCurso.nome}</div><span class="font10">${detalhesCurso.data} às ${detalhesCurso.hora}</span>`;
            infoCursos.appendChild(li);
        });
    }

    exibirDetalhesPalestras(palestras) {
        const infoPalestras = document.getElementById('infoPalestras');
        infoPalestras.innerHTML = ''; 

        palestras.forEach(palestra => {
            const detalhesPalestra = this.detalhesEventos.obterDetalhesPalestra(palestra.id);
            const li = document.createElement('li');
            li.innerHTML = `<div class="font12 fw-bold lh-1">${detalhesPalestra.nome}</div><span class="font10">${detalhesPalestra.data} às ${detalhesPalestra.hora}</span>`;
            infoPalestras.appendChild(li);
        });
    }

    calcularPreco(usuario) {
        let precoCamiseta = 80
        let precoTotal = 0;
        
        if(usuario.alunoFipp) {
            let precoFipp = 40
           precoTotal = precoFipp + precoCamiseta
        } else {
            if(usuario.ocupacao == "etecStudent") {
                const precoEtec = 0
                precoTotal = precoCamiseta
            } else if(usuario.ocupacao == "unoesteEmployee"){
                const precoUnoesteEmployee = 50
                precoTotal = precoCamiseta + precoUnoesteEmployee
            } else if(usuario.ocupacao == "otherParticipants") {
                const otherParticipants = 80
                precoTotal = otherParticipants + precoCamiseta
            } 
        }
        return precoTotal
    }


    exibirPreco(usuario) {
        const precoCalculado = this.calcularPreco(usuario)

        // Remove o conteúdo existente
        const infoPreco = document.getElementById('infoPreco');
        infoPreco.innerHTML = '';

        // Exibe o preço formatado na tela
        infoPreco.innerHTML = `<div class="fs-4 fw-bold" id="infoPreco">R$ ${precoCalculado}<span class="fs-6">.00</span></div>`
      }

    exibirInfoUsuario(usuario) {
        const userDados = {
            ID: usuario.id,
            Nome: usuario.nome,
            Email: usuario.email,
            CPF: usuario.cpf,
            Telefone: usuario.telefone,
        
        }
        const infoUsuario = document.getElementById('infoUsuario');
        for (let chave in userDados) {
    
            const li = document.createElement('li');
            li.innerHTML = `<div class="font12 fw-bold ">${chave}: ${userDados[chave]}</div>`
            infoUsuario.appendChild(li);
        }
        

       
    
}
}
export default ExibirDadosTela;
