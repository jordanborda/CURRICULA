// File: api/generateCurriculaPlan.js

// Esta es la única exportación por defecto necesaria
export default async function handler(req, res) {
  console.log("API /api/generateCurriculaPlan RECIBIDA PETICIÓN");
  const { programData } = req.body;

  if (!programData) {
    console.error("API ERROR: Faltan datos del programa (programData).");
    return res.status(400).json({ error: 'Faltan datos del programa (programData).' });
  }
  console.log("API programData:", JSON.stringify(programData, null, 2));

  const results = {};
  // Actualizar modesToGenerate para incluir la nueva tabla
  const modesToGenerate = ['demandas', 'perfiles', 'competencias', 'malla', 'plan_estudios', 'resumen_areas'];
  let allGeneratedMarkdown = {};
  let hasErrors = false;

  try {
    console.log("API Iniciando generación de tablas...");
    for (const currentMode of modesToGenerate) {
      console.log(`API Generando tabla para el modo: ${currentMode}`);
      const keySuffix = currentMode.split('_').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
      const resultKey = `plan${keySuffix}`; // e.g., planResumenAreas

      const prompt = buildPrompt(currentMode, programData || {}, allGeneratedMarkdown);
      // Descomentar la siguiente línea para depurar los prompts enviados a Gemini
      // console.log(`API Prompt para ${currentMode}: \n${prompt}\n------------------\n------------------\n`);

      try {
        const tablaMarkdown = await askGemini(prompt, currentMode);
        results[resultKey] = tablaMarkdown;
        allGeneratedMarkdown[currentMode] = tablaMarkdown;
        console.log(`API Tabla para ${currentMode} generada exitosamente (longitud: ${tablaMarkdown?.length || 0})`);
      } catch (error) {
        console.error(`API Error al generar la tabla para ${currentMode}: ${error.message}`);
        if (error.stack) {
            console.error(`API StackTrace para ${currentMode}: ${error.stack}`);
        }
        results[resultKey] = `Error al generar la tabla '${currentMode}': ${error.message}`;
        allGeneratedMarkdown[currentMode] = `Error en ${currentMode}: ${error.message}`; // Marcar error para prompts dependientes
        hasErrors = true;
      }
    }

    console.log("API Generación de todas las tablas completada.");
    console.log("API Claves en results:", Object.keys(results).join(', '));

    // Devolver todos los resultados
    return res.status(hasErrors ? 207 : 200).json({
      ...results, // Esto incluirá planDemandas, planPerfiles, etc. y el nuevo planResumenAreas
      formatoMarkdown: true,
      statusGlobal: hasErrors ? "Parcialmente completado con errores" : "Completado exitosamente"
    });

  } catch (error) {
    console.error('API Error GENERAL en el handler de múltiples tablas:', error.message);
    if (error.stack) {
        console.error(`API StackTrace GENERAL: ${error.stack}`);
    }
    return res
      .status(500)
      .json({ error: 'Error general al procesar la solicitud de múltiples tablas', details: error.message });
  }
} // Fin de la función handler

function buildPrompt(mode, p, previousResults = {}) {
  const degree = p.degree || "[Grado no especificado]";
  const duration = parseInt(p.duration, 10) || 0;
  const semestersPerYear = parseInt(p.semestersPerYear, 10) || 0;
  const faculty = p.faculty ? p.faculty.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : "[Área de conocimiento no especificada]";
  const totalCiclos = (duration > 0 && semestersPerYear > 0) ? duration * semestersPerYear : 10; // Usado en malla y plan_estudios

  const numSelectedDemands = p.socioformativeDemands ? p.socioformativeDemands.length : 0;
  const socioformativeDemandsSelectedList = p.socioformativeDemands && p.socioformativeDemands.length > 0
    ? p.socioformativeDemands.map(d => d.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()))
    : [];
  const socioformativeDemandsSelectedText = socioformativeDemandsSelectedList.length > 0
    ? socioformativeDemandsSelectedList.join('; ')
    : "[No se especificaron demandas socioformativas por el usuario; por favor, sugiere las más relevantes para el área/carrera, considerando tendencias globales y locales]";

  // Contextos de tablas previas
  const demandasContext = previousResults.demandas && !previousResults.demandas.startsWith("Error")
    ? `\n\nContexto de Demandas Socioformativas y Ejes Curriculares (Tabla 1):\n${previousResults.demandas}\n`
    : "\n\n(Contexto de Tabla 1 no disponible o con errores).";
  const perfilesContext = previousResults.perfiles && !previousResults.perfiles.startsWith("Error")
    ? `\n\nContexto de Perfiles de Egreso (Tabla 2):\n${previousResults.perfiles}\n`
    : "\n\n(Contexto de Tabla 2 no disponible o con errores).";
  const competenciasContext = previousResults.competencias && !previousResults.competencias.startsWith("Error")
    ? `\n\nContexto de Competencias y Asignaturas (Tabla 3):\n${previousResults.competencias}\n`
    : "\n\n(Contexto de Tabla 3 no disponible o con errores).";
  const mallaContext = previousResults.malla && !previousResults.malla.startsWith("Error")
    ? `\n\nContexto de la Malla Curricular (Tabla 4):\n${previousResults.malla}\n`
    : "\n\n(Contexto de Tabla 4 no disponible o con errores).";
  const planEstudiosContext = previousResults.plan_estudios && !previousResults.plan_estudios.startsWith("Error")
    ? `\n\nContexto del Plan de Estudios Detallado (Tabla 5):\n${previousResults.plan_estudios}\n`
    : "\n\n(Contexto de Tabla 5 no disponible o con errores).";


  if (mode === 'demandas') {
    return `Genera únicamente una tabla en formato Markdown con los siguientes encabezados exactos (sin texto introductorio ni conclusiones):

| Demandas socio formativas | Fuentes y Fundamentación | Determinación de ejes de desarrollo curricular en función a demandas priorizadas | Elaboración de perfiles de egreso (Visión Estratégica) |
| --- | --- | --- | --- |

Para la carrera de **${degree}** (Área/Facultad: **${faculty}**). Duración: ${duration} años.

${numSelectedDemands > 0 
  ? `El usuario ha seleccionado las siguientes ${numSelectedDemands} demandas socio formativas. DEBES UTILIZAR EXACTAMENTE ESTAS ${numSelectedDemands} DEMANDAS EN LA PRIMERA COLUMNA, describiéndolas detalladamente: **${socioformativeDemandsSelectedText}**.`
  : `El usuario no ha especificado demandas socio formativas. Por favor, identifica y describe entre 3 y 5 demandas cruciales y actuales para el programa, como se indica abajo. Luego, usa estas demandas para el resto de la tabla. (Demandas seleccionadas por el usuario: ${socioformativeDemandsSelectedText})`
}

Instrucciones detalladas para cada columna:

1.  **Columna "Demandas socio formativas":**
    *   ${numSelectedDemands > 0 
      ? `Utiliza **EXCLUSIVAMENTE las ${numSelectedDemands} demandas socio formativas seleccionadas por el usuario** (listadas arriba). Para CADA UNA de estas ${numSelectedDemands} demandas, elabora una descripción detallada que explique su relevancia e impacto en el contexto profesional y social para **${degree}**.`
      : `Identifica y describe con detalle **entre 3 y 5 demandas socio formativas CRUCIALES y ACTUALES** para la formación en **${degree}** dentro del área de **${faculty}**.`
    }
    *   Para cada demanda, utiliza un lenguaje preciso (ej. "Desarrollar soluciones tecnológicas innovadoras y éticas para abordar desafíos energéticos globales, promoviendo la eficiencia y el uso de fuentes renovables en concordancia con los ODS.").
    *   Indica el alcance de la demanda (ej. Global - ODS 7; Nacional - Estrategia Energética 2040; Sectorial - Tendencias IEEE) y una referencia clave. Sé específico pero conciso. Usa <br /> para saltos de línea si es necesario dentro de la celda.

2.  **Columna "Fuentes y Fundamentación":**
    *   Para CADA demanda listada en la columna anterior, proporciona una breve fundamentación (1-2 frases) y menciona las fuentes principales que la sustentan.
    *   Las fuentes deben ser reconocidas y pertinentes (ej. UNESCO "Educación para los ODS"; OCDE "Perspectivas del Empleo"; OIT "Futuro del Trabajo"; OMS "Estrategias de Salud Global"; Pacto Mundial ONU; IPCC "Reportes Climáticos"; informes sectoriales de organizaciones como IEEE, ACM; legislación nacional relevante; estudios de prospectiva laboral reconocidos).
    *   La fundamentación debe explicar por qué esa demanda es importante para la carrera **${degree}** y cómo se vincula con las fuentes citadas.
    *   Ejemplo: "Fuente: ODS 7 y 13 (ONU), Agencia Internacional de Energía (IEA). Fundamentación: La transición energética y la mitigación del cambio climático son imperativos globales que requieren ingenieros con competencias en energías limpias y gestión sostenible."
    *   Usa <br /> para separar fuente de fundamentación si lo deseas.

3.  **Columna "Determinación de ejes de desarrollo curricular en función a demandas priorizadas":**
    *   Considerando el CONJUNTO de demandas listadas en la columna 1, define **exactamente 4 EJES CURRICULARES TRANSVERSALES**. Estos ejes deben ser líneas formativas estratégicas que guiarán el diseño del plan de estudios y deben estar directamente inspirados y articulados por el conjunto de demandas listadas.
    *   Nombra cada eje de forma clara y descriptiva (ej. "I. Innovación, Sostenibilidad y Ética Profesional en ${degree}", "II. Transformación Digital y Gestión de Datos para ${degree}", "III. Desarrollo de Competencias Interpersonales y Liderazgo en Proyectos de ${degree}", "IV. Investigación Aplicada y Solución de Problemas Complejos del Sector").
    *   Utiliza una lista numerada Markdown (I., II., III., IV.) DENTRO de esta celda, separando cada eje con un salto de línea.
    *   Este contenido debe aparecer **solo en la primera fila** de esta columna; las filas subsiguientes de esta columna pueden quedar vacías o con un guion (-).

4.  **Columna "Elaboración de perfiles de egreso (Visión Estratégica)":**
    *   Este contenido también aplica al CONJUNTO de demandas y ejes, y debe aparecer **solo en la primera fila** de esta columna; las filas subsiguientes pueden quedar vacías o con un guion (-).
    *   Utiliza el siguiente formato estructurado DENTRO de la celda, usando saltos de línea Markdown (<br />) para separar cada sección principal:
        *   **Fórmula General de Perfil:** \`Elaboración de perfiles de egreso basada en: Verbo de acción (dominio cognitivo, procedimental o actitudinal) + objeto de conocimiento/habilidad clave + condición metodológica/contexto de aplicación + finalidad/impacto esperado.\`
        *   <br /><br />
        *   **Visión del Perfil con Competencias Genéricas:**<br />- Describe cómo los 4 ejes curriculares (columna 3) se articularán para formar un egresado con sólidas competencias genéricas como: pensamiento crítico y analítico para la resolución de problemas complejos; comunicación efectiva en contextos diversos; trabajo colaborativo en equipos multidisciplinares; liderazgo ético y adaptabilidad al cambio; y compromiso con el aprendizaje continuo y la ciudadanía global, todo ello en respuesta a las demandas identificadas.
        *   <br /><br />
        *   **Visión del Perfil con Competencias Específicas para ${degree}:**<br />- Describe cómo los 4 ejes curriculares se traducirán en un perfil profesional para **${degree}**. Esta visión debe ser lo suficientemente amplia para fundamentar la posterior derivación de múltiples perfiles de egreso especializados en la siguiente tabla (Tabla 2), idealmente buscando delinear cómo cada demanda socioformativa podría inspirar al menos dos enfoques o perfiles distintos. Indica cómo se desarrollarán competencias técnicas y especializadas distintivas, como por ejemplo: [Menciona 2-3 áreas de competencia específica relevantes para ${degree} que puedan dar pie a múltiples especializaciones, ej. "diseño y gestión de sistemas X con énfasis en IA y Sostenibilidad", "aplicación de metodologías Y para la optimización de Z en contextos A y B", "investigación y desarrollo de nuevas tecnologías en el ámbito W para sectores emergentes y tradicionales"], que le permitan responder eficazmente a las demandas del sector y desempeñarse en roles diversos como [Menciona 1-2 ejemplos de roles amplios o familias de roles, ej. "Consultor especializado en diversas aplicaciones de...", "Líder de proyectos de innovación y transformación en múltiples industrias..."].

5.  Devuelve **solo** la tabla Markdown. Asegúrate de que la tabla tenga exactamente 4 columnas como se especifica. Presta MUCHA atención al formato de listas y saltos de línea (<br />) DENTRO de las celdas para asegurar la legibilidad y correcta renderización. No añadas texto fuera de la tabla.
`;
  }

  if (mode === 'perfiles') {
    const targetNumPerfiles = numSelectedDemands > 0 ? numSelectedDemands * 2 : "entre 4 y 6";
    const explanationNumPerfiles = numSelectedDemands > 0
        ? `Dado que el usuario seleccionó ${numSelectedDemands} demandas socioformativas, esto significa que debes proponer ${targetNumPerfiles} perfiles (aproximadamente dos perfiles derivados o enfocados por cada demanda principal).`
        : `Dado que el usuario no especificó demandas, propón entre 4 y 6 perfiles bien justificados.`;

    return `Genera únicamente una tabla en formato Markdown con los siguientes encabezados (sin texto introductorio ni conclusiones):

| Listado de perfiles de egreso | Formulación de competencias por cada perfil | Formulación de capacidades por cada competencia | Formulación de desempeños por cada competencia |
| --- | --- | --- | --- |

Para la carrera de **${degree}** (duración: ${duration} años, ${semestersPerYear} semestres por año).
Demandas socioformativas a considerar (provistas por el usuario o inferidas): **${socioformativeDemandsSelectedText}**.
${demandasContext}

**Instrucciones CRUCIALES para TODAS las columnas de esta tabla:**
*   **TODOS los verbos utilizados para definir perfiles, competencias, capacidades y desempeños deben estar conjugados en TERCERA PERSONA DEL SINGULAR EN TIEMPO PRESENTE** (ej. Diseña, Analiza, Evalúa, Implementa, Gestiona, Comunica, Lidera, Resuelve, Investiga, etc.).

**Instrucciones detalladas por columna:**

1.  **Columna "Listado de perfiles de egreso":**
    *   Propón **exactamente ${targetNumPerfiles} perfiles de egreso** específicos y diferenciados para **${degree}**. ${explanationNumPerfiles}
    *   Estos perfiles deben responder directamente a las demandas socioformativas y los ejes curriculares identificados en el contexto de la Tabla 1 (si está disponible) y ser relevantes para el campo profesional actual.
    *   **CADA perfil de egreso DEBE seguir la siguiente estructura exacta:** \`Verbo en 3ra persona singular presente (ej. Diseña, Gestiona) + Objeto del conocimiento/habilidad clave (ej. sistemas de información innovadores) + Condición metodológica/contexto de aplicación (ej. aplicando metodologías ágiles y tecnologías emergentes) + Finalidad/impacto esperado (ej. para optimizar procesos organizacionales y generar valor competitivo).\`
    *   Ejemplo de un perfil: \`Desarrolla soluciones de software sostenibles utilizando principios de ingeniería verde y arquitecturas limpias para minimizar el impacto ambiental de la tecnología.\`

2.  **Columna "Formulación de competencias por cada perfil":**
    *   Para CADA perfil de egreso listado en la columna anterior, formula de 2 a 3 competencias CLAVE (usa numeración como 1.1, 1.2 para el primer perfil; 2.1, 2.2 para el segundo, etc.).
    *   **CADA competencia DEBE seguir la estructura:** \`Verbo en 3ra persona singular presente + Conocimiento clave + Condición metodológica + Finalidad.\`
    *   Ejemplo de competencia: \`Aplica principios de inteligencia artificial y aprendizaje automático mediante el uso de algoritmos y herramientas especializadas para la creación de modelos predictivos que mejoren la toma de decisiones.\`

3.  **Columna "Formulación de capacidades por cada competencia":**
    *   Para CADA una de las competencias formuladas en la columna anterior, define 2 a 3 capacidades CONCRETAS (usa numeración como 1.1.1, 1.1.2 para la primera competencia del primer perfil, etc.).
    *   **CADA capacidad DEBE seguir la estructura:** \`Verbo en 3ra persona singular presente + Conocimiento específico + Condición metodológica / producto esperado.\`
    *   Ejemplo de capacidad: \`Implementa modelos de redes neuronales utilizando bibliotecas de Python como TensorFlow o PyTorch para el análisis de grandes volúmenes de datos no estructurados.\`

4.  **Columna "Formulación de desempeños por cada competencia" (Nota: el encabezado dice "por cada competencia", pero la práctica es desglosar las capacidades en desempeños):**
    *   Para CADA una de las capacidades formuladas en la columna anterior, describe de 2 a 4 desempeños OBSERVABLES y MEDIBLES (usa numeración como 1.1.1.1, 1.1.1.2 para la primera capacidad, etc.).
    *   **CADA desempeño DEBE seguir la estructura:** \`Conocimiento específico/habilidad + Verbo en 3ra persona singular presente + Condición metodológica específica y detallada/Criterio de calidad.\` (Ajuste: el verbo sigue siendo 3ra persona, pero el sujeto puede ser el conocimiento/habilidad que se manifiesta).
    *   Ejemplo de desempeño: \`Preprocesa conjuntos de datos masivos aplicando técnicas de limpieza, normalización y transformación para asegurar la calidad y adecuación de los datos para el modelado.\`
    *   Otro ejemplo: \`Entrena un modelo de clasificación supervisada ajustando hiperparámetros y evaluando su rendimiento mediante métricas como precisión, recall y F1-score para resolver un problema de negocio específico.\`

5.  Devuelve **solo** la tabla Markdown. No agregues anotaciones ni texto introductorio o final. Asegúrate de que todas las celdas estén correctamente alineadas y que los listados numerados dentro de las celdas sean claros.
`;
  }

  if (mode === 'competencias') {
    return `Genera únicamente una tabla en formato Markdown con los siguientes encabezados (sin texto introductorio ni conclusiones):

| Listado de competencias | Tipo de competencias | Perfiles de Egreso Relevantes | Denominación de la Asignatura de Estudios Generales (10-11 asignaturas de 3 créd.) | Denominación de la Asignatura de Estudios Específicos (aprox. 55 asignaturas de 3 créd.) | Denominación de la Asignatura de Estudios Especialidad |
| --- | --- | --- | --- | --- | --- |

Para la carrera de **${degree}**.
Demandas socioformativas a considerar: **${socioformativeDemandsSelectedText}**.
${demandasContext}
${perfilesContext} 

1.  En la columna "Listado de competencias", propón un conjunto coherente de competencias. Divide estas en **Genéricas** (al menos 4-5, ej. Pensamiento Crítico, Comunicación Intercultural, Liderazgo Ético, Innovación y Emprendimiento, Alfabetización Digital) y **Específicas** (al menos 6-8, directamente relacionadas con **${degree}**) en la columna "Tipo de competencias". Estas competencias deben estar claramente alineadas con los perfiles de egreso (contexto Tabla 2) y las demandas/ejes curriculares (contexto Tabla 1).
2.  **Columna "Perfiles de Egreso Relevantes":** Para CADA competencia listada, indica de forma precise a cuál(es) de los "Listado de perfiles de egreso" (del contexto Tabla 2) contribuye esta competencia de forma fundamental. Si una competencia es transversal a varios perfiles, lístalos (ej. "Todos los perfiles" o "Perfil X, Perfil Y"). Usa viñetas o <br /> para listar múltiples perfiles en una celda.
3.  **Columnas de Asignaturas:** Para cada competencia, y considerando los perfiles a los que sirve y los ejes curriculares, sugiere nombres de asignaturas representativas y pertinentes.
    *   Estudios Generales: asignaturas formativas transversales que desarrollan competencias fundamentales (ej. "Ética y Ciudadanía Global", "Comunicación Académica y Profesional", "Cultura Digital y Sociedad del Conocimiento").
    *   Estudios Específicos: asignaturas disciplinares esenciales y fundacionales para la carrera **${degree}** (ej. para Ing. Sistemas: "Algoritmia y Programación", "Bases de Datos", "Redes de Computadoras").
    *   Estudios Especialidad: asignaturas de profundización, aplicación profesional avanzada y electivas especializadas (ej. para Ing. Sistemas: "Inteligencia Artificial Aplicada", "Ciberseguridad Avanzada", "Desarrollo de Aplicaciones Móviles").
4.  Asegura que las asignaturas propuestas sumen aproximadamente el número de créditos indicado para cada tipo de estudio a lo largo de toda la carrera. Mantén las celdas alineadas y usa saltos de línea (<br />) o viñetas si necesitas listar varias asignaturas en una celda.
5.  Devuelve **solo** la tabla Markdown.`;
  }

  if (mode === 'malla') {
    const ciclosLimitados = Math.min(12, totalCiclos);
    const cicloHeaders = Array.from({ length: ciclosLimitados }, (_, i) => i + 1).join(' | ');
    const cicloSeparators = Array.from({ length: ciclosLimitados }, () => '---').join(' | ');

    return `Genera únicamente una tabla en formato Markdown con los siguientes encabezados (sin texto introductorio ni conclusiones):

| Competencias (Genéricas y Específicas) | ${cicloHeaders} |
| --- | ${cicloSeparators} |

Para la carrera de **${degree}** (duración: ${duration} años, ${semestersPerYear} periodos por año, resultando en ${ciclosLimitados} ciclos/semestres para la malla).
${competenciasContext} 
${perfilesContext}
${demandasContext}

1.  **Columna "Competencias":** Utiliza las MISMAS competencias (tanto Genéricas como Específicas) que fueron listadas en la tabla anterior de "Competencias y Asignaturas" (referenciada en el contexto de Tabla 3). Ordénalas: primero las Genéricas, luego las Específicas.
2.  Columnas numeradas (1 a ${ciclosLimitados}): Representan los ciclos/semestres.
3.  En cada celda de la malla (intersección competencia-semestre), indica **brevemente**:
    *   Nombre de la asignatura (DEBE SER CONSISTENTE con las asignaturas propuestas en la Tabla 3 para esa competencia, tipo de estudio y perfiles de egreso).
    *   Créditos entre paréntesis (ej. (3) o (4)).
    *   Tipo de estudio en cursiva (ej. _genérico_, _específico_ o _especialidad_).
    *   Ejemplo: \`Comunicación Efectiva (3) _genérico_\` o \`Física de Semiconductores (4) _específico_\`.
4.  Si una competencia no se trabaja directamente con una asignatura principal en un ciclo, escribe \`-\`.
5.  Distribuye las asignaturas de manera coherente a lo largo de los ciclos, mostrando una progresión lógica en el desarrollo de cada competencia. Considera una carga académica equilibrada por semestre (aprox. 15-20 créditos por semestre, si cada asignatura es de 3-4 créditos).
6.  Asegúrate de que las asignaturas listadas en esta malla coincidan con las propuestas en la tabla de "Competencias y Asignaturas" (Tabla 3).
7.  Devuelve **solo** la tabla Markdown.`;
  }

  if (mode === 'plan_estudios') {
    return `Genera únicamente una tabla en formato Markdown detallada del "Plan de Estudios" para la carrera de **${degree}**. Utiliza la información de la Malla Curricular (Tabla 4) como base principal.

Encabezados exactos de la tabla (sin texto introductorio ni conclusiones):
| Ciclo | Área | Código | Curso | Características del curso | Horas Teóricas | Horas Prácticas | Total de Horas | N° Créditos | HV Adicionales | Pre-Requisito(s) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

Contexto de la Carrera:
*   Carrera: **${degree}**
*   Duración: ${duration} años
*   Periodos por año: ${semestersPerYear} (Total de ciclos aproximado: ${totalCiclos})
*   Área/Facultad: **${faculty}**
${mallaContext}
${competenciasContext}

Instrucciones detalladas:

1.  **Iteración por Ciclo:** La tabla debe estar organizada por ciclo. Para cada ciclo (desde 1 hasta ${totalCiclos}), lista todas las asignaturas que aparecen en la Malla Curricular (Tabla 4) para ese ciclo.

2.  **Columna "Ciclo":** Número del semestre o ciclo académico (ej. 1, 2, ..., ${totalCiclos}).

3.  **Columna "Área":**
    *   Indica el área de conocimiento a la que pertenece el curso. Puede ser:
        *   "Estudios Generales" (EG)
        *   "Estudios Específicos de Carrera" (EC)
        *   "Estudios de Especialidad/Electivos" (EE)
        *   "Prácticas Pre-profesionales" (PP)
        *   "Investigación/Tesis" (IT)
    *   Esta clasificación debe ser coherente con los tipos de estudio mencionados en la Tabla 3 (Competencias y Asignaturas) y la Malla (Tabla 4).

4.  **Columna "Código":**
    *   Asigna un código único y sistemático para cada curso.
    *   Formato sugerido: \`[ÁREA_ABREV]-[CICLO][NN]\` donde [ÁREA_ABREV] puede ser EG, EC, EE, etc., [CICLO] es el número del ciclo, y [NN] es un secuencial de dos dígitos (01, 02, etc.).
    *   Ejemplo: EG-101, EC-302, EE-701.

5.  **Columna "Curso":**
    *   El nombre completo de la asignatura, tal como aparece en la Malla Curricular (Tabla 4) y fue definido en la Tabla 3 (Competencias y Asignaturas).

6.  **Columna "Características del curso":**
    *   Indica si el curso es "Obligatorio" (O) o "Electivo" (E). La mayoría serán obligatorios, basados en la malla. Si la malla incluye "electivas" genéricas, especifícalo.
    *   Puedes añadir una breve nota si es un curso especial, ej. "Proyecto Integrador", "Práctica en Empresa".

7.  **Columnas de Horas ("Horas Teóricas", "Horas Prácticas", "Total de Horas"):**
    *   Asigna un número razonable de horas semanales teóricas y prácticas para cada curso, considerando su naturaleza y créditos.
    *   Una guía común: 1 crédito ≈ 1 hora teórica semanal O 2-3 horas prácticas semanales.
    *   El "Total de Horas" es la suma de teóricas y prácticas semanales.
    *   Ejemplos:
        *   Curso teórico de 3 créditos: 3 HT, 0 HP, 3 TH.
        *   Curso teórico-práctico de 4 créditos: 3 HT, 2 HP, 5 TH. (2 HP pueden equivaler a 1 crédito de práctica)
        *   Curso taller/laboratorio de 3 créditos: 1 HT, 4 HP, 5 TH. (4 HP pueden equivaler a 2 créditos de práctica)
    *   **IMPORTANTE:** La suma de (Horas Teóricas + Horas Prácticas / 2) debe aproximarse al número de créditos. Ajusta la división de horas prácticas según la convención más común (a veces es /2, otras /3 para equivaler a un crédito). Para este ejercicio, usa Horas Prácticas / 2 para el cálculo de créditos.

8.  **Columna "N° Créditos":**
    *   El número de créditos del curso, consistente con la Malla Curricular (Tabla 4).
    *   Debe ser coherente con la asignación de horas: Créditos ≈ HT + (HP / 2). Si un curso tiene 3 créditos, podría ser (3HT, 0HP) o (2HT, 2HP) o (1HT, 4HP).

9.  **Columna "HV Adicionales":**
    *   Horas de Vinculación o Trabajo Autónomo del Estudiante Adicionales (semanales, estimadas).
    *   Representa el tiempo que el estudiante debería dedicar fuera de clase (estudio, tareas, proyectos).
    *   Sugerencia: Puede ser 1.5 a 2 veces el número de créditos. Ej: para un curso de 3 créditos, podría ser 4-6 HV Adicionales.
    *   Si no se maneja este concepto, puedes poner "-" o "N/A". Para este ejercicio, intenta estimarlo.

10. **Columna "Pre-Requisito(s)":**
    *   Lista los códigos de los cursos que deben ser aprobados antes de tomar este.
    *   Si no tiene, escribe "Ninguno" o "-".
    *   Si tiene varios, sepáralos por comas (ej. "EC-101, EG-102").
    *   La secuencialidad debe ser lógica y basarse en la progresión de la Malla Curricular y la naturaleza de los cursos.

11. **Consistencia:** Asegúrate de que la información (nombres de cursos, créditos) sea TOTALMENTE CONSISTENTE con lo establecido en la Tabla 3 (Competencias y Asignaturas) y la Tabla 4 (Malla Curricular). La Tabla 5 es una expansión detallada de la Tabla 4.

12. **Formato:** Devuelve **solo** la tabla Markdown. No añadas texto introductorio, conclusiones, ni ninguna otra explicación fuera de la tabla. Asegúrate de que las celdas estén bien alineadas.
`;
  }

  if (mode === 'resumen_areas') {
    return `Genera únicamente una tabla Markdown titulada "### 6.3.2. Resumen del plan de estudios por áreas de formación" para la carrera de **${degree}**.
Esta tabla DEBE BASARSE EXCLUSIVAMENTE en los datos presentados en la Tabla 5 (Plan de Estudios Detallado) que se proporciona en el contexto.

Encabezados exactos de la tabla (sin texto introductorio ni conclusiones, excepto el título solicitado arriba):
| ÁREAS | Nº DE CURSOS | Nº CRÉDITOS | % |
| --- | --- | --- | --- |

Contexto del Plan de Estudios Detallado (Tabla 5):
${planEstudiosContext}

Instrucciones detalladas para completar la tabla de resumen:

1.  **Filas de "ÁREAS":** La tabla debe tener exactamente las siguientes filas en este orden:
    *   Estudios Generales
    *   Estudios Específicos
    *   Estudios de Especialidad
    *   Total

2.  **Mapeo de Áreas de Tabla 5 a Filas de Tabla 6:**
    *   Para la fila "Estudios Generales" (Tabla 6): Considera los cursos de la Tabla 5 cuya columna "Área" esté marcada como "Estudios Generales" o su abreviatura (ej., EG).
    *   Para la fila "Estudios Específicos" (Tabla 6): Considera los cursos de la Tabla 5 cuya columna "Área" esté marcada como "Estudios Específicos de Carrera" o su abreviatura (ej., EC). También incluye aquí "Prácticas Pre-profesionales" (PP) e "Investigación/Tesis" (IT) si existen en la Tabla 5, ya que suelen ser específicos de la carrera.
    *   Para la fila "Estudios de Especialidad" (Tabla 6): Considera los cursos de la Tabla 5 cuya columna "Área" esté marcada como "Estudios de Especialidad/Electivos" o su abreviatura (ej., EE).

3.  **Columna "Nº DE CURSOS":**
    *   Para cada fila de "ÁREAS" (Estudios Generales, Específicos, Especialidad), cuenta el número total de cursos únicos que pertenecen a esa área según el mapeo del punto 2, basándote en la Tabla 5.
    *   En la fila "Total", suma el número de cursos de las tres áreas anteriores.

4.  **Columna "Nº CRÉDITOS":**
    *   Para cada fila de "ÁREAS", suma el total de "N° Créditos" de todos los cursos que pertenecen a esa área, según la información de la columna "N° Créditos" de la Tabla 5 y el mapeo del punto 2.
    *   En la fila "Total", suma los créditos de las tres áreas anteriores. Este será el total de créditos de la carrera.

5.  **Columna "%":**
    *   Para cada fila de "ÁREAS", calcula el porcentaje que representan sus "Nº CRÉDITOS" con respecto al "Nº CRÉDITOS" de la fila "Total".
    *   Fórmula: (% de Área X) = (Nº CRÉDITOS de Área X / Nº CRÉDITOS Total) * 100.
    *   Redondea el porcentaje a un decimal o a entero, como consideres más apropiado (ej. 33.3% o 33%).
    *   En la fila "Total", el porcentaje debe ser **100%** (o la suma exacta de los porcentajes, que debería ser muy cercana a 100%).

6.  **Precisión:** Es VITAL que los cálculos sean precisos y se basen estrictamente en los datos proporcionados en el contexto de la Tabla 5. No inventes números. Si la Tabla 5 tiene errores o está incompleta, refléjalo en la medida de lo posible o indica si no puedes hacer el cálculo.

7.  **Formato:** Devuelve el título "### 6.3.2. Resumen del plan de estudios por áreas de formación" (o un título similar si prefieres, pero que incluya "Resumen del plan de estudios por áreas de formación") seguido INMEDIATAMENTE por la tabla Markdown. No añadas más texto introductorio, conclusiones, ni ninguna otra explicación fuera de esto.
`;
  }

  console.error(`API BUILD_PROMPT_ERROR: Modo desconocido '${mode}'`);
  return `Error: modo de generación de tabla desconocido ('${mode}'). Por favor, especifica un modo válido.`;
}

async function askGemini(prompt, modeForLogging = "desconocido") {
  console.log(`API ASK_GEMINI (${modeForLogging}): Iniciando llamada con prompt de longitud ${prompt.length}.`);
  if (!prompt || prompt.startsWith("Error:")) {
    console.warn(`API ASK_GEMINI (${modeForLogging}): Prompt inválido o vacío: "${prompt}"`);
    throw new Error(`Prompt inválido o vacío para ${modeForLogging}: ${prompt}`);
  }

  // ¡¡¡IMPORTANTE: Mueve esta clave a una variable de entorno en producción!!!
  const apiKey = process.env.GEMINI_API_KEY || "AIzaSyD1eGLf367r5HdbCrA_KhyJTWI1z1THujY"; 
  
  if (!apiKey || apiKey === "AIzaSyD1eGLf367r5HdbCrA_KhyJTWI1z1THujY") {
      console.warn("API ASK_GEMINI: Usando clave API de ejemplo o no configurada. Asegúrate de configurar GEMINI_API_KEY en tus variables de entorno.");
  }

  const modelName = "gemini-1.5-flash-latest"; // Puedes cambiar a "gemini-1.5-pro-latest" para más capacidad si es necesario
  const fetchUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
  
  let apiRes;
  try {
    apiRes = await fetch(
      fetchUrl,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { 
            // Ajustar temperatura según el modo para balancear creatividad y precisión
            temperature: (modeForLogging === 'resumen_areas' || modeForLogging === 'plan_estudios') ? 0.2 : 0.45,
            maxOutputTokens: 8192, // Máximo para Flash, Pro tiene más.
            // Podrías considerar topP y topK si necesitas más control
            // topP: 0.95,
            // topK: 40,
          },
          // safetySettings: [ // Opcional: Ajustar niveles de seguridad si es necesario
          //   { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          //   { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          //   { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          //   { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          // ],
        }),
      }
    );
  } catch (networkError) {
      console.error(`API ASK_GEMINI (${modeForLogging}): Error de RED al llamar a Gemini: ${networkError.message}`);
      if (networkError.stack) console.error(`API ASK_GEMINI (${modeForLogging}): StackTrace RED: ${networkError.stack}`);
      throw new Error(`Error de red al contactar la API de Gemini para ${modeForLogging}: ${networkError.message}`);
  }

  const responseBodyText = await apiRes.text(); 

  if (!apiRes.ok) {
    console.error(`API ASK_GEMINI (${modeForLogging}): Error de la API de Gemini. Status: ${apiRes.status}. Body: ${responseBodyText.substring(0, 500)}...`);
    let detailedError = `Error ${apiRes.status}: ${apiRes.statusText}.`;
    try {
      const parsedError = JSON.parse(responseBodyText);
      if (parsedError && parsedError.error && parsedError.error.message) {
        detailedError = parsedError.error.message;
      } else if (parsedError && parsedError.message) {
        detailedError = parsedError.message;
      }
    } catch (e) { 
        detailedError += ` Respuesta no JSON: ${responseBodyText.substring(0,200)}...`;
    }
    throw new Error(`Error de la API de Gemini para ${modeForLogging} (${apiRes.status}): ${detailedError}`);
  }

  let json;
  try {
    json = JSON.parse(responseBodyText);
  } catch (jsonError) {
      console.error(`API ASK_GEMINI (${modeForLogging}): Error al parsear JSON de respuesta de Gemini: ${jsonError.message}`);
      if (jsonError.stack) console.error(`API ASK_GEMINI (${modeForLogging}): StackTrace JSON Parse: ${jsonError.stack}`);
      console.error(`API ASK_GEMINI (${modeForLogging}): Respuesta cruda de Gemini que falló el parseo: ${responseBodyText.substring(0,1000)}...`);
      throw new Error(`Error al parsear la respuesta JSON de Gemini para ${modeForLogging}: ${jsonError.message}. Respuesta recibida: ${responseBodyText.substring(0,200)}...`);
  }
  
  // Verificación más robusta de la respuesta
  const candidate = json.candidates?.[0];
  if (!candidate || !candidate.content?.parts?.length || typeof candidate.content.parts[0].text !== 'string') {
    console.warn(`API ASK_GEMINI (${modeForLogging}): Respuesta de Gemini con estructura inesperada o vacía. Full JSON: ${JSON.stringify(json, null, 2)}`);
    
    const blockReason = candidate?.finishReason === "SAFETY" ? candidate.safetyRatings?.map(r => `${r.category} blocked (Threshold: ${r.blocked}, Probability: ${r.probability})`).join(', ') : null;
    const finishReason = candidate?.finishReason;

    if (blockReason) {
      throw new Error(`Contenido bloqueado por Gemini para ${modeForLogging} por razones de seguridad. Detalles: ${blockReason}`);
    }
    if (finishReason === "MAX_TOKENS") {
        // Si hay texto parcial, devuélvelo con una advertencia.
        const partialText = candidate.content?.parts?.[0]?.text;
        if (typeof partialText === 'string') {
            console.warn(`API ASK_GEMINI (${modeForLogging}): Respuesta truncada por MAX_TOKENS. Se devuelve texto parcial.`);
            return partialText.trim() + "\n\n[Respuesta truncada por límite de tokens]";
        }
        throw new Error(`Respuesta truncada por MAX_TOKENS para ${modeForLogging} y no se encontró texto parcial válido.`);
    }
    if (finishReason === "RECITATION") {
      console.warn(`API ASK_GEMINI (${modeForLogging}): Respuesta bloqueada por RECITATION.`);
      throw new Error(`Respuesta bloqueada por RECITATION para ${modeForLogging}. El contenido puede ser similar a datos de entrenamiento o material protegido.`);
    }
    if (finishReason === "OTHER") {
        throw new Error(`Respuesta de Gemini detenida por razón "OTHER" para ${modeForLogging}. Detalles: ${JSON.stringify(candidate)}`);
    }
    // Si no es ninguno de los anteriores, pero la estructura sigue siendo incorrecta:
    throw new Error(`Respuesta del modelo vacía o con formato inesperado para ${modeForLogging}. FinishReason: ${finishReason || 'No especificado'}. Full Candidate: ${JSON.stringify(candidate)}`);
  }

  const generatedText = candidate.content.parts[0].text;
  console.log(`API ASK_GEMINI (${modeForLogging}): Texto extraído (longitud: ${generatedText.length})`);
  return generatedText.trim();
}

// NO hay 'export default handler;' al final del archivo.