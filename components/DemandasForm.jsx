// File: components/DemandasForm.jsx

// Actualizamos allSocioformativeDemands para incluir una propiedad 'source'
export const allSocioformativeDemands = [
    { 
      value: 'desarrollo_sostenible', 
      label: 'Desarrollo sostenible y conciencia ambiental',
      source: 'Objetivos de Desarrollo Sostenible (ODS - ONU), Acuerdos Ambientales Globales (ej. Acuerdo de París)' 
    },
    { 
      value: 'inclusion_social', 
      label: 'Inclusión social, equidad de género y diversidad',
      source: 'Declaración Universal de Derechos Humanos (ONU), Convenciones sobre Equidad (ej. CEDAW), Informes sobre Desigualdad Global (ej. PNUD, Banco Mundial)'
    },
    { 
      value: 'participacion_ciudadana', 
      label: 'Participación ciudadana y fortalecimiento democrático',
      source: 'Pactos Internacionales de Derechos Civiles y Políticos (ONU), Índices de Democracia Global, Organizaciones de la Sociedad Civil Internacionales'
    },
    { 
      value: 'etica_profesional', 
      label: 'Ética profesional y responsabilidad social corporativa (RSC)',
      source: 'Principios del Pacto Mundial de la ONU, Normas ISO de Responsabilidad Social (ej. ISO 26000), Códigos Deontológicos Profesionales Internacionales'
    },
    { 
      value: 'innovacion_impacto_social', 
      label: 'Innovación con impacto social y emprendimiento sostenible',
      source: 'Foros Económicos Globales sobre Innovación Social, Redes de Emprendimiento Social Internacionales, Informes sobre Tendencias de Innovación (ej. OCDE)'
    },
    { 
      value: 'adaptabilidad_resiliencia', 
      label: 'Adaptabilidad y resiliencia ante cambios sociales y tecnológicos',
      source: 'Informes sobre el Futuro del Trabajo (ej. OIT, FEM), Marcos de Competencias para el Siglo XXI (ej. UNESCO, OCDE)'
    },
    { 
      value: 'comunicacion_intercultural', 
      label: 'Comunicación intercultural y respeto a la diversidad cultural',
      source: 'Declaración Universal sobre la Diversidad Cultural (UNESCO), Programas de Intercambio Cultural Internacional, Estudios sobre Competencia Intercultural'
    },
    { 
      value: 'pensamiento_critico_social', 
      label: 'Pensamiento crítico aplicado a problemáticas sociales complejas',
      source: 'Marcos de Habilidades del Siglo XXI (ej. P21), Fundaciones para el Pensamiento Crítico, Investigaciones en Ciencias Sociales sobre Resolución de Problemas'
    },
    { 
      value: 'salud_bienestar_comunitario', 
      label: 'Promoción de la salud integral y bienestar comunitario',
      source: 'Estrategias Globales de Salud (OMS), Objetivos de Desarrollo Sostenible (ODS 3 - Salud y Bienestar), Informes sobre Determinantes Sociales de la Salud'
    },
    { 
      value: 'derechos_humanos_paz', 
      label: 'Defensa de los derechos humanos y cultura de paz',
      source: 'Declaración Universal de Derechos Humanos (ONU), Tratados Internacionales de DDHH, Programas de Educación para la Paz (UNESCO)'
    },
    { 
      value: 'transformacion_digital_sociedad', 
      label: 'Transformación digital ética y su impacto en la sociedad',
      source: 'Agenda Digital Global (ej. UIT), Informes sobre Ética de la IA (ej. UNESCO, OCDE), Estudios sobre Brecha Digital y Sociedad de la Información'
    },
    { 
      value: 'gestion_riesgos_desastres', 
      label: 'Gestión de riesgos, adaptación al cambio climático y resiliencia comunitaria',
      source: 'Marco de Sendai para la Reducción del Riesgo de Desastres (ONU), Informes del IPCC sobre Cambio Climático, Estrategias Nacionales de Adaptación'
    },
    { 
      value: 'seguridad_alimentaria_nutricion', 
      label: 'Seguridad alimentaria, nutrición sostenible y soberanía alimentaria',
      source: 'Informes sobre el Estado de la Seguridad Alimentaria y la Nutrición (FAO, OMS, PMA), Objetivos de Desarrollo Sostenible (ODS 2 - Hambre Cero)'
    },
    { 
      value: 'educacion_calidad_vida', 
      label: 'Educación de calidad inclusiva y equitativa para el desarrollo y calidad de vida',
      source: 'Objetivos de Desarrollo Sostenible (ODS 4 - Educación de Calidad), Informes Globales de Seguimiento de la Educación (UNESCO)'
    },
    { 
      value: 'arte_cultura_identidad', 
      label: 'Promoción del arte, la cultura y la diversidad de expresiones culturales como motor de identidad y desarrollo',
      source: 'Convención sobre la Protección y Promoción de la Diversidad de las Expresiones Culturales (UNESCO), Políticas Culturales Nacionales e Internacionales'
    },
    {
      value: 'ciudadania_global_responsable',
      label: 'Ciudadanía global activa y responsable con el entorno local y planetario',
      source: 'Iniciativas de Educación para la Ciudadanía Mundial (UNESCO), Marcos de Competencias Globales, Movimientos Sociales Globales'
    },
    {
      value: 'bienestar_mental_emocional',
      label: 'Promoción del bienestar mental y emocional en diversos contextos',
      source: 'Estrategias de Salud Mental Global (OMS), Investigaciones en Psicología Positiva y Bienestar, Programas de Prevención en Salud Mental'
    }
  ];
    
  // Mapeo de demandas sugeridas por facultad (área general)
  const demandsByFaculty = {
    ingenieria_tecnologia: ['desarrollo_sostenible', 'innovacion_impacto_social', 'etica_profesional', 'adaptabilidad_resiliencia', 'transformacion_digital_sociedad', 'gestion_riesgos_desastres'],
    ciencias_basicas_exactas: ['desarrollo_sostenible', 'pensamiento_critico_social', 'etica_profesional', 'innovacion_impacto_social', 'adaptabilidad_resiliencia'],
    ciencias_salud: ['inclusion_social', 'etica_profesional', 'salud_bienestar_comunitario', 'derechos_humanos_paz', 'pensamiento_critico_social', 'bienestar_mental_emocional'],
    ciencias_sociales_humanidades: ['inclusion_social', 'participacion_ciudadana', 'comunicacion_intercultural', 'pensamiento_critico_social', 'derechos_humanos_paz', 'arte_cultura_identidad', 'ciudadania_global_responsable'],
    ciencias_juridicas_politicas: ['participacion_ciudadana', 'etica_profesional', 'inclusion_social', 'derechos_humanos_paz', 'pensamiento_critico_social', 'ciudadania_global_responsable'],
    ciencias_economicas_administrativas: ['etica_profesional', 'innovacion_impacto_social', 'desarrollo_sostenible', 'inclusion_social', 'transformacion_digital_sociedad', 'adaptabilidad_resiliencia'],
    ciencias_agrarias_ambientales: ['desarrollo_sostenible', 'seguridad_alimentaria_nutricion', 'gestion_riesgos_desastres', 'etica_profesional', 'innovacion_impacto_social'],
    educacion_pedagogia: ['educacion_calidad_vida', 'inclusion_social', 'comunicacion_intercultural', 'etica_profesional', 'pensamiento_critico_social', 'ciudadania_global_responsable', 'bienestar_mental_emocional'],
    artes_diseno_arquitectura: ['arte_cultura_identidad', 'innovacion_impacto_social', 'desarrollo_sostenible', 'comunicacion_intercultural', 'etica_profesional', 'inclusion_social'],
    ciencias_computacion_tics: ['transformacion_digital_sociedad', 'etica_profesional', 'innovacion_impacto_social', 'adaptabilidad_resiliencia', 'desarrollo_sostenible', 'inclusion_social'],
    ciencias_deporte_recreacion: ['salud_bienestar_comunitario', 'inclusion_social', 'etica_profesional', 'educacion_calidad_vida', 'bienestar_mental_emocional'],
    comunicacion_periodismo_publicidad: ['comunicacion_intercultural', 'etica_profesional', 'transformacion_digital_sociedad', 'participacion_ciudadana', 'pensamiento_critico_social', 'ciudadania_global_responsable'],
  };
    
  // Mapeo de demandas sugeridas por carrera (más específico)
  // Debes expandir esto para las carreras que añadiste en ProgramForm.jsx
  const demandsByDegree = {
    // Ingeniería y Tecnología
    'Ingeniería de Sistemas': ['innovacion_impacto_social', 'adaptabilidad_resiliencia', 'etica_profesional', 'desarrollo_sostenible', 'transformacion_digital_sociedad'],
    'Ingeniería Civil': ['desarrollo_sostenible', 'gestion_riesgos_desastres', 'etica_profesional', 'innovacion_impacto_social', 'participacion_ciudadana'],
    'Ingeniería Electrónica': ['innovacion_impacto_social', 'transformacion_digital_sociedad', 'desarrollo_sostenible', 'etica_profesional', 'adaptabilidad_resiliencia'],
    'Ingeniería Industrial': ['desarrollo_sostenible', 'innovacion_impacto_social', 'etica_profesional', 'adaptabilidad_resiliencia', 'gestion_riesgos_desastres'],
    'Ingeniería Mecánica': ['desarrollo_sostenible', 'innovacion_impacto_social', 'etica_profesional', 'gestion_riesgos_desastres', 'adaptabilidad_resiliencia'],
    'Ingeniería Química': ['desarrollo_sostenible', 'etica_profesional', 'innovacion_impacto_social', 'gestion_riesgos_desastres', 'seguridad_alimentaria_nutricion'], // Ejemplo, puede variar
    'Ingeniería de Software': ['innovacion_impacto_social', 'transformacion_digital_sociedad', 'etica_profesional', 'adaptabilidad_resiliencia', 'inclusion_social'],
    'Ingeniería en Telecomunicaciones': ['transformacion_digital_sociedad', 'innovacion_impacto_social', 'desarrollo_sostenible', 'etica_profesional', 'inclusion_social'],
    'Ingeniería Biomédica': ['salud_bienestar_comunitario', 'innovacion_impacto_social', 'etica_profesional', 'inclusion_social', 'desarrollo_sostenible'],
    'Ingeniería Mecatrónica': ['innovacion_impacto_social', 'transformacion_digital_sociedad', 'desarrollo_sostenible', 'etica_profesional', 'adaptabilidad_resiliencia'],
    
    // Ciencias Básicas y Exactas
    'Física': ['pensamiento_critico_social', 'innovacion_impacto_social', 'desarrollo_sostenible', 'etica_profesional', 'educacion_calidad_vida'],
    'Matemáticas': ['pensamiento_critico_social', 'innovacion_impacto_social', 'transformacion_digital_sociedad', 'etica_profesional', 'educacion_calidad_vida'],
    'Química': ['desarrollo_sostenible', 'innovacion_impacto_social', 'etica_profesional', 'seguridad_alimentaria_nutricion', 'salud_bienestar_comunitario'],
    'Biología': ['desarrollo_sostenible', 'gestion_riesgos_desastres', 'salud_bienestar_comunitario', 'etica_profesional', 'seguridad_alimentaria_nutricion'],
    'Estadística': ['pensamiento_critico_social', 'transformacion_digital_sociedad', 'innovacion_impacto_social', 'etica_profesional', 'inclusion_social'],
    'Geología': ['desarrollo_sostenible', 'gestion_riesgos_desastres', 'etica_profesional', 'innovacion_impacto_social', 'participacion_ciudadana'],
  
    // Ciencias de la Salud
    'Medicina': ['salud_bienestar_comunitario', 'inclusion_social', 'etica_profesional', 'pensamiento_critico_social', 'derechos_humanos_paz', 'bienestar_mental_emocional'],
    'Enfermería': ['salud_bienestar_comunitario', 'inclusion_social', 'etica_profesional', 'comunicacion_intercultural', 'derechos_humanos_paz', 'bienestar_mental_emocional'],
    'Odontología': ['salud_bienestar_comunitario', 'inclusion_social', 'etica_profesional', 'innovacion_impacto_social', 'bienestar_mental_emocional'],
    'Fisioterapia': ['salud_bienestar_comunitario', 'inclusion_social', 'etica_profesional', 'adaptabilidad_resiliencia', 'bienestar_mental_emocional'],
    'Nutrición y Dietética': ['salud_bienestar_comunitario', 'seguridad_alimentaria_nutricion', 'inclusion_social', 'etica_profesional', 'educacion_calidad_vida'],
    'Farmacia': ['salud_bienestar_comunitario', 'etica_profesional', 'innovacion_impacto_social', 'seguridad_alimentaria_nutricion', 'desarrollo_sostenible'],
    'Psicología Clínica': ['salud_bienestar_comunitario', 'inclusion_social', 'etica_profesional', 'pensamiento_critico_social', 'bienestar_mental_emocional', 'derechos_humanos_paz'],
    
    // Ciencias Sociales y Humanidades
    'Psicología': ['inclusion_social', 'salud_bienestar_comunitario', 'etica_profesional', 'comunicacion_intercultural', 'pensamiento_critico_social', 'bienestar_mental_emocional'],
    'Trabajo Social': ['inclusion_social', 'participacion_ciudadana', 'derechos_humanos_paz', 'etica_profesional', 'salud_bienestar_comunitario', 'gestion_riesgos_desastres'],
    'Sociología': ['inclusion_social', 'participacion_ciudadana', 'pensamiento_critico_social', 'etica_profesional', 'comunicacion_intercultural', 'ciudadania_global_responsable'],
    'Historia': ['pensamiento_critico_social', 'comunicacion_intercultural', 'arte_cultura_identidad', 'etica_profesional', 'derechos_humanos_paz'],
    'Filosofía': ['pensamiento_critico_social', 'etica_profesional', 'derechos_humanos_paz', 'participacion_ciudadana', 'ciudadania_global_responsable'],
    'Antropología': ['comunicacion_intercultural', 'inclusion_social', 'pensamiento_critico_social', 'arte_cultura_identidad', 'derechos_humanos_paz', 'desarrollo_sostenible'],
    'Ciencias de la Comunicación': ['comunicacion_intercultural', 'participacion_ciudadana', 'etica_profesional', 'transformacion_digital_sociedad', 'pensamiento_critico_social', 'ciudadania_global_responsable'],
    
    // Ciencias Jurídicas y Políticas
    'Derecho': ['derechos_humanos_paz', 'participacion_ciudadana', 'etica_profesional', 'inclusion_social', 'pensamiento_critico_social', 'gestion_riesgos_desastres'], // Ej: derecho ambiental
    'Ciencias Políticas': ['participacion_ciudadana', 'pensamiento_critico_social', 'etica_profesional', 'inclusion_social', 'derechos_humanos_paz', 'ciudadania_global_responsable'],
    'Relaciones Internacionales': ['derechos_humanos_paz', 'participacion_ciudadana', 'comunicacion_intercultural', 'pensamiento_critico_social', 'gestion_riesgos_desastres', 'ciudadania_global_responsable'],
  
    // Ciencias Económicas y Administrativas
    'Administración de Empresas': ['innovacion_impacto_social', 'etica_profesional', 'desarrollo_sostenible', 'transformacion_digital_sociedad', 'adaptabilidad_resiliencia', 'inclusion_social'],
    'Contaduría Pública': ['etica_profesional', 'innovacion_impacto_social', 'desarrollo_sostenible', 'transformacion_digital_sociedad', 'participacion_ciudadana'],
    'Economía': ['pensamiento_critico_social', 'desarrollo_sostenible', 'etica_profesional', 'innovacion_impacto_social', 'inclusion_social', 'transformacion_digital_sociedad'],
    'Marketing': ['innovacion_impacto_social', 'etica_profesional', 'transformacion_digital_sociedad', 'comunicacion_intercultural', 'inclusion_social', 'desarrollo_sostenible'],
    'Negocios Internacionales': ['innovacion_impacto_social', 'etica_profesional', 'comunicacion_intercultural', 'desarrollo_sostenible', 'transformacion_digital_sociedad', 'ciudadania_global_responsable'],
    'Finanzas': ['etica_profesional', 'innovacion_impacto_social', 'desarrollo_sostenible', 'transformacion_digital_sociedad', 'pensamiento_critico_social'],
  
    // Ciencias Agrarias y Ambientales
    'Ingeniería Agronómica': ['seguridad_alimentaria_nutricion', 'desarrollo_sostenible', 'gestion_riesgos_desastres', 'etica_profesional', 'innovacion_impacto_social', 'participacion_ciudadana'],
    'Medicina Veterinaria': ['salud_bienestar_comunitario', 'seguridad_alimentaria_nutricion', 'etica_profesional', 'desarrollo_sostenible', 'gestion_riesgos_desastres'],
    'Ingeniería Ambiental': ['desarrollo_sostenible', 'gestion_riesgos_desastres', 'etica_profesional', 'innovacion_impacto_social', 'participacion_ciudadana', 'salud_bienestar_comunitario'],
    'Zootecnia': ['seguridad_alimentaria_nutricion', 'desarrollo_sostenible', 'etica_profesional', 'innovacion_impacto_social', 'salud_bienestar_comunitario'],
  
    // Educación y Pedagogía
    'Licenciatura en Educación Infantil': ['educacion_calidad_vida', 'inclusion_social', 'comunicacion_intercultural', 'etica_profesional', 'salud_bienestar_comunitario', 'bienestar_mental_emocional'],
    'Licenciatura en Lenguas Extranjeras': ['educacion_calidad_vida', 'comunicacion_intercultural', 'inclusion_social', 'etica_profesional', 'ciudadania_global_responsable', 'arte_cultura_identidad'],
    'Licenciatura en Matemáticas': ['educacion_calidad_vida', 'pensamiento_critico_social', 'innovacion_impacto_social', 'etica_profesional', 'transformacion_digital_sociedad'],
    'Pedagogía': ['educacion_calidad_vida', 'inclusion_social', 'pensamiento_critico_social', 'etica_profesional', 'comunicacion_intercultural', 'ciudadania_global_responsable'],
  
    // Artes, Diseño y Arquitectura
    'Arquitectura': ['desarrollo_sostenible', 'inclusion_social', 'innovacion_impacto_social', 'etica_profesional', 'arte_cultura_identidad', 'participacion_ciudadana'],
    'Diseño Gráfico': ['comunicacion_intercultural', 'innovacion_impacto_social', 'etica_profesional', 'arte_cultura_identidad', 'transformacion_digital_sociedad', 'inclusion_social'],
    'Diseño Industrial': ['desarrollo_sostenible', 'innovacion_impacto_social', 'etica_profesional', 'inclusion_social', 'adaptabilidad_resiliencia'],
    'Música': ['arte_cultura_identidad', 'comunicacion_intercultural', 'educacion_calidad_vida', 'etica_profesional', 'innovacion_impacto_social', 'bienestar_mental_emocional'],
    'Artes Visuales': ['arte_cultura_identidad', 'pensamiento_critico_social', 'comunicacion_intercultural', 'etica_profesional', 'innovacion_impacto_social', 'inclusion_social'],
    'Diseño de Modas': ['desarrollo_sostenible', 'innovacion_impacto_social', 'etica_profesional', 'arte_cultura_identidad', 'comunicacion_intercultural', 'inclusion_social'],
  
    // Comunicación, Periodismo y Publicidad
    'Periodismo': ['participacion_ciudadana', 'etica_profesional', 'pensamiento_critico_social', 'derechos_humanos_paz', 'transformacion_digital_sociedad', 'comunicacion_intercultural'],
    'Publicidad': ['etica_profesional', 'innovacion_impacto_social', 'comunicacion_intercultural', 'transformacion_digital_sociedad', 'inclusion_social', 'desarrollo_sostenible'],
  };
    
  export const getSuggestedSocioformativeDemands = (degree, faculty) => {
    let suggested = [];
    // Prioridad a las demandas específicas de la carrera
    if (degree && demandsByDegree[degree]) {
      suggested = [...new Set(demandsByDegree[degree])]; // Asegurar unicidad desde el inicio
    } 
    // Si no hay específicas de carrera O queremos complementar, usa las de la facultad (si se proporciona)
    // Esta lógica combina ambas si la carrera no tiene definición específica, o si quisieras agregar las de facultad siempre.
    // Para el caso actual: si degree tiene, usa esas. Si no, usa las de faculty.
    else if (faculty && demandsByFaculty[faculty]) { 
      suggested = [...new Set(demandsByFaculty[faculty])]; // Asegurar unicidad
    }
    
    // Si quisieras una combinación (ej. carrera + facultad general, eliminando duplicados):
    // let degreeSpecificDemands = (degree && demandsByDegree[degree]) ? demandsByDegree[degree] : [];
    // let facultyGeneralDemands = (faculty && demandsByFaculty[faculty]) ? demandsByFaculty[faculty] : [];
    // suggested = [...new Set([...degreeSpecificDemands, ...facultyGeneralDemands])];
  
    return suggested; // Ya está asegurada la unicidad
  };