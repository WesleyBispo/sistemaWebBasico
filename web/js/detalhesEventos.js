class DetalhesEventos {
    constructor() {
      // Mapeamento de detalhes para os cursos
      this.mapeamentoCursos = {
        1: { nome: "Introdução a Desenvolvimento de Aplicativos iOS(Swift)", data: "2023-11-24", hora: "15:00" },
        2: { nome: "Introdução ao UI/UX Design", data: "2023-11-25", hora: "15:00" },
        3: { nome: "Introdução ao Robotic Process Automation (RPA)", data: "2023-11-26", hora: "15:00" },
        4: { nome: "Introdução à IoT (Internet das Coisas)", data: "2023-11-27", hora: "15:00" },
      };
  
      // Mapeamento de detalhes para as palestras
      this.mapeamentoPalestras = {
        5: { nome: "ImobiBrasil", data: "2023-11-24", hora: "19:00" },
        6: { nome: "IBM", data: "2023-11-25", hora: "19:00" },
      };
    }
  
    obterDetalhesCurso(idCurso) {
      return this.mapeamentoCursos[idCurso] || null;
    }
  
    obterDetalhesPalestra(idPalestra) {
      return this.mapeamentoPalestras[idPalestra] || null;
    }
  }
  
  export default DetalhesEventos;
  