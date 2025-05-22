// File: components/ProgramForm.jsx
import React, { useState, useEffect } from 'react';
import { 
  Form, Select, InputNumber, Button, Checkbox, Card, Row, Col, Divider, 
  Typography, Tag, Tooltip, Radio, Slider, Space, Alert, Badge, Tabs, 
  Input, Collapse
} from 'antd';
import { 
  BookOutlined, ClockCircleOutlined, CalendarOutlined, BulbOutlined, 
  CheckCircleOutlined, InfoCircleOutlined, StarOutlined, EditOutlined,
  ThunderboltOutlined, GlobalOutlined, TrophyOutlined, SafetyCertificateOutlined, 
  PercentageOutlined, TeamOutlined, AimOutlined, QuestionCircleOutlined,
  ExperimentOutlined, RocketOutlined, NodeIndexOutlined, ShopOutlined,
  MessageOutlined, PlusCircleOutlined, AppstoreAddOutlined, CodeOutlined, WifiOutlined,
  SmileOutlined, UserOutlined, CalculatorOutlined, LineChartOutlined,
  NotificationOutlined, ToolOutlined, CustomerServiceOutlined, FileTextOutlined,
  BarChartOutlined, SettingOutlined, AppleOutlined, SkinOutlined
} from '@ant-design/icons';
import { allSocioformativeDemands, getSuggestedSocioformativeDemands } from './DemandasForm';

const { Option } = Select;
const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Search } = Input;

const areasConocimiento = [
  { value: 'ingenieria_tecnologia', label: 'Ingeniería y Tecnología' },
  { value: 'ciencias_basicas_exactas', label: 'Ciencias Básicas y Exactas' },
  { value: 'ciencias_salud', label: 'Ciencias de la Salud' },
  { value: 'ciencias_sociales_humanidades', label: 'Ciencias Sociales y Humanidades' },
  { value: 'ciencias_juridicas_politicas', label: 'Ciencias Jurídicas y Políticas' },
  { value: 'ciencias_economicas_administrativas', label: 'Ciencias Económicas y Administrativas' },
  { value: 'ciencias_agrarias_ambientales', label: 'Ciencias Agrarias y Ambientales' },
  { value: 'educacion_pedagogia', label: 'Educación y Pedagogía' },
  { value: 'artes_diseno_arquitectura', label: 'Artes, Diseño y Arquitectura' },
  { value: 'ciencias_computacion_tics', label: 'Ciencias de la Computación y TICs' },
  { value: 'ciencias_deporte_recreacion', label: 'Ciencias del Deporte y la Recreación' },
  { value: 'comunicacion_periodismo_publicidad', label: 'Comunicación, Periodismo y Publicidad' },
];

const facultyColors = {
  ingenieria_tecnologia: 'geekblue',
  ciencias_basicas_exactas: 'green',
  ciencias_salud: 'cyan',
  ciencias_sociales_humanidades: 'volcano',
  ciencias_juridicas_politicas: 'purple',
  ciencias_economicas_administrativas: 'gold',
  ciencias_agrarias_ambientales: 'lime',
  educacion_pedagogia: 'magenta',
  artes_diseno_arquitectura: 'red',
  ciencias_computacion_tics: 'blue',
  ciencias_deporte_recreacion: 'orange',
  comunicacion_periodismo_publicidad: 'pink',
};

export default function ProgramForm({ onSubmit }) {
  const [form] = Form.useForm();
  const [selectedDegree, setSelectedDegree] = useState('');
  // const [advancedOptionsVisible, setAdvancedOptionsVisible] = useState(false); // Comentado si no se usa
  const [activeTab, setActiveTab] = useState('1');
  // const [difficultyLevel, setDifficultyLevel] = useState(3); // Comentado si no se usa
  const [showAlert, setShowAlert] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedSocioDemands, setSelectedSocioDemands] = useState([]);
  const [isCustomDegree, setIsCustomDegree] = useState(false);

  const popularDegrees = [
    // Ingeniería y Tecnología
    { value: 'Ingeniería de Sistemas', color: 'blue', icon: <NodeIndexOutlined />, faculty: 'ingenieria_tecnologia', difficulty: 4 },
    { value: 'Ingeniería Civil', color: 'orange', icon: <SafetyCertificateOutlined />, faculty: 'ingenieria_tecnologia', difficulty: 4 },
    { value: 'Ingeniería Electrónica', color: 'cyan', icon: <ThunderboltOutlined />, faculty: 'ingenieria_tecnologia', difficulty: 5 },
    { value: 'Ingeniería Industrial', color: 'geekblue', icon: <ShopOutlined/>, faculty: 'ingenieria_tecnologia', difficulty: 3 },
    { value: 'Ingeniería Mecánica', color: 'gray', icon: <SettingOutlined />, faculty: 'ingenieria_tecnologia', difficulty: 4 },
    { value: 'Ingeniería Química', color: 'purple', icon: <ExperimentOutlined />, faculty: 'ingenieria_tecnologia', difficulty: 5 },
    { value: 'Ingeniería de Software', color: 'blue', icon: <CodeOutlined />, faculty: 'ingenieria_tecnologia', difficulty: 4 },
    { value: 'Ingeniería en Telecomunicaciones', color: 'cyan', icon: <WifiOutlined />, faculty: 'ingenieria_tecnologia', difficulty: 4 },
    { value: 'Ingeniería Biomédica', color: 'green', icon: <ExperimentOutlined />, faculty: 'ingenieria_tecnologia', difficulty: 4 }, 
    { value: 'Ingeniería Mecatrónica', color: 'orange', icon: <ToolOutlined />, faculty: 'ingenieria_tecnologia', difficulty: 5 },

    // Ciencias Básicas y Exactas
    { value: 'Física', color: 'geekblue', icon: <RocketOutlined />, faculty: 'ciencias_basicas_exactas', difficulty: 5 },
    { value: 'Matemáticas', color: 'blue', icon: <PercentageOutlined />, faculty: 'ciencias_basicas_exactas', difficulty: 5 },
    { value: 'Química', color: 'purple', icon: <ExperimentOutlined />, faculty: 'ciencias_basicas_exactas', difficulty: 4 },
    { value: 'Biología', color: 'lime', icon: <ExperimentOutlined />, faculty: 'ciencias_basicas_exactas', difficulty: 4 },
    { value: 'Estadística', color: 'orange', icon: <BarChartOutlined />, faculty: 'ciencias_basicas_exactas', difficulty: 3 },
    { value: 'Geología', color: 'brown', icon: <GlobalOutlined />, faculty: 'ciencias_basicas_exactas', difficulty: 4 },

    // Ciencias de la Salud
    { value: 'Medicina', color: 'green', icon: <ExperimentOutlined />, faculty: 'ciencias_salud', difficulty: 5 },
    { value: 'Enfermería', color: 'cyan', icon: <TeamOutlined />, faculty: 'ciencias_salud', difficulty: 3 },
    { value: 'Odontología', color: 'blue', icon: <SmileOutlined />, faculty: 'ciencias_salud', difficulty: 4 },
    { value: 'Fisioterapia', color: 'orange', icon: <UserOutlined />, faculty: 'ciencias_salud', difficulty: 3 },
    { value: 'Nutrición y Dietética', color: 'lime', icon: <AppleOutlined />, faculty: 'ciencias_salud', difficulty: 3 },
    { value: 'Farmacia', color: 'purple', icon: <ExperimentOutlined />, faculty: 'ciencias_salud', difficulty: 4 },
    { value: 'Psicología Clínica', color: 'pink', icon: <TeamOutlined />, faculty: 'ciencias_salud', difficulty: 4 },

    // Ciencias Sociales y Humanidades
    { value: 'Psicología', color: 'pink', icon: <TeamOutlined />, faculty: 'ciencias_sociales_humanidades', difficulty: 3 },
    { value: 'Trabajo Social', color: 'volcano', icon: <TeamOutlined />, faculty: 'ciencias_sociales_humanidades', difficulty: 2 },
    { value: 'Sociología', color: 'purple', icon: <GlobalOutlined />, faculty: 'ciencias_sociales_humanidades', difficulty: 3 },
    { value: 'Historia', color: 'brown', icon: <BookOutlined />, faculty: 'ciencias_sociales_humanidades', difficulty: 3 },
    { value: 'Filosofía', color: 'gray', icon: <BulbOutlined />, faculty: 'ciencias_sociales_humanidades', difficulty: 4 },
    { value: 'Antropología', color: 'orange', icon: <UserOutlined />, faculty: 'ciencias_sociales_humanidades', difficulty: 3 },
    { value: 'Ciencias de la Comunicación', color: 'blue', icon: <MessageOutlined />, faculty: 'comunicacion_periodismo_publicidad', difficulty: 2 },

    // Ciencias Jurídicas y Políticas
    { value: 'Derecho', color: 'purple', icon: <SafetyCertificateOutlined />, faculty: 'ciencias_juridicas_politicas', difficulty: 3 },
    { value: 'Ciencias Políticas', color: 'blue', icon: <GlobalOutlined />, faculty: 'ciencias_juridicas_politicas', difficulty: 3 },
    { value: 'Relaciones Internacionales', color: 'geekblue', icon: <GlobalOutlined />, faculty: 'ciencias_juridicas_politicas', difficulty: 3 },

    // Ciencias Económicas y Administrativas
    { value: 'Administración de Empresas', color: 'gold', icon: <ShopOutlined />, faculty: 'ciencias_economicas_administrativas', difficulty: 2 },
    { value: 'Contaduría Pública', color: 'geekblue', icon: <CalculatorOutlined />, faculty: 'ciencias_economicas_administrativas', difficulty: 3 },
    { value: 'Economía', color: 'green', icon: <LineChartOutlined />, faculty: 'ciencias_economicas_administrativas', difficulty: 4 },
    { value: 'Marketing', color: 'red', icon: <NotificationOutlined />, faculty: 'ciencias_economicas_administrativas', difficulty: 2 },
    { value: 'Negocios Internacionales', color: 'blue', icon: <GlobalOutlined />, faculty: 'ciencias_economicas_administrativas', difficulty: 3 },
    { value: 'Finanzas', color: 'purple', icon: <PercentageOutlined />, faculty: 'ciencias_economicas_administrativas', difficulty: 3 },

    // Ciencias Agrarias y Ambientales
    { value: 'Ingeniería Agronómica', color: 'lime', icon: <AppleOutlined />, faculty: 'ciencias_agrarias_ambientales', difficulty: 3 },
    { value: 'Medicina Veterinaria', color: 'brown', icon: <ExperimentOutlined />, faculty: 'ciencias_agrarias_ambientales', difficulty: 4 },
    { value: 'Ingeniería Ambiental', color: 'green', icon: <GlobalOutlined />, faculty: 'ciencias_agrarias_ambientales', difficulty: 4 },
    { value: 'Zootecnia', color: 'orange', icon: <TeamOutlined />, faculty: 'ciencias_agrarias_ambientales', difficulty: 3 },

    // Educación y Pedagogía
    { value: 'Licenciatura en Educación Infantil', color: 'pink', icon: <UserOutlined />, faculty: 'educacion_pedagogia', difficulty: 2 },
    { value: 'Licenciatura en Lenguas Extranjeras', color: 'blue', icon: <GlobalOutlined />, faculty: 'educacion_pedagogia', difficulty: 2 },
    { value: 'Licenciatura en Matemáticas', color: 'geekblue', icon: <PercentageOutlined />, faculty: 'educacion_pedagogia', difficulty: 3 },
    { value: 'Pedagogía', color: 'volcano', icon: <BookOutlined />, faculty: 'educacion_pedagogia', difficulty: 2 },

    // Artes, Diseño y Arquitectura
    { value: 'Arquitectura', color: 'red', icon: <AimOutlined />, faculty: 'artes_diseno_arquitectura', difficulty: 3 },
    { value: 'Diseño Gráfico', color: 'orange', icon: <EditOutlined />, faculty: 'artes_diseno_arquitectura', difficulty: 2 },
    { value: 'Diseño Industrial', color: 'blue', icon: <ToolOutlined />, faculty: 'artes_diseno_arquitectura', difficulty: 3 },
    { value: 'Música', color: 'purple', icon: <CustomerServiceOutlined />, faculty: 'artes_diseno_arquitectura', difficulty: 3 },
    { value: 'Artes Visuales', color: 'pink', icon: <EditOutlined />, faculty: 'artes_diseno_arquitectura', difficulty: 2 },
    { value: 'Diseño de Modas', color: 'red', icon: <SkinOutlined />, faculty: 'artes_diseno_arquitectura', difficulty: 2 },

    // Comunicación, Periodismo y Publicidad
    { value: 'Periodismo', color: 'blue', icon: <FileTextOutlined />, faculty: 'comunicacion_periodismo_publicidad', difficulty: 3 },
    { value: 'Publicidad', color: 'red', icon: <BulbOutlined />, faculty: 'comunicacion_periodismo_publicidad', difficulty: 2 },
  ];

  const recommendedSubjects = {
    // Ingeniería y Tecnología
    'Ingeniería de Sistemas': ['Programación Avanzada', 'Estructuras de Datos y Algoritmos', 'Bases de Datos Distribuidas', 'Redes y Seguridad', 'Inteligencia Artificial Aplicada', 'Sistemas Operativos Modernos', 'Arquitectura de Software', 'Ingeniería de Software Ágil', 'Cloud Computing y DevOps', 'Ciberseguridad y Hacking Ético'],
    'Ingeniería Civil': ['Cálculo Multivariable', 'Mecánica de Fluidos', 'Análisis Estructural Avanzado', 'Diseño de Vías Terrestres', 'Hidrología e Hidráulica Aplicada', 'Geotecnia y Cimentaciones', 'Materiales de Construcción Sostenibles', 'Gestión de Proyectos de Construcción', 'Modelado BIM'],
    'Ingeniería Electrónica': ['Circuitos Electrónicos Avanzados', 'Sistemas Embebidos', 'Procesamiento Digital de Señales', 'Sistemas de Control Automático', 'Comunicaciones Digitales', 'Diseño de VLSI', 'Antenas y Propagación', 'Robótica y Automatización'],
    'Ingeniería Industrial': ['Investigación de Operaciones', 'Gestión de la Cadena de Suministro', 'Ingeniería de Calidad Total', 'Diseño de Plantas Industriales', 'Simulación de Procesos', 'Ergonomía y Seguridad Industrial', 'Gestión de Proyectos Lean'],
    'Ingeniería Mecánica': ['Termodinámica Aplicada', 'Mecánica de Fluidos Avanzada', 'Diseño Mecánico Asistido por Computador (CAD/CAE)', 'Vibraciones Mecánicas', 'Transferencia de Calor y Masa', 'Materiales de Ingeniería', 'Sistemas de Manufactura'],
    'Ingeniería Química': ['Balance de Materia y Energía', 'Termodinámica Química', 'Fenómenos de Transporte', 'Diseño de Reactores Químicos', 'Operaciones Unitarias', 'Control de Procesos Químicos', 'Ingeniería de Polímeros'],
    'Ingeniería de Software': ['Patrones de Diseño de Software', 'Arquitecturas de Microservicios', 'Desarrollo Web Full-Stack (React, Node, etc.)', 'Pruebas de Software Automatizadas', 'Gestión de Configuración y DevOps', 'Seguridad en el Desarrollo de Software (DevSecOps)'],
    'Ingeniería en Telecomunicaciones': ['Redes de Nueva Generación (5G/6G)', 'Comunicaciones Ópticas', 'Sistemas de Comunicación Inalámbrica', 'Procesamiento de Señales para Comunicaciones', 'Seguridad en Redes de Telecomunicaciones', 'IoT y Comunicaciones Máquina a Máquina (M2M)'],
    'Ingeniería Biomédica': ['Anatomía y Fisiología para Ingenieros', 'Bioinstrumentación', 'Procesamiento de Señales Biomédicas', 'Biomecánica', 'Materiales Biomédicos e Ingeniería de Tejidos', 'Imágenes Médicas'],
    'Ingeniería Mecatrónica': ['Sensores y Actuadores', 'Control de Sistemas Mecatrónicos', 'Robótica Industrial y Móvil', 'Programación de PLC y Sistemas SCADA', 'Visión Artificial', 'Diseño Mecatrónico Integrado'],

    // Ciencias Básicas y Exactas
    'Física': ['Mecánica Cuántica Avanzada', 'Electrodinámica Clásica', 'Física Estadística y Termodinámica', 'Física del Estado Sólido', 'Astrofísica y Cosmología', 'Física de Partículas'],
    'Matemáticas': ['Análisis Real y Complejo', 'Álgebra Abstracta', 'Topología', 'Ecuaciones Diferenciales Parciales', 'Probabilidad y Procesos Estocásticos', 'Optimización Matemática'],
    'Química': ['Química Orgánica Avanzada', 'Química Inorgánica Descriptiva', 'Fisicoquímica', 'Química Analítica Instrumental', 'Bioquímica Estructural', 'Espectroscopía Molecular'],
    'Biología': ['Biología Molecular y Celular Avanzada', 'Genética y Genómica', 'Ecología de Poblaciones y Comunidades', 'Evolución y Filogenia', 'Fisiología Animal y Vegetal Comparada', 'Bioinformática'],
    'Estadística': ['Inferencia Estadística', 'Modelos Lineales Generalizados', 'Análisis Multivariado', 'Series de Tiempo', 'Diseño de Experimentos', 'Minería de Datos y Aprendizaje Estadístico'],
    'Geología': ['Petrología Ígnea y Metamórfica', 'Sedimentología y Estratigrafía', 'Geología Estructural', 'Geofísica Aplicada', 'Hidrogeología', 'Geología Ambiental y de Riesgos'],

    // Ciencias de la Salud
    'Medicina': ['Anatomía Clínica', 'Fisiopatología', 'Farmacología Clínica Aplicada', 'Semiología y Diagnóstico Clínico', 'Medicina Interna', 'Cirugía General', 'Pediatría', 'Ginecología y Obstetricia', 'Salud Pública y Epidemiología', 'Bioética Médica'],
    'Enfermería': ['Cuidados Críticos del Adulto', 'Enfermería Pediátrica', 'Salud Materno-Infantil', 'Gestión de Servicios de Enfermería', 'Investigación en Enfermería', 'Cuidado Paliativo'],
    'Odontología': ['Patología Oral', 'Cirugía Bucal', 'Periodoncia', 'Endodoncia', 'Ortodoncia', 'Odontopediatría', 'Materiales Dentales'],
    'Fisioterapia': ['Evaluación Fisioterapéutica Avanzada', 'Fisioterapia Neurológica', 'Fisioterapia Cardiorrespiratoria', 'Fisioterapia Deportiva', 'Terapia Manual Ortopédica'],
    'Nutrición y Dietética': ['Evaluación del Estado Nutricional', 'Nutrición Clínica', 'Dietoterapia Aplicada', 'Nutrición Deportiva', 'Salud Pública y Nutrición Comunitaria', 'Tecnología de Alimentos'],
    'Farmacia': ['Farmacognosia y Fitoquímica', 'Tecnología Farmacéutica', 'Farmacología y Toxicología Avanzada', 'Atención Farmacéutica y Farmacia Clínica', 'Legislación Farmacéutica'],
    'Psicología Clínica': ['Psicopatología Avanzada', 'Evaluación Psicológica y Psicodiagnóstico', 'Modelos de Intervención Psicoterapéutica (Cognitivo-Conductual, Psicodinámica, Sistémica)', 'Neuropsicología Clínica', 'Psicofarmacología'],

    // Ciencias Sociales y Humanidades
    'Psicología': ['Teorías Psicológicas Contemporáneas', 'Psicología del Desarrollo Humano', 'Psicología Social y Comunitaria', 'Metodología de la Investigación Psicológica', 'Psicometría', 'Neurociencia Cognitiva'],
    'Trabajo Social': ['Teoría y Metodología del Trabajo Social', 'Políticas Sociales y Bienestar', 'Intervención con Familias y Grupos', 'Trabajo Social Comunitario', 'Derechos Humanos y Ciudadanía'],
    'Sociología': ['Teoría Sociológica Clásica y Contemporánea', 'Metodología de la Investigación Social Cuantitativa y Cualitativa', 'Sociología Urbana y Rural', 'Estratificación y Movilidad Social', 'Sociología de la Cultura'],
    'Historia': ['Historiografía', 'Historia Antigua y Medieval', 'Historia Moderna y Contemporánea', 'Historia de América Latina', 'Metodología de la Investigación Histórica'],
    'Filosofía': ['Metafísica y Ontología', 'Epistemología y Teoría del Conocimiento', 'Ética y Filosofía Política', 'Lógica y Filosofía del Lenguaje', 'Historia de la Filosofía Antigua y Moderna'],
    'Antropología': ['Teoría Antropológica', 'Etnografía y Métodos Cualitativos', 'Antropología Cultural y Social', 'Antropología Física y Arqueología', 'Antropología Aplicada'],
    'Ciencias de la Comunicación': ['Teorías de la Comunicación Avanzadas', 'Análisis del Discurso', 'Comunicación Digital y Nuevos Medios', 'Opinión Pública y Comunicación Política', 'Semiótica y Estudios Culturales'],

    // Ciencias Jurídicas y Políticas
    'Derecho': ['Derecho Constitucional Avanzado', 'Teoría General del Proceso', 'Derecho Civil: Obligaciones y Contratos', 'Derecho Penal: Parte General y Especial', 'Derecho Administrativo', 'Filosofía del Derecho y Argumentación Jurídica'],
    'Ciencias Políticas': ['Teoría Política Moderna y Contemporánea', 'Sistemas Políticos Comparados', 'Análisis de Políticas Públicas', 'Relaciones Internacionales y Geopolítica', 'Métodos de Investigación en Ciencia Política'],
    'Relaciones Internacionales': ['Teorías de las Relaciones Internacionales', 'Derecho Internacional Público', 'Economía Política Internacional', 'Organizaciones Internacionales y Gobernanza Global', 'Análisis de Conflictos y Negociación'],

    // Ciencias Económicas y Administrativas
    'Administración de Empresas': ['Dirección Estratégica', 'Gestión Financiera Avanzada', 'Marketing Estratégico', 'Gestión del Talento Humano', 'Emprendimiento e Innovación', 'Sistemas de Información Gerencial'],
    'Contaduría Pública': ['Contabilidad Financiera Avanzada (NIIF)', 'Auditoría y Aseguramiento', 'Tributación Nacional e Internacional', 'Contabilidad de Gestión y Costos Estratégicos', 'Finanzas Corporativas y Valoración de Empresas'],
    'Economía': ['Microeconomía Avanzada', 'Macroeconomía Dinámica', 'Econometría Aplicada', 'Economía del Desarrollo y Política Económica', 'Economía Internacional y Finanzas Globales'],
    'Marketing': ['Investigación de Mercados Avanzada', 'Comportamiento del Consumidor Digital', 'Marketing de Contenidos y SEO/SEM', 'Branding y Gestión de Marca', 'Marketing Internacional y Estrategia Global'],
    'Negocios Internacionales': ['Comercio Exterior y Logística Internacional', 'Finanzas Internacionales y Mercados de Divisas', 'Marketing Global y Adaptación Cultural', 'Negociación Intercultural', 'Estrategia de Internacionalización de Empresas'],
    'Finanzas': ['Mercados Financieros e Instrumentos Derivados', 'Gestión de Carteras de Inversión', 'Valoración de Activos y Empresas', 'Riesgo Financiero y Modelización', 'Finanzas Corporativas Estratégicas'],

    // Ciencias Agrarias y Ambientales
    'Ingeniería Agronómica': ['Fisiología Vegetal Aplicada', 'Manejo Integrado de Plagas y Enfermedades', 'Fertilidad de Suelos y Nutrición Vegetal', 'Mejoramiento Genético Vegetal', 'Agroecología y Sistemas de Producción Sostenible'],
    'Medicina Veterinaria': ['Anatomía y Fisiología Animal Comparada', 'Patología Veterinaria', 'Farmacología y Terapéutica Veterinaria', 'Clínica de Pequeños y Grandes Animales', 'Salud Pública Veterinaria y Zoonosis'],
    'Ingeniería Ambiental': ['Modelización Ambiental', 'Tratamiento Avanzado de Aguas Residuales y Potables', 'Gestión Integral de Residuos Sólidos y Peligrosos', 'Evaluación de Impacto Ambiental Estratégica', 'Legislación y Política Ambiental Global'],
    'Zootecnia': ['Nutrición y Alimentación Animal Avanzada', 'Mejoramiento Genético Animal', 'Sistemas de Producción Animal Sostenible (Bovinos, Porcinos, Aves)', 'Sanidad y Bienestar Animal', 'Gestión de Empresas Pecuarias'],

    // Educación y Pedagogía
    'Licenciatura en Educación Infantil': ['Neurodesarrollo y Aprendizaje Temprano', 'Didácticas Específicas para la Primera Infancia', 'Diseño Curricular en Educación Infantil', 'Inclusión y Diversidad en el Aula', 'Investigación en Educación Infantil'],
    'Licenciatura en Lenguas Extranjeras': ['Lingüística Aplicada a la Enseñanza de Lenguas', 'Metodología de la Enseñanza de Segundas Lenguas', 'Adquisición de Lenguas', 'Literatura y Cultura de las Lenguas Objeto de Estudio', 'Diseño de Materiales Didácticos'],
    'Licenciatura en Matemáticas': ['Didáctica de las Matemáticas', 'Historia y Epistemología de las Matemáticas', 'Resolución de Problemas Matemáticos', 'Modelización Matemática en la Educación', 'Uso de TIC en la Enseñanza de las Matemáticas'],
    'Pedagogía': ['Teorías Pedagógicas Contemporáneas', 'Diseño y Evaluación Curricular', 'Psicología del Aprendizaje y la Motivación', 'Gestión Educativa y Liderazgo Pedagógico', 'Investigación Educativa y Práctica Reflexiva'],

    // Artes, Diseño y Arquitectura
    'Arquitectura': ['Teoría e Historia de la Arquitectura Contemporánea', 'Diseño Arquitectónico Avanzado y Proyectos Complejos', 'Urbanismo y Planificación Territorial Sostenible', 'Tecnologías Constructivas Innovadoras', 'Gestión de Proyectos Arquitectónicos y Urbanos'],
    'Diseño Gráfico': ['Diseño de Identidad Visual Corporativa', 'Diseño Editorial Avanzado', 'Diseño Web y Experiencia de Usuario (UX/UI)', 'Motion Graphics y Animación Digital', 'Tipografía Experimental y Aplicada'],
    'Diseño Industrial': ['Metodologías de Diseño Centrado en el Usuario', 'Ecodiseño y Sostenibilidad de Productos', 'Diseño de Productos Inteligentes e IoT', 'Prototipado Rápido y Fabricación Digital', 'Gestión de Proyectos de Diseño Industrial'],
    'Música': ['Armonía y Contrapunto Avanzado', 'Composición Musical y Arreglos', 'Interpretación Instrumental o Vocal Especializada', 'Historia de la Música Occidental y Músicas del Mundo', 'Producción Musical y Tecnologías de Audio'],
    'Artes Visuales': ['Prácticas Artísticas Contemporáneas', 'Teoría y Crítica de Arte', 'Medios y Técnicas Experimentales (Instalación, Performance, Videoarte)', 'Gestión Cultural y Curaduría de Exposiciones', 'Investigación-Creación en Artes'],
    'Diseño de Modas': ['Diseño y Patronaje Avanzado', 'Historia del Traje y la Moda Contemporánea', 'Textiles e Innovación en Materiales', 'Marketing y Gestión de Marcas de Moda', 'Producción y Sostenibilidad en la Industria de la Moda'],

    // Comunicación, Periodismo y Publicidad
    'Periodismo': ['Periodismo de Investigación y Datos', 'Periodismo Digital y Narrativas Transmedia', 'Ética y Deontología Periodística Avanzada', 'Cobertura de Conflictos y Crisis', 'Producción de Reportajes Multimedia'],
    'Publicidad': ['Planificación Estratégica de Medios Publicitarios', 'Creatividad Publicitaria y Storytelling de Marca', 'Publicidad Digital y Marketing de Influencers', 'Análisis de Métricas y ROI en Publicidad', 'Dirección de Arte Publicitario'],
  };


  const competencias = [
    'Pensamiento crítico', 'Resolución de problemas complejos', 'Trabajo en equipo multidisciplinario',
    'Comunicación efectiva oral y escrita', 'Liderazgo adaptativo', 'Innovación y creatividad aplicada', 'Análisis de datos y toma de decisiones informada',
    'Gestión de proyectos ágiles', 'Ética profesional y responsabilidad social', 'Sostenibilidad y conciencia ambiental', 'Adaptabilidad y resiliencia al cambio',
    'Alfabetización digital avanzada', 'Conciencia global y cultural', 'Investigación y generación de conocimiento', 'Aprendizaje autónomo y continuo'
  ];

  const filteredDegrees = searchTerm && !isCustomDegree
    ? popularDegrees.filter(deg => 
        deg.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (deg.faculty && areasConocimiento.find(f => f.value === deg.faculty)?.label.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : popularDegrees;

  const handleDegreeChange = (value) => { 
    if (value === '__custom__') {
        setIsCustomDegree(true);
        setSelectedDegree('');
        form.setFieldsValue({ degree: undefined, customDegreeName: '', facultyArea: undefined, coreSubjects: [], socioformativeDemands: [] });
        setSelectedSubjects([]);
        setSelectedSocioDemands([]);
        // setDifficultyLevel(3); // Restablecer dificultad por defecto si se cambia a custom
        return;
    }

    setIsCustomDegree(false);
    setSelectedDegree(value);
    const degreeData = popularDegrees.find(d => d.value === value);
    const inferredFaculty = degreeData ? degreeData.faculty : undefined;
    // const difficulty = degreeData ? degreeData.difficulty : 3; // Obtener dificultad

    if (recommendedSubjects[value]) {
      const suggestedSubs = recommendedSubjects[value];
      setSelectedSubjects(suggestedSubs);
      form.setFieldsValue({ coreSubjects: suggestedSubs });
    } else {
      setSelectedSubjects([]);
      form.setFieldsValue({ coreSubjects: [] });
    }
    
    const suggestedDemands = getSuggestedSocioformativeDemands(value, inferredFaculty);
    setSelectedSocioDemands(suggestedDemands);
    form.setFieldsValue({ socioformativeDemands: suggestedDemands });
      
    // setDifficultyLevel(difficulty); // Actualizar estado de dificultad
    // form.setFieldsValue({ difficultyLevel: difficulty }); // Actualizar campo de dificultad
  };
  
  const handleCustomAreaChange = (facultyValue) => {
    const customDegreeName = form.getFieldValue('customDegreeName');
    const suggestedDemands = getSuggestedSocioformativeDemands(customDegreeName || null, facultyValue);
    setSelectedSocioDemands(suggestedDemands);
    form.setFieldsValue({ socioformativeDemands: suggestedDemands });

    setSelectedSubjects([]); 
    form.setFieldsValue({ coreSubjects: [] });
  };


  const handleCoreSubjectsChange = (values) => {
    setSelectedSubjects(values);
  };

  const handleSocioDemandsChange = (values) => {
    setSelectedSocioDemands(values);
  };

  const getSuggestedDuration = () => {
    if (isCustomDegree) return 4; 
    const degreeData = popularDegrees.find(d => d.value === selectedDegree);
    if (!degreeData) return 5; // Default si no se encuentra (aunque no debería pasar si está seleccionado)
    // const difficulty = degreeData.difficulty;
    // return difficulty <= 3 ? 4 : 5;
    // Simplificado si el slider de dificultad ya no está:
    return degreeData.difficulty && degreeData.difficulty <= 3 ? 4 : 5;
  };

  useEffect(() => {
    if (selectedDegree || isCustomDegree) {
      form.setFieldsValue({
        duration: getSuggestedDuration()
      });
    }
  }, [selectedDegree, isCustomDegree, form]);

  const onFormFinish = (values) => {
    let finalValues = { ...values };
    let facultyToSubmit;
    // let difficultyToSubmit = values.difficultyLevel; // Tomar del formulario si el slider estuviera activo

    if (isCustomDegree) {
        finalValues.degree = values.customDegreeName;
        facultyToSubmit = values.facultyArea;
        // difficultyToSubmit = 3; // Dificultad por defecto para custom, o permitir al usuario si se añade slider
    } else {
        const degreeData = popularDegrees.find(d => d.value === values.degree);
        facultyToSubmit = degreeData ? degreeData.faculty : undefined;
        // difficultyToSubmit = degreeData ? degreeData.difficulty : values.difficultyLevel;
    }
    
    onSubmit({ ...finalValues, faculty: facultyToSubmit /*, difficultyLevel: difficultyToSubmit */ }); 
  };

  const toggleCustomDegreeInput = () => {
    const currentlyCustom = !isCustomDegree; 
    setIsCustomDegree(currentlyCustom);
    if (currentlyCustom) { 
        form.setFieldsValue({ degree: undefined, customDegreeName: '', facultyArea: undefined, coreSubjects: [], socioformativeDemands: [] });
        setSelectedDegree('');
        setSelectedSubjects([]);
        setSelectedSocioDemands([]);
        // form.setFieldsValue({ difficultyLevel: 3 }); // Resetear dificultad para custom
    } else { 
        form.setFieldsValue({ customDegreeName: '', facultyArea: undefined });
        // Si se vuelve a lista, la dificultad se establecerá en handleDegreeChange
    }
  };

  return (
    <div className="py-4">
      {showAlert && (
        <Alert
          message="Información Importante"
          description="Complete todos los campos obligatorios para obtener un plan de estudios optimizado. Los campos opcionales añaden mayor personalización."
          type="info"
          showIcon
          closable
          onClose={() => setShowAlert(false)}
          className="mb-8"
          icon={<InfoCircleOutlined />}
        />
      )}

      <Tabs activeKey={activeTab} onChange={setActiveTab} className="custom-tabs">
        <TabPane 
          tab={<span><BookOutlined /> Información Básica</span>} 
          key="1"
        >
          <Form 
            form={form} 
            layout="vertical" 
            onFinish={onFormFinish}
            initialValues={{
              duration: 5,
              semestersPerYear: 2,
              electives: true,
              // difficultyLevel: 3, // Comentado si no se usa
              degreeType: 'bachelor',
              modalidad: 'presencial',
              // internationalization: false, // Comentado si no se usa
              competencies: ['Pensamiento crítico', 'Resolución de problemas complejos'],
              socioformativeDemands: []
            }}
            className="max-w-3xl mx-auto"
          >
            {/* Campos de Información del Programa (sin Card envolvente) */}
            {!isCustomDegree ? (
              <Form.Item 
                name="degree" 
                label={
                  <span className="flex items-center">
                    <BookOutlined className="mr-1 text-blue-700" /> Carrera / Título
                    <Tooltip title="Selecciona la carrera. El área se inferirá automáticamente.">
                      <QuestionCircleOutlined className="ml-1 text-gray-400" />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: !isCustomDegree, message: 'Por favor selecciona una carrera' }]}
                className="mb-2"
              >
                <Select 
                  placeholder="Selecciona tu carrera" 
                  showSearch
                  allowClear 
                  filterOption={(input, option) => {
                      if (option.value === "__custom__") return true; 
                      const degreeName = option.children?.props?.children?.[0]?.props?.children?.[1]?.props?.children;
                      const facultyName = option.children?.props?.children?.[1]?.props?.children?.props?.children;
                      const matchDegree = degreeName && typeof degreeName === 'string' && degreeName.toLowerCase().includes(input.toLowerCase());
                      const matchFaculty = facultyName && typeof facultyName === 'string' && facultyName.toLowerCase().includes(input.toLowerCase());
                      return !!(matchDegree || matchFaculty);
                  }}
                  onChange={handleDegreeChange}
                  size="large"
                  dropdownRender={menu => (
                    <>
                      <div className="px-2 py-2">
                        <Search
                          placeholder="Buscar carreras o áreas..."
                          value={searchTerm} 
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="mb-3"
                        />
                      </div>
                      {menu}
                      <Divider style={{ margin: '8px 0' }} />
                      <div style={{ padding: '0 8px 4px' }}>
                        <Paragraph className="text-xs text-gray-500 mb-2">Carreras populares:</Paragraph>
                        <div className="flex flex-wrap gap-2">
                          {popularDegrees.slice(0,10).map(deg => (
                            <Tag 
                              key={deg.value} 
                              color={deg.color}
                              style={{ cursor: 'pointer' }}
                              icon={deg.icon}
                              onClick={() => {
                                form.setFieldsValue({ degree: deg.value });
                                handleDegreeChange(deg.value);
                                setSearchTerm(''); 
                              }}
                            >
                              {deg.value}
                            </Tag>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                >
                  <Option key="__custom__" value="__custom__">
                      <div className="flex items-center text-blue-600 font-semibold">
                          <PlusCircleOutlined className="mr-2" /> No encuentro mi carrera, ingresar manualmente...
                      </div>
                  </Option>
                  {filteredDegrees.map(deg => (
                    <Option key={deg.value} value={deg.value}>
                      <div className="flex items-center justify-between w-full">
                        <div>
                          {deg.icon} <span className="ml-2">{deg.value}</span>
                        </div>
                        {deg.faculty && areasConocimiento.find(f => f.value === deg.faculty) && (
                          <Tag 
                            color={facultyColors[deg.faculty] || 'default'}
                            style={{ fontSize: '0.7rem', marginLeft: 'auto' }}
                          >
                            {areasConocimiento.find(f => f.value === deg.faculty)?.label}
                          </Tag>
                        )}
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            ) : (
              <>
                <Form.Item
                  name="customDegreeName"
                  label={ <span className="flex items-center"> <EditOutlined className="mr-1 text-blue-700" /> Nombre de la Carrera (Manual) </span> }
                  rules={[{ required: isCustomDegree, message: 'Por favor ingresa el nombre de la carrera' }]}
                  className="mb-4"
                >
                  <Input placeholder="Ej: Ingeniería en Energías Renovables" size="large" />
                </Form.Item>
                <Form.Item
                  name="facultyArea"
                  label={ <span className="flex items-center"> <AppstoreAddOutlined className="mr-1 text-blue-700" /> Área de Conocimiento </span>}
                  rules={[{ required: isCustomDegree, message: 'Por favor selecciona un área de conocimiento' }]}
                  className="mb-2"
                >
                  <Select 
                      placeholder="Selecciona el área principal" 
                      size="large"
                      onChange={handleCustomAreaChange}
                  >
                    {areasConocimiento.map(area => (
                      <Option key={area.value} value={area.value}>{area.label}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </>
            )}
            <div className="mb-6 text-right">
              <Button type="link" onClick={toggleCustomDegreeInput} icon={isCustomDegree ? <BookOutlined /> : <PlusCircleOutlined />}>
                {isCustomDegree ? 'Seleccionar carrera de la lista' : 'No encuentro mi carrera'}
              </Button>
            </div>

            <Row gutter={16}>
              <Col span={24} md={12}>
                <Form.Item 
                  name="degreeType" 
                  label={ <span className="flex items-center"> <TrophyOutlined className="mr-1 text-blue-700" /> Tipo de Grado </span> }
                >
                  <Radio.Group buttonStyle="solid" className="w-full">
                    <Radio.Button value="bachelor" className="w-1/3 text-center">Pregrado</Radio.Button>
                    <Radio.Button value="master" className="w-1/3 text-center">Maestría</Radio.Button>
                    <Radio.Button value="doctorate" className="w-1/3 text-center">Doctorado</Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={24} md={12}>
                <Form.Item 
                  name="modalidad" 
                  label={ <span className="flex items-center"> <GlobalOutlined className="mr-1 text-blue-700" /> Modalidad </span>}
                >
                  <Radio.Group buttonStyle="solid" className="w-full">
                    <Radio.Button value="presencial" className="w-1/3 text-center">Presencial</Radio.Button>
                    <Radio.Button value="virtual" className="w-1/3 text-center">Virtual</Radio.Button>
                    <Radio.Button value="mixta" className="w-1/3 text-center">Mixta</Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16} className="mb-6"> {/* Aumentado margen inferior */}
              <Col span={24} md={12}>
                <Form.Item 
                  name="duration" 
                  label={ <span className="flex items-center"> <ClockCircleOutlined className="mr-1 text-blue-700" /> Duración 
                            <Tooltip title="Número de años académicos para completar el programa"> <QuestionCircleOutlined className="ml-1 text-gray-400" /> </Tooltip> 
                          </span>}
                  rules={[{ required: true, message: 'Campo requerido' }]}
                >
                  <InputNumber min={1} max={12} addonAfter="años" style={{ width: '100%' }} className="rounded-md" size="large"/>
                </Form.Item>
              </Col>
              <Col span={24} md={12}>
                <Form.Item 
                  name="semestersPerYear" 
                  label={ <span className="flex items-center"> <CalendarOutlined className="mr-1 text-blue-700" /> Periodos por año 
                            <Tooltip title="Cantidad de semestres o trimestres por año académico"> <QuestionCircleOutlined className="ml-1 text-gray-400" /> </Tooltip>
                          </span>}
                  rules={[{ required: true, message: 'Campo requerido' }]}
                >
                  <Select style={{ width: '100%' }} size="large">
                    <Option value={1}>1 (Anual)</Option>
                    <Option value={2}>2 (Semestral)</Option>
                    <Option value={3}>3 (Trimestral)</Option>
                    <Option value={4}>4 (Cuatrimestral)</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            {/* Fin Campos de Información del Programa */}


            {/* Card de Contenido Académico */}
            <Card 
              className="shadow-md border-0 mb-6 hover:shadow-lg transition-all" 
              headStyle={{ borderBottom: '2px solid #e5e7eb', background: '#f8fafc' }}
              title={
                <div className="flex items-center">
                  <BulbOutlined className="text-xl text-slate-700 mr-3" />
                  <div>
                    <Title level={4} className="mb-0 text-slate-800">Contenido Académico</Title>
                    <Text type="secondary" className="text-xs">Define el contenido y estructura del plan de estudios</Text>
                  </div>
                </div>
              }
            >
              {/* 1. Demandas Socioformativas */}
              <Form.Item 
                name="socioformativeDemands" 
                label={
                  <span className="flex items-center">
                    <MessageOutlined className="mr-1 text-blue-700" /> Demandas Socioformativas
                    <Tooltip title="Selecciona las demandas sociales y formativas clave para el perfil de egreso. Contexto: Formación ética y compromiso social - Fuente.">
                      <QuestionCircleOutlined className="ml-1 text-gray-400" />
                    </Tooltip>
                  </span>
                }
                extra={
                  <div className="mt-1">
                    <Text type="secondary" className="text-xs">
                      Estas demandas orientarán la formación ética y el compromiso social del egresado. {isCustomDegree && !form.getFieldValue('facultyArea') ? "Selecciona un área de conocimiento para habilitar." : ""}
                    </Text>
                    {((selectedDegree && !isCustomDegree) || (isCustomDegree && form.getFieldValue('facultyArea'))) && selectedSocioDemands.length > 0 && (
                      <div className="mt-2">
                        <Tag color="purple" icon={<CheckCircleOutlined />}>
                          {selectedSocioDemands.length} demandas sugeridas
                        </Tag>
                      </div>
                    )}
                  </div>
                }
              >
                <Select
                  mode="multiple"
                  placeholder="Selecciona demandas socioformativas"
                  className="rounded-md"
                  size="large"
                  allowClear
                  onChange={handleSocioDemandsChange}
                  options={allSocioformativeDemands.map(demand => ({
                    label: (
                        <Tooltip title={`Fuente: ${demand.source}`} placement="right" mouseEnterDelay={0.5}>
                          {demand.label}
                        </Tooltip>
                      ),
                    value: demand.value,
                  }))}
                  disabled={isCustomDegree && !form.getFieldValue('facultyArea')}
                />
              </Form.Item>

              {/* 2. Competencias a Desarrollar */}
              <Form.Item 
                name="competencies" 
                label={
                  <span className="flex items-center">
                    <StarOutlined className="mr-1 text-blue-700" /> Competencias a Desarrollar
                    <Tooltip title="Selecciona las competencias profesionales que el programa debe desarrollar">
                      <QuestionCircleOutlined className="ml-1 text-gray-400" />
                    </Tooltip>
                  </span>
                }
              >
                <Select
                  mode="multiple"
                  placeholder="Selecciona competencias"
                  className="rounded-md"
                  size="large"
                  allowClear
                >
                  {competencias.map(competencia => (
                    <Option key={competencia} value={competencia}>{competencia}</Option>
                  ))}
                </Select>
              </Form.Item>

              {/* 3. Asignaturas Obligatorias */}
              <Form.Item 
                name="coreSubjects" 
                label={
                  <span className="flex items-center">
                    <BookOutlined className="mr-1 text-blue-700" /> Asignaturas Obligatorias
                    <Tooltip title="Incluye las materias fundamentales. Para carreras manuales, ingrésalas directamente.">
                      <QuestionCircleOutlined className="ml-1 text-gray-400" />
                    </Tooltip>
                  </span>
                }
                extra={
                  <div className="mt-1">
                    <Text type="secondary" className="text-xs">
                      Añade las asignaturas clave. {isCustomDegree && !form.getFieldValue('facultyArea') ? "Selecciona un área de conocimiento para habilitar." : (isCustomDegree ? "Para carreras manuales, no hay sugerencias automáticas." : "")}
                    </Text>
                    {(selectedDegree && !isCustomDegree && selectedSubjects.length > 0) && (
                      <div className="mt-2">
                        <Tag color="green" icon={<CheckCircleOutlined />}>
                          {selectedSubjects.length} asignaturas sugeridas
                        </Tag>
                      </div>
                    )}
                  </div>
                }
              >
                <Select 
                  mode="tags" 
                  placeholder="Ingresa asignaturas (presiona Enter para añadir)" 
                  tokenSeparators={[',']}
                  className="rounded-md"
                  onChange={handleCoreSubjectsChange}
                  size="large"
                  allowClear
                  disabled={isCustomDegree && !form.getFieldValue('facultyArea')}
                />
              </Form.Item>

              {/* 4. Opciones de Electivas y Adicionales */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                <Row gutter={16}>
                  <Col span={18}>
                    <Form.Item 
                      name="electives" 
                      valuePropName="checked" 
                      className="mb-0"
                    >
                      <Checkbox> <span className="font-medium flex items-center"> <ThunderboltOutlined className="mr-1 text-blue-700" /> Incluir sugerencias de materias optativas </span> </Checkbox>
                    </Form.Item>
                  </Col>
                  <Col span={6} className="text-right">
                    <Badge count="Recomendado" style={{ backgroundColor: '#1a365d' }} />
                  </Col>
                </Row>
              </div>

              <Collapse ghost className="bg-slate-50 rounded-lg border border-slate-200">
                <Panel 
                  header={ <span className="flex items-center font-medium"> <InfoCircleOutlined className="mr-1 text-blue-700" /> Opciones adicionales del plan de estudios </span>} 
                  key="1"
                >
                  <Form.Item name="practicum" valuePropName="checked"><Checkbox>Incluir prácticas profesionales</Checkbox></Form.Item>
                  <Form.Item name="thesis" valuePropName="checked"><Checkbox>Incluir proyecto/tesis de grado</Checkbox></Form.Item>
                  <Form.Item name="research" valuePropName="checked"><Checkbox>Incluir componente de investigación</Checkbox></Form.Item>
                  <Form.Item name="languages" valuePropName="checked"><Checkbox>Incluir formación en idiomas extranjeros</Checkbox></Form.Item>
                  <Form.Item name="socialService" valuePropName="checked"><Checkbox>Incluir servicio social/comunitario</Checkbox></Form.Item>
                </Panel>
              </Collapse>
            </Card>
            {/* Fin Card de Contenido Académico */}


            {(selectedDegree || (isCustomDegree && form.getFieldValue('customDegreeName') && form.getFieldValue('facultyArea'))) && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-100 mb-6 flex items-center">
                <CheckCircleOutlined className="text-green-500 text-xl mr-3" />
                <div>
                  <Text strong className="text-green-800 block">Información lista</Text>
                  <Text className="text-green-700">Los datos para generar tu plan de estudios para {isCustomDegree ? form.getFieldValue('customDegreeName') : selectedDegree} están listos.</Text>
                </div>
              </div>
            )}

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                size="large" 
                block
                className="h-12 text-base font-medium"
                style={{ background: 'linear-gradient(to right, #1a365d, #2c5282)' }}
                icon={<CheckCircleOutlined />}
              >
                Continuar al Siguiente Paso
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
        <TabPane 
          tab={<span><InfoCircleOutlined /> Información Complementaria</span>} 
          key="2"
          disabled
        >
          <div className="max-w-3xl mx-auto">
            <Alert
              message="Sección en Desarrollo"
              description="La información complementaria se habilitará en futuras versiones."
              type="info"
              showIcon
              className="mb-6"
            />
          </div>
        </TabPane>
      </Tabs>

      <style jsx global>{`
        .custom-tabs .ant-tabs-nav::before {
          border-bottom: 2px solid #e5e7eb;
        }
        .custom-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
          color: #1a365d;
          font-weight: 500;
        }
        .custom-tabs .ant-tabs-ink-bar {
          background-color: #1a365d;
          height: 3px;
        }
        .ant-form-item-label > label {
          font-weight: 500;
          color: #1a365d;
        }
        .ant-slider-mark-text {
          font-size: 0.75rem;
        }
        .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
          background-color: #e2e8f0;
        }
        .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
          background: #1a365d;
          border-color: #1a365d;
        }
      `}</style>
    </div>
  );
}