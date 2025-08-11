import React, { useState } from 'react';
import ideaService from '../services/ideaService';
import SuccessAnimation from '../components/SuccessAnimation';

const NewSubmitIdeaPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    submissionType: 'Apenas eu',
    teamMembers: '',
    businessUnit: '',
    department: '',
    position: '',
    ideaTitle: '',
    ideaCategory: '',
    detailedDescription: '',
    expectedBenefits: '',
    requiredResources: '',
    estimatedImpact: 'Médio',
    implementationTimeline: 'Médio prazo (3 a 6 meses)',
    inspiration: '',
    additionalComments: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const departmentOptions = [
    "Departamento", "FISIOTERAPIA", "RADIOLOGIA", "MULTIDISCIPLINAR NAIS", "SOLUCOES CORPORATIVAS", "POSTO 05", "AUDITORIA DE ENFERMAGEM EXTERNA", "NUTRICAO", "POSTO 04", "UAN", "PRONTO ATENDIMENTO", "AUDITORIA DE ENFERMAGEM", "TECNOLOGIA DA INFORMACAO", "AUDITORIA", "HEMODINAMICA", "RECEPCAO PRONTO ATENDIMENTO", "MULTIDISCIPLINAR", "FARMACIA", "NUCLEO GERENCIAL ADMINISTRATIVO", "HOTELARIA", "RELACIONAMENTO COM O COOPERADO", "RECEPCAO AMBULATORIO", "ALMOXARIFADO", "CENTRO CIRURGICO", "SERVICOS GERAIS", "REEMBOLSO", "RELACIONAMENTO RECEPCAO", "POSTO 02", "CENTRAL DE RELACIONAMENTO", "IMAGEM INSTITUCIONAL", "FATURAMENTO", "CONTABILIDADE", "COMPRAS", "AUDITORIA MEDICA", "COBRANCA", "OUVIDORIA", "REL. CLIENTE/SAC", "COMERCIAL VENDAS PJ", "UTI 02", "GESTAO EM SAUDE/REGULACAO DE TERAPIAS", "SECRETARIA CORPORATIVA", "FACILITIES", "MERCADO/NEGOCIACAO EMPRESARIAL", "REL. CLIENTE/RECEPCAO", "SCIH", "REGULAMENTACAO EM SAUDE", "RECEPCAO INTERNACAO", "GESTAO EM SAUDE/AUDITORIA PREVIA", "FINANCEIRO", "ESCRITORIO DE PROJETOS E PROCESSOS", "ASSUNTOS REGULATORIOS", "DIRETORIA", "GENTE E CULTURA / SESMT", "RELACIONAMENTO ATENDIMENTO", "RELACIONAMENTO COM CLIENTE", "BUSCA DE REDE", "UTI PEDIATRICO", "ADMINISTRATIVO", "POSTO 01", "GENTE E CULTURA / RECURSOS HUMANOS", "POSTO PEDIATRICO", "AUDITORIA DE ENFERMAGEM INTERNA", "CONTROLADORIA", "CENTRAL DE NOTAS", "GERENCIA DE ENFERMAGEM", "FACILITES", "RECEPCAO EXAME", "UTI 01", "MANUTENCAO", "SEGURANCA PATRIMONIAL", "ONCOLOGIA", "GESTAO DE PRESTADORES", "INTELIGENCIA EM REGULACAO EM SAUDE", "INTELIG E INOVAÇÃO", "CENTRAL TELEFONICA", "GENTE E CULTURA / DEPARTAMENTO PESSOAL", "ASSESSORIA DE GRC", "TRANSPORTES", "INTERCAMBIO", "RELACIONAMENTO EMPRESARIAL", "SUPERINTENDENCIA", "EDUCACAO PERMANENTE", "ENFERMAGEM AMBULATORIAL", "REL COM O CLIENTE/MONITORIA DE QUALIDADE", "ALMOXARIFADO OPME", "PSICOLOGIA", "ATENCAO PERS. A SAUDE", "QUALIDADE", "COMERCIAL VENDAS", "SERVICO SOCIAL", "CLINICA INTERMED/RECEPCAO"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    const ideaData = {
        submitted_by_email: formData.email,
        full_name: formData.fullName,
        submission_type: formData.submissionType,
        team_members: formData.teamMembers,
        business_unit: formData.businessUnit,
        department: formData.department,
        position: formData.position,
        title: formData.ideaTitle,
        idea_category: formData.ideaCategory,
        description: formData.detailedDescription,
        expected_benefits: formData.expectedBenefits,
        required_resources: formData.requiredResources,
        estimated_impact: formData.estimatedImpact,
        implementation_timeline: formData.implementationTimeline,
        inspiration: formData.inspiration,
        additional_comments: formData.additionalComments,
    };

    ideaService.submitNewIdea(ideaData)
      .then(response => {
        setIsSubmitting(false);
        setSubmitMessage(`Your idea has been submitted! Your Idea ID is ${response.data.id}`);
        setShowSuccess(true);
        // Reset form can be done here
      })
      .catch(error => {
        setIsSubmitting(false);
        setSubmitMessage('There was an error submitting your idea. Please try again.');
        console.error('Error submitting idea:', error);
      });
  };

  return (
    <>
      {showSuccess && <SuccessAnimation message={submitMessage} />}
      <div className="container mx-auto p-8 bg-[#CFE4BD]">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-center mb-2 text-[#014D49]">Banco de Ideias Unimed Teresina</h1>
          <p className="text-center text-[#014D49] mb-8">Bem-vindo(a) ao Inova Unimed Teresina! Compartilhe sua proposta com o máximo de detalhes.</p>

          <form onSubmit={handleSubmit}>
            {/* Form fields go here... */}
          </form>
        </div>
      </div>
    </>
  );
};

export default NewSubmitIdeaPage;
