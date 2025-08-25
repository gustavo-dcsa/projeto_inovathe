// These values should be kept in sync with the Django backend models.

export const STATUS_CHOICES = [
  { value: 'pending', label: 'Pendente' },
  { value: 'in_analysis', label: 'Em Análise' },
  { value: 're_evaluation', label: 'Em Reavaliação' },
  { value: 'approved', label: 'Aprovada' },
  { value: 'rejected', label: 'Rejeitada' },
];

export const STAGE_CHOICES = [
    { value: 'submitted', label: 'Submetida' },
    { value: 'innovation_sector', label: 'Setor de Inovação' },
    { value: 'responsible_manager', label: 'Gestor Responsável' },
    { value: 'innovation_committee', label: 'Comitê de Inovação' },
    { value: 'board_of_directors', label: 'Diretoria' },
    { value: 'projects', label: 'Projetos' },
    { value: 'implemented', label: 'Implementada' },
];

// Add other choices like BUSINESS_UNIT_CHOICES and CATEGORY_CHOICES here
// as they are defined in the backend.
