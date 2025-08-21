import React, { useState } from 'react';
import ideaService from '../services/ideaService';
import SuccessAnimation from '../components/SuccessAnimation';
import { useAuth } from '../context/AuthContext';

const NewSubmitIdeaPage = () => {
  const { user } = useAuth();
  const [showOverlay, setShowOverlay] = useState(false);
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
        setSubmitMessage(`Sua ideia foi enviada! ID da Ideia: ${response.data.id}`);
        setShowOverlay(true); // Mostra overlay escuro com GIF

        setTimeout(() => {
          setShowOverlay(false);
          setShowSuccess(true); // Vai para página de agradecimento
        }, 500); // 0.5 segundos
      })
      .catch(error => {
        setIsSubmitting(false);
        setSubmitMessage('Ocorreu um erro ao enviar sua ideia. Por favor, tente novamente.');
        console.error('Error submitting idea:', error);
      });
  };

  return (
    <div className="container mx-auto p-8 bg-[#CFE4BD]">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-2 text-[#014D49]">Banco de Ideias Unimed Teresina</h1>
        <p className="text-center text-[#014D49] mb-8">Bem-vindo(a) ao Inova Unimed Teresina! Compartilhe sua proposta com o máximo de detalhes.</p>
        {showOverlay && <SuccessAnimation />}
        {!showSuccess ? (
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-6">
              <label htmlFor="email" className="block text-[#014D49] font-bold mb-2">Email *</label>
              <input
                type="email"
                value={user ? user.email : formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                disabled={!!user}
                required
                className="border px-3 py-2 w-full rounded-lg"
              />
            </div>

            {/* Nome completo */}
            <div className="mb-6">
              <label htmlFor="fullName" className="block text-[#014D49] font-bold mb-2">1 - Nome completo do colaborador</label>
              <p className="text-sm text-gray-600 mb-2">Seu nome completo conforme registrado na empresa</p>
              <input type="text" name="fullName" id="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" required />
            </div>

            {/* Como deseja submeter sua ideia? */}
            <div className="mb-6">
              <label className="block text-[#014D49] font-bold mb-2">2 - Como deseja submeter sua ideia?</label>
              <p className="text-sm text-gray-600 mb-2">O colaborador que submete a ideia recebera as credenciais para acompanhamento.</p>
              <select name="submissionType" value={formData.submissionType} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg">
                <option>Apenas eu</option>
                <option>Com minha equipe</option>
              </select>
            </div>

            {/* Caso possua uma equipe... */}
            {formData.submissionType === 'Com minha equipe' && (
              <div className="mb-6">
                <label htmlFor="teamMembers" className="block text-[#014D49] font-bold mb-2">3 - Caso possua uma equipe, informe o nome dos demais colaboradores. (opcional)</label>
                <p className="text-sm text-gray-600 mb-2">No máximo 3 pessoas por equipe</p>
                <input type="text" name="teamMembers" id="teamMembers" value={formData.teamMembers} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
              </div>
            )}

            {/* Unidade de negócio */}
            <div className="mb-6">
              <label htmlFor="businessUnit" className="block text-[#014D49] font-bold mb-2">4 - Unidade de negócio:</label>
              <p className="text-sm text-gray-600 mb-2">Qual seu local de trabalho no grupo Unimed Teresina?</p>
              <select name="businessUnit" value={formData.businessUnit} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" required>
                <option value="">Selecione uma unidade</option>
                <option>Operadora Unimed</option>
                <option>Operadora Intermed</option>
                <option>Hospital Unimed Primavera (HUP)</option>
                <option>Centro Integrado Ilhotas (CIS)</option>
                <option>Unihome</option>
                <option>Unimed Parnaíba</option>
                <option>Intermed Parnaíba</option>
                <option>TheAcolher</option>
              </select>
            </div>

            {/* Setor */}
            <div className="mb-6">
              <label htmlFor="department" className="block text-[#014D49] font-bold mb-2">5 - Setor:</label>
              <p className="text-sm text-gray-600 mb-2">Selecione o departamento ao qual você pertence</p>
              <input list="department-options" name="department" id="department" value={formData.department} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" required />
              <datalist id="department-options">
                {departmentOptions.map(opt => <option key={opt} value={opt} />)}
              </datalist>
            </div>

            {/* Cargo */}
            <div className="mb-6">
              <label htmlFor="position" className="block text-[#014D49] font-bold mb-2">6 – Cargo</label>
              <p className="text-sm text-gray-600 mb-2">Seu cargo atual na empresa</p>
              <input type="text" name="position" id="position" value={formData.position} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" required />
            </div>

            {/* Título da Ideia */}
            <div className="mb-6">
              <label htmlFor="ideaTitle" className="block text-[#014D49] font-bold mb-2">7 - Título da Ideia</label>
              <p className="text-sm text-gray-600 mb-2">Um título breve e descritivo para sua ideia (máximo 100 caracteres)</p>
              <input type="text" name="ideaTitle" id="ideaTitle" value={formData.ideaTitle} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" maxLength="100" required />
            </div>

            {/* Categoria */}
            <div className="mb-6">
              <label className="block text-[#014D49] font-bold mb-2">8 – Categoria</label>
              <p className="text-sm text-gray-600 mb-2">Selecione a categoria que melhor se aplica à sua ideia</p>
              <select name="ideaCategory" value={formData.ideaCategory} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" required>
                  <option value="">Selecione uma categoria</option>
                  <option>Inovação de Produto/Serviço</option>
                  <option>Melhoria de Processo</option>
                  <option>Redução de Custos</option>
                  <option>Aumento de Produtividade</option>
                  <option>Satisfação do Cliente</option>
                  <option>Bem-estar dos Colaboradores</option>
                  <option>Sustentabilidade</option>
                  <option>Tecnologia</option>
                  <option>Outro</option>
              </select>
            </div>

            {/* Descrição Detalhada */}
            <div className="mb-6">
              <label htmlFor="detailedDescription" className="block text-[#014D49] font-bold mb-2">9 - Descrição Detalhada</label>
              <p className="text-sm text-gray-600 mb-2">Descreva sua ideia em detalhes. Explique o que é, como funcionaria e qual problema ela resolve.</p>
              <textarea name="detailedDescription" id="detailedDescription" value={formData.detailedDescription} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" rows="6" required></textarea>
            </div>

            {/* Benefícios Esperados */}
            <div className="mb-6">
              <label htmlFor="expectedBenefits" className="block text-[#014D49] font-bold mb-2">10- Benefícios Esperados</label>
              <p className="text-sm text-gray-600 mb-2">Quais são os benefícios esperados com a implementação desta ideia? Como ela agrega valor à empresa?</p>
              <textarea name="expectedBenefits" id="expectedBenefits" value={formData.expectedBenefits} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" rows="4" required></textarea>
            </div>

            {/* Recursos Necessários */}
            <div className="mb-6">
              <label htmlFor="requiredResources" className="block text-[#014D49] font-bold mb-2">11 - Recursos Necessários (opcional)</label>
              <p className="text-sm text-gray-600 mb-2">Quais recursos (humanos, financeiros, tecnológicos, etc.) seriam necessários para implementar esta ideia?</p>
              <textarea name="requiredResources" id="requiredResources" value={formData.requiredResources} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" rows="4"></textarea>
            </div>

            {/* Impacto Estimado */}
            <div className="mb-6">
              <label className="block text-[#014D49] font-bold mb-2">12 - Impacto Estimado (opcional)</label>
              <p className="text-sm text-gray-600 mb-2">Qual o nível de impacto que você acredita que sua ideia terá?</p>
              <select name="estimatedImpact" value={formData.estimatedImpact} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg">
                  <option>Baixo</option>
                  <option>Médio</option>
                  <option>Alto</option>
              </select>
            </div>

            {/* Prazo Sugerido */}
            <div className="mb-6">
              <label className="block text-[#014D49] font-bold mb-2">13 - Prazo Sugerido para Implementação (opcional)</label>
              <p className="text-sm text-gray-600 mb-2">Qual seria o prazo ideal para implementação desta ideia?</p>
              <select name="implementationTimeline" value={formData.implementationTimeline} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg">
                  <option>Curto prazo (até 3 meses)</option>
                  <option>Médio prazo (3 a 6 meses)</option>
                  <option>Longo prazo (mais de 6 meses)</option>
              </select>
            </div>

            {/* Inspiração */}
            <div className="mb-6">
              <label htmlFor="inspiration" className="block text-[#014D49] font-bold mb-2">14 - Inspiração (opcional)</label>
              <p className="text-sm text-gray-600 mb-2">O que inspirou você a ter esta ideia? Existe alguma referência externa ou interna?</p>
              <input type="text" name="inspiration" id="inspiration" value={formData.inspiration} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
            </div>

            {/* Comentários Adicionais */}
            <div className="mb-6">
              <label htmlFor="additionalComments" className="block text-[#014D49] font-bold mb-2">15 - Comentários Adicionais(opcional)</label>
              <p className="text-sm text-gray-600 mb-2">Alguma informação adicional que você gostaria de compartilhar sobre sua ideia?</p>
              <textarea name="additionalComments" id="additionalComments" value={formData.additionalComments} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" rows="4"></textarea>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className={`bg-[#00995D] text-white font-bold py-3 px-8 rounded-full hover:bg-[#B1D14A] transition duration-300 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span>
                    <svg className="animate-spin inline-block mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    Enviando...
                  </span>
                ) : 'Enviar Ideia'}
              </button>
            </div>
            {submitMessage && <p className="text-center mt-4">{submitMessage}</p>}
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <img
              src={require('../images/cooperacao (1).gif')}
              alt="Sucesso"
              className="w-64 mb-6 bg-transparent"
            />
            <h2 className="text-2xl font-bold text-[#014D49] mt-6 mb-2">Parabéns!</h2>
            <p className="text-lg text-[#014D49] mb-4">Sua ideia foi enviada com sucesso.</p>
            <p className="text-md text-gray-700 mb-4">{submitMessage}</p>
            <button
              className="bg-[#00995D] text-white font-bold py-2 px-6 rounded-full hover:bg-[#B1D14A] transition duration-300"
              onClick={() => setShowSuccess(false)}
            >
              Enviar outra ideia
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default NewSubmitIdeaPage;
