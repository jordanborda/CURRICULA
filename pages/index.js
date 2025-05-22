// File: pages/index.jsx
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

import Head from 'next/head';
import {
  Steps, Button, Typography, Spin, Divider, Card, Result, Layout, Menu,
  Dropdown, Badge, Avatar, Progress, Collapse, Table, Tooltip, Modal,
  notification, Tag, Space, Statistic, Drawer, Alert
} from 'antd';
import {
  BookOutlined, FileTextOutlined, CheckCircleOutlined, UserOutlined,
  BellOutlined, SettingOutlined, LogoutOutlined, MenuFoldOutlined,
  MenuUnfoldOutlined, DashboardOutlined, TeamOutlined, FileSearchOutlined,
  BarChartOutlined, CloudDownloadOutlined, PrinterOutlined, EditOutlined,
  ShareAltOutlined, SaveOutlined, QuestionCircleOutlined, InfoCircleOutlined,
  ClockCircleOutlined, CalendarOutlined, GlobalOutlined, MessageOutlined, StarOutlined
} from '@ant-design/icons';
import ProgramForm from '../components/ProgramForm';

// Importar las nuevas funciones de exportación
import { exportToPdf } from '../components/exportPdf';
import { exportToWord } from '../components/exportWord';
import { exportToExcel } from '../components/exportExcel';


const { Title, Paragraph, Text } = Typography;
const { Step } = Steps;
const { Header, Content, Sider, Footer } = Layout;
const { Panel } = Collapse;

// ... (Mantén tus iconos SVG personalizados: CustomFilePdfIcon, CustomFileWordIcon, CustomFileExcelIcon)
const CustomFilePdfIcon = () => (
  <svg viewBox="64 64 896 896" focusable="false" width="1em" height="1em" fill="currentColor">
    <path d="M531.3 574.4l.3-1.4c5.8-23.9 13.1-53.7 7.4-80.7-3.8-21.3-19.5-29.6-32.9-30.2-15.8-.7-29.9 8.3-33.4 21.4-6.6 24-.7 56.8 10.1 98.6-13.6 32.4-35.3 79.5-51.2 107.5-29.6 15.3-69.3 38.9-75.2 68.7-1.2 5.5.2 12.5 3.5 18.8 3.7 7 9.6 12.4 16.5 15 3 1.1 6.6 2 10.8 2 17.6 0 46.1-14.2 84.1-79.4 5.8-1.9 11.8-3.9 17.6-5.9 27.2-9.2 55.4-18.8 80.9-23.1 28.2 15.1 60.3 24.8 82.1 24.8 21.6 0 30.1-12.8 33.3-20.5 5.6-13.5 2.9-30.5-6.2-39.6-13.2-13-45.3-16.4-95.3-10.2-24.6-15-40.7-35.4-52.4-65.8zM421.6 726.3c-13.9 20.2-24.4 30.3-30.1 34.7 6.7-12.3 19.8-25.3 30.1-34.7zm87.6-235.5c5.2 8.9 4.5 35.8.5 49.4-4.9-19.9-5.6-48.1-2.7-51.4.8.1 1.5.7 2.2 2zm-1.6 120.5c10.7 18.5 24.2 34.4 39.1 46.2-21.6 4.9-41.3 13-58.9 20.2-4.2 1.7-8.3 3.4-12.3 5 13.3-24.1 24.4-51.4 32.1-71.4zm155.6 65.5c.1.4.1.9.2 1.3-5.0 5.3-17.5 6.2-28.5 4.1 9.4-1.0 17.7-2.7 24.7-4.4 1.3-.3 2.5-.7 3.6-1zm-116.4-47.4c12.4 2.1 24.2 3.1 35 3.1 12.5 0 23.9-1.3 33.7-3.5-11.5 5.9-33.4 9.1-68.7.4zm-9.4-48.5c0-2.4.2-4.8.5-7.1.6-5.3 2.5-9.9 5.3-14-2.3 15.9-3.3 27.5-3.4 38.9-1-5.5-1.7-11.4-1.7-17.8h-.7z"></path><path d="M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM602 137.8L790.2 326H602V137.8zM792 888H232V136h302v216a42 42 0 0042 42h216v494z"></path>
  </svg>
);

const CustomFileWordIcon = () => (
  <svg viewBox="64 64 896 896" focusable="false" width="1em" height="1em" fill="currentColor">
    <path d="M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0042 42h216v494zM528.1 472h-32.2c-5.5 0-10.3 3.7-11.6 9.1L434.6 680l-46.1-198.7c-1.3-5.4-6.1-9.3-11.7-9.3h-35.4a12.02 12.02 0 00-11.6 15.1l74.2 276c1.4 5.2 6.2 8.9 11.6 8.9h32c5.5 0 10.2-3.7 11.6-9.1l49.9-199.2 49.9 199.2c1.3 5.4 6.1 9.1 11.6 9.1h31.8c5.4 0 10.2-3.6 11.6-8.9l74.4-276a12.04 12.04 0 00-11.6-15.1H647c-5.6 0-10.4 3.9-11.7 9.3L589.1 680l-49.4-198.9c-1.3-5.4-6.1-9.1-11.6-9.1z"></path>
  </svg>
);

const CustomFileExcelIcon = () => (
  <svg viewBox="64 64 896 896" focusable="false" width="1em" height="1em" fill="currentColor">
    <path d="M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0042 42h216v494zM514.1 580.1l-61.8-102.4c-2.2-3.6-6.1-5.8-10.3-5.8h-38.4c-2.6 0-5 1-6.9 2.8-1.9 1.8-2.9 4.2-3 6.8-.1 2.6.9 5.1 2.7 6.9l61.8 102.4-61.8 102.4c-1.8 1.8-2.8 4.3-2.7 6.9.1 2.6 1.1 5 3 6.8 1.9 1.8 4.3 2.8 6.9 2.8h38.4c4.2 0 8.1-2.2 10.3-5.8l61.8-102.4L579.8 689c2.2 3.6 6.1 5.8 10.3 5.8h38.4c2.6 0 5-1 6.9-2.8 1.9 1.8 2.9-4.2 3-6.8.1-2.6-.9-5.1-2.7-6.9l-61.8-102.4 61.8-102.4c1.8-1.8 2.8-4.3 2.7-6.9-.1-2.6-1.1-5-3-6.8-1.9-1.8-4.3-2.8-6.9-2.8h-38.4c-4.2 0-8.1 2.2-10.3 5.8l-65.7 109.2z"></path>
  </svg>
);


export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);
  const [programData, setProgramData] = useState(null);
  const [curriculaPlan, setCurriculaPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [helpDrawerVisible, setHelpDrawerVisible] = useState(false);
  const [activeSideMenu, setActiveSideMenu] = useState('dashboard');
  const [documentProgress, setDocumentProgress] = useState(0);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [isMounted, setIsMounted] = useState(false);


  useEffect(() => {
    setIsMounted(true);
    const visited = localStorage.getItem('visitedPlaniCurricula');
    if (!visited) {
      setIsFirstVisit(true);
      localStorage.setItem('visitedPlaniCurricula', 'true');
    }
  }, []);

  useEffect(() => {
    let progressTimer;
    if (loading) {
      let currentProgress = 0;
      setDocumentProgress(0); 

      progressTimer = setInterval(() => {
        currentProgress += Math.random() * 8 + 4;
        if (currentProgress >= 95) {
          currentProgress = 95; 
          clearInterval(progressTimer);
        }
        setDocumentProgress(currentProgress);
      }, 700);
    } else {
      if (documentProgress > 0 && documentProgress < 100) {
        setDocumentProgress(100);
      }
    }
    return () => clearInterval(progressTimer);
  }, [loading, documentProgress]); // Agregado documentProgress a las dependencias


  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  // Actualizar handleExport
  const handleExport = async (type) => {
    if (!curriculaPlan) {
      notification.warn({
        message: 'No hay contenido para exportar',
        description: 'Por favor, genera un plan primero.',
        placement: 'bottomRight',
      });
      return;
    }

    // La notificación de éxito ahora se maneja dentro de cada función de exportación
    // La notificación de error también se maneja allí si es específica
    // o aquí si es un error genérico del switch.
    try {
      switch (type) {
        case 'pdf':
          await exportToPdf(curriculaPlan, programData, notification);
          break;
        case 'word':
          await exportToWord(curriculaPlan, programData, notification);
          break;
        case 'excel':
          // Para Excel no necesitamos pasar estilos complejos de CSS
          exportToExcel(curriculaPlan, programData, notification);
          break;
        default:
          notification.error({ 
            message: 'Tipo de exportación no válido',
            description: `El tipo de exportación "${type}" no es soportado.`,
            placement: 'bottomRight'
          });
      }
    } catch (error) {
      // Este catch es por si las funciones de exportación no manejan sus propios errores
      // o para errores inesperados. Las funciones actuales ya tienen su try/catch.
      console.error(`Error general durante la exportación a ${type}:`, error);
      notification.error({
        message: `Error al exportar a ${type.toUpperCase()}`,
        description: error.message || 'Ocurrió un problema inesperado durante la exportación.',
        placement: 'bottomRight',
      });
    }
  };


  const steps = [
    {
      title: 'Definir Programa',
      icon: <BookOutlined />,
      content: <ProgramForm onSubmit={vals => {
        setProgramData(vals);
        setCurrentStep(1);
        notification.success({
          message: 'Información registrada',
          description: 'Los datos del programa han sido guardados correctamente.',
          placement: 'topRight'
        });
      }} />
    },
    {
      title: 'Generar Plan',
      icon: <FileTextOutlined />,
      content: (
        <div className="flex flex-col items-center justify-center py-10">
          <Card className="w-full max-w-3xl shadow-lg border-0 bg-gradient-to-r from-slate-50 to-gray-50">
            <div className="text-center mb-8">
              <Title level={3} className="text-slate-800 mb-3">Generación del Plan de Estudios</Title>
              <Paragraph className="text-slate-600 max-w-md mx-auto">
                Nuestro sistema de IA analizará la información proporcionada para crear un plan de estudios
                personalizado y optimizado para el programa {programData?.degree}.
              </Paragraph>
            </div>

            <div className="bg-white p-6 rounded-lg border border-slate-200 mb-6">
              <div className="flex justify-between items-center mb-4">
                <Text strong className="text-slate-700">Detalles del programa</Text>
                <Button type="link" icon={<EditOutlined />} onClick={() => setCurrentStep(0)}>Editar</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <BookOutlined className="text-slate-700 mr-2" />
                  <Text className="text-slate-800">Carrera: <Text strong>{programData?.degree || 'No especificado'}</Text></Text>
                </div>
                <div className="flex items-center">
                  <GlobalOutlined className="text-slate-700 mr-2" />
                  <Text className="text-slate-800">Área: <Text strong>{programData?.faculty ? programData.faculty.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'No especificada'}</Text></Text>
                </div>
                <div className="flex items-center">
                  <ClockCircleOutlined className="text-slate-700 mr-2" />
                  <Text className="text-slate-800">Duración: <Text strong>{programData?.duration || '-'} años</Text></Text>
                </div>
                <div className="flex items-center">
                  <CalendarOutlined className="text-slate-700 mr-2" />
                  <Text className="text-slate-800">Periodos/año: <Text strong>{programData?.semestersPerYear || '-'}</Text></Text>
                </div>
                <div className="flex items-center">
                  <InfoCircleOutlined className="text-slate-700 mr-2" />
                  <Text className="text-slate-800">Optativas: <Text strong>{programData?.electives ? 'Incluidas' : 'No incluidas'}</Text></Text>
                </div>
              </div>

              {programData?.socioformativeDemands && programData.socioformativeDemands.length > 0 && (
                <div className="mt-4">
                  <Text strong className="text-slate-700 block mb-2">Demandas Socioformativas Clave:</Text>
                  <div className="flex flex-wrap gap-2">
                    {programData.socioformativeDemands.map((demand, index) => (
                      <Tag color="purple" key={index}>{demand.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</Tag>
                    ))}
                  </div>
                </div>
              )}
              {programData?.competencies && programData.competencies.length > 0 && (
                <div className="mt-4">
                  <Text strong className="text-slate-700 block mb-2">Competencias a Desarrollar:</Text>
                  <div className="flex flex-wrap gap-2">
                    {programData.competencies.map((comp, index) => (
                      <Tag color="geekblue" key={index}>{comp}</Tag>
                    ))}
                  </div>
                </div>
              )}
              {programData?.coreSubjects && programData.coreSubjects.length > 0 && (
                <div className="mt-4">
                  <Text strong className="text-slate-700 block mb-2">Asignaturas Obligatorias (Propuestas por el usuario):</Text>
                  <div className="flex flex-wrap gap-2">
                    {programData.coreSubjects.map((subject, index) => (
                      <Tag color="blue" key={index}>{subject}</Tag>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Button
              type="primary"
              size="large"
              disabled={!programData || loading}
              loading={loading}
              onClick={async () => {
                setCurriculaPlan(''); 
                setLoading(true);

                try {
                  console.log("Enviando a API:", { programData });
                  const res = await fetch('/api/generateCurriculaPlan', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ programData })
                  });
                  const json = await res.json();
                  console.log("Respuesta de API:", json);

                  if (res.ok || res.status === 207) { 
                    let combinedMarkdown = "";

                    if (json.planDemandas && !json.planDemandas.startsWith("Error al generar")) {
                      combinedMarkdown += `## Demandas Socioformativas y Ejes Curriculares\n\n${json.planDemandas}\n\n<br />\n\n`;
                    } else {
                      combinedMarkdown += `## Demandas Socioformativas y Ejes Curriculares\n\n*No se pudo generar la tabla de demandas o hubo un error.*\n\n*Detalle: ${json.planDemandas || 'Error desconocido'}*\n\n<br />\n\n`;
                      notification.warning({
                        message: 'Error en Demandas Socioformativas',
                        description: json.planDemandas || 'No se pudo generar la tabla de demandas.',
                        placement: 'topRight'
                      });
                    }

                    if (json.planPerfiles && !json.planPerfiles.startsWith("Error al generar")) {
                      combinedMarkdown += `## Perfiles de Egreso\n\n${json.planPerfiles}\n\n<br />\n\n`;
                    } else {
                      combinedMarkdown += `## Perfiles de Egreso\n\n*No se pudo generar la tabla de perfiles o hubo un error.*\n\n*Detalle: ${json.planPerfiles || 'Error desconocido'}*\n\n<br />\n\n`;
                      notification.warning({
                        message: 'Error en Perfiles',
                        description: json.planPerfiles || 'No se pudo generar la tabla de perfiles.',
                        placement: 'topRight'
                      });
                    }

                    if (json.planCompetencias && !json.planCompetencias.startsWith("Error al generar")) {
                      combinedMarkdown += `## Competencias y Asignaturas\n\n${json.planCompetencias}\n\n<br />\n\n`;
                    } else {
                      combinedMarkdown += `## Competencias y Asignaturas\n\n*No se pudo generar la tabla de competencias o hubo un error.*\n\n*Detalle: ${json.planCompetencias || 'Error desconocido'}*\n\n<br />\n\n`;
                      notification.warning({
                        message: 'Error en Competencias',
                        description: json.planCompetencias || 'No se pudo generar la tabla de competencias.',
                        placement: 'topRight'
                      });
                    }

                    if (json.planMalla && !json.planMalla.startsWith("Error al generar")) {
                      combinedMarkdown += `## Malla Curricular\n\n${json.planMalla}\n\n<br />\n\n`;
                    } else {
                      combinedMarkdown += `## Malla Curricular\n\n*No se pudo generar la tabla de malla o hubo un error.*\n\n*Detalle: ${json.planMalla || 'Error desconocido'}*\n\n<br />\n\n`;
                      notification.warning({
                        message: 'Error en Malla',
                        description: json.planMalla || 'No se pudo generar la tabla de malla.',
                        placement: 'topRight'
                      });
                    }

                    if (json.planPlanEstudios && !json.planPlanEstudios.startsWith("Error al generar")) {
                      combinedMarkdown += `## Plan de Estudios Detallado\n\n${json.planPlanEstudios}\n\n<br />\n\n`;
                    } else {
                      combinedMarkdown += `## Plan de Estudios Detallado\n\n*No se pudo generar la tabla del plan de estudios detallado o hubo un error.*\n\n*Detalle: ${json.planPlanEstudios || 'Error desconocido'}*\n\n<br />\n\n`;
                      notification.warning({
                        message: 'Error en Plan de Estudios Detallado',
                        description: json.planPlanEstudios || 'No se pudo generar la tabla del plan de estudios detallado.',
                        placement: 'topRight'
                      });
                    }
                    
                    if (json.planResumenAreas && !json.planResumenAreas.startsWith("Error al generar")) {
                      // El prompt de planResumenAreas ya incluye el título "### 6.3.2. Resumen..."
                      // así que no necesitamos añadir un H2 aquí si tiene éxito.
                       combinedMarkdown += `\n\n${json.planResumenAreas}\n\n`; 
                    } else {
                      // Si hay error, sí ponemos un título H2 para el mensaje de error.
                      combinedMarkdown += `## Resumen del Plan por Áreas\n\n*No se pudo generar la tabla de resumen o hubo un error.*\n\n*Detalle: ${json.planResumenAreas || 'Error desconocido'}*\n\n`;
                      notification.warning({
                        message: 'Error en Resumen por Áreas',
                        description: json.planResumenAreas || 'No se pudo generar la tabla de resumen.',
                        placement: 'topRight'
                      });
                    }


                    setCurriculaPlan(combinedMarkdown.trim());
                    setCurrentStep(2);
                    notification.success({
                      message: json.statusGlobal || 'Proceso de generación completado',
                      description: json.statusGlobal === "Completado exitosamente"
                        ? 'Tu plan de estudios ha sido creado.'
                        : 'Algunas partes del plan pueden tener errores. Por favor, revisa el resultado.',
                      placement: 'topRight'
                    });
                  } else {
                    throw new Error(json.error || `Error del servidor: ${res.status}`);
                  }
                } catch (error) {
                  console.error("Error en la generación del plan (catch):", error);
                  setCurriculaPlan(`## Error General\n\nOcurrió un error al generar el plan completo:\n\n\`\`\`\n${error.message}\n\`\`\`\n\nPor favor, revisa la consola del servidor para más detalles e intenta nuevamente.`);
                  setCurrentStep(2); // Avanzar para mostrar el error
                  notification.error({
                    message: 'Error Crítico en la Generación',
                    description: error.message || 'Ocurrió un problema al generar el plan. Intenta nuevamente o contacta soporte.',
                    duration: 7,
                    placement: 'topRight'
                  });
                } finally {
                  setLoading(false);
                  // Asegurar que el progreso llegue al 100% si no hubo error crítico antes de setLoading(false)
                  // y si el curriculaPlan tiene contenido.
                  if (curriculaPlan || (documentProgress > 0 && documentProgress < 100) ) { // Chequea si curriculaPlan tiene algo
                     setTimeout(() => setDocumentProgress(100), 200); // Dar un pequeño delay para que se vea el 95%
                  } else if (!curriculaPlan && documentProgress < 100) {
                     setDocumentProgress(0); // Si no hay plan y no llegó a 100, resetear.
                  }
                }
              }}
              className="w-full h-12 text-base font-medium shadow-md"
              style={{ background: 'linear-gradient(to right, #1a365d, #2c5282)' }}
              icon={<FileSearchOutlined />}
            >
              Generar Plan de Estudios
            </Button>

            {loading && (
              <div className="mt-8">
                <div className="flex justify-between items-center mb-2">
                  <Text className="text-slate-700">Progreso de generación</Text>
                  <Text className="text-slate-700">{Math.round(documentProgress)}%</Text>
                </div>
                <Progress
                  percent={documentProgress}
                  status={documentProgress < 100 ? "active" : (curriculaPlan && !curriculaPlan.toLowerCase().includes("error") ? "success" : "exception")}
                  strokeColor={{
                    '0%': '#1a365d',
                    '100%': '#2c5282',
                  }}
                  showInfo={false}
                />
                <div className="flex gap-2 mt-4 flex-wrap justify-center">
                  <Tag icon={<MessageOutlined />} color={documentProgress >= 16 ? "success" : "processing"}>Demandas</Tag>
                  <Tag icon={<UserOutlined />} color={documentProgress >= 33 ? "success" : "processing"}>Perfiles</Tag>
                  <Tag icon={<StarOutlined />} color={documentProgress >= 50 ? "success" : "processing"}>Competencias</Tag>
                  <Tag icon={<FileTextOutlined />} color={documentProgress >= 67 ? "success" : "processing"}>Malla</Tag>
                  <Tag icon={<CalendarOutlined />} color={documentProgress >= 84 ? "success" : "processing"}>Plan Detallado</Tag>
                  <Tag icon={<BarChartOutlined />} color={documentProgress >= 95 ? "success" : "processing"}>Resumen Áreas</Tag>
                </div>
              </div>
            )}
          </Card>
        </div>
      )
    },
    {
      title: 'Resultado',
      icon: <CheckCircleOutlined />,
      content: (
        <div className="mt-4">
          <Card className="bg-gradient-to-r from-slate-50 to-gray-50 shadow-lg border-0 mb-8">
            <Result
              status={curriculaPlan && !curriculaPlan.toLowerCase().includes("error") ? "success" : "warning"}
              title={
                <span className="text-slate-800">
                  {curriculaPlan && !curriculaPlan.toLowerCase().includes("error")
                    ? "Plan de Estudios Generado"
                    : "Revisión del Plan de Estudios"}
                </span>
              }
              subTitle={
                <span className="text-slate-600">
                  {curriculaPlan && !curriculaPlan.toLowerCase().includes("error")
                    ? `Plan para ${programData?.degree || 'tu carrera'} de ${programData?.duration || ''} años con ${programData?.semestersPerYear || ''} semestres por año.`
                    : "Se encontraron problemas durante la generación o el plan está incompleto. Por favor, revisa los detalles a continuación."}
                </span>
              }
              extra={[
                <Button
                  key="dashboard"
                  type="primary"
                  icon={<DashboardOutlined />}
                  onClick={() => setModalVisible(true)}
                  style={{ background: 'linear-gradient(to right, #1a365d, #2c5282)' }}
                >
                  Ver Dashboard (Simulado)
                </Button>,
                <Dropdown
                  key="export"
                  menu={{
                    items: [
                      { key: 'pdf', label: 'Exportar como PDF', icon: <CustomFilePdfIcon /> },
                      { key: 'word', label: 'Exportar como Word', icon: <CustomFileWordIcon /> },
                      { key: 'excel', label: 'Exportar como Excel', icon: <CustomFileExcelIcon /> }
                    ],
                    onClick: ({ key }) => handleExport(key) // Ya es async
                  }}
                >
                  <Button icon={<CloudDownloadOutlined />}>Exportar</Button>
                </Dropdown>
              ]}
            />
          </Card>

          {/* ... (resto de tu JSX para las tarjetas de estadísticas y el ReactMarkdown) ... */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card
              className="shadow-md border-t-4"
              style={{ borderTopColor: '#1a365d' }}
              title={
                <div className="flex items-center">
                  <CalendarOutlined className="text-slate-700 mr-2" />
                  <span>Duración Total</span>
                </div>
              }
            >
              <Statistic
                value={(programData?.duration && programData?.semestersPerYear) ? (programData.duration * programData.semestersPerYear) : 0}
                suffix="Semestres"
                valueStyle={{ color: '#1a365d' }}
              />
              <Text className="text-slate-600 block mt-2">
                Equivalente a {programData?.duration || 0} años académicos
              </Text>
            </Card>

            <Card
              className="shadow-md border-t-4"
              style={{ borderTopColor: '#2c5282' }}
              title={
                <div className="flex items-center">
                  <BookOutlined className="text-slate-700 mr-2" />
                  <span>Asignaturas Principales</span>
                </div>
              }
            >
              <Statistic
                value={programData?.coreSubjects?.length || 0} // Esto podría mejorarse contando las asignaturas reales del plan
                suffix="Materias"
                valueStyle={{ color: '#2c5282' }}
              />
              <Text className="text-slate-600 block mt-2">
                {programData?.electives ? 'Incluye materias optativas adicionales' : 'Solo materias obligatorias'}
              </Text>
            </Card>

            <Card
              className="shadow-md border-t-4"
              style={{ borderTopColor: '#3182ce' }}
              title={
                <div className="flex items-center">
                  <TeamOutlined className="text-slate-700 mr-2" />
                  <span>Perfil Profesional</span>
                </div>
              }
            >
              <Statistic
                value="Completo" // Esto es una simulación
                valueStyle={{ color: '#3182ce' }}
              />
              <Text className="text-slate-600 block mt-2">
                Plan optimizado para el mercado laboral actual
              </Text>
            </Card>
          </div>

          <Card
            className="shadow-xl border-0"
            title={
              <div className="flex items-center">
                <FileTextOutlined className="text-slate-700 mr-2" />
                <span className="text-slate-800">Plan de Estudios Detallado</span>
              </div>
            }
            extra={
              <Space>
                <Tooltip title="Imprimir Plan">
                  <Button type="text" icon={<PrinterOutlined />} onClick={() => window.print()} />
                </Tooltip>
                <Tooltip title="Editar Plan (Funcionalidad futura)">
                  <Button type="text" icon={<EditOutlined />} disabled />
                </Tooltip>
                <Tooltip title="Compartir Plan (Funcionalidad futura)">
                  <Button type="text" icon={<ShareAltOutlined />} disabled />
                </Tooltip>
              </Space>
            }
            bodyStyle={{ maxHeight: '700px', overflowY: 'auto', overflowX: 'hidden' }}
          >
            <div className="markdown-content bg-slate-50 p-6 rounded-lg text-slate-800 border border-slate-200 shadow-inner">
              {curriculaPlan ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw, rehypeSanitize]}
                >
                  {curriculaPlan}
                </ReactMarkdown>
              ) : (
                <div className="text-center py-10">
                  <Spin size="large" tip="Generando plan..." />
                  <Paragraph className="mt-4 text-slate-600">
                    Por favor espera mientras se genera tu plan de estudios.
                    {loading && documentProgress < 5 && " Iniciando..."}
                  </Paragraph>
                </div>
              )}
            </div>
          </Card>

          <div className="flex justify-center mt-8 gap-4">
            <Button
              type="primary"
              icon={<SaveOutlined />}
              size="large"
              style={{ background: 'linear-gradient(to right, #1a365d, #2c5282)' }}
              onClick={() => notification.info({message: "Funcionalidad no implementada", description: "Guardar Plan aún no está disponible."})}
            >
              Guardar Plan
            </Button>
            <Button
              icon={<EditOutlined />}
              size="large"
              onClick={() => {
                setCurrentStep(0);
                setCurriculaPlan(''); 
                setProgramData(null); 
                setDocumentProgress(0); 
              }}
            >
              Crear Nuevo Plan
            </Button>
          </div>
        </div>
      )
    }
  ];

  // ... (Mantén tu dashboardModal, helpDrawer, welcomeModal y el return de Home() igual)
  const dashboardModal = (
    <Modal
      title={ <div className="flex items-center"> <DashboardOutlined className="text-slate-700 mr-2" /> <span>Dashboard de Análisis del Plan (Simulado)</span> </div> }
      open={modalVisible}
      onCancel={() => setModalVisible(false)}
      footer={null}
      width={900}
      className="dashboard-modal"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="text-center"> <Statistic title="Total de Asignaturas" value={(programData?.coreSubjects?.length || 0) + 40} prefix={<BookOutlined />} /> </Card>
        <Card className="text-center"> <Statistic title="Carga Horaria Total" value={(programData?.duration || 0) * 960} suffix="horas" prefix={<ClockCircleOutlined />} /> </Card>
        <Card className="text-center"> <Statistic title="Índice de Empleabilidad" value={85} suffix="%" prefix={<TeamOutlined />} valueStyle={{ color: '#3f8600' }} /> </Card>
      </div>
      <Collapse defaultActiveKey={['1']} className="mb-6">
        <Panel header="Distribución por Áreas de Conocimiento" key="1">
          <div className="mb-4">
            <Progress percent={25} strokeColor="#1a365d" format={() => 'Estudios Generales 25%'} />
            <Progress percent={50} strokeColor="#2c5282" format={() => 'Estudios Específicos 50%'} />
            <Progress percent={25} strokeColor="#3182ce" format={() => 'Estudios de Especialidad 25%'} />
          </div>
        </Panel>
        <Panel header="Competencias Desarrolladas (Ejemplo)" key="2">
          <div className="flex flex-wrap gap-2">
            {programData?.competencies?.slice(0, 5).map(comp => <Tag color="blue" key={comp}>{comp}</Tag>) ?? <Text>No hay competencias definidas.</Text>}
          </div>
        </Panel>
      </Collapse>
      <Table
        dataSource={[
          { key: '1', semester: '1', courses: 5, credits: 15, hours: 240 },
          { key: '2', semester: '2', courses: 5, credits: 15, hours: 240 },
          { key: '3', semester: '3', courses: 5, credits: 15, hours: 240 },
          { key: '4', semester: '4', courses: 5, credits: 15, hours: 240 },
        ]}
        columns={[
          { title: 'Semestre', dataIndex: 'semester', key: 'semester' },
          { title: 'Asignaturas', dataIndex: 'courses', key: 'courses' },
          { title: 'Créditos', dataIndex: 'credits', key: 'credits' },
          { title: 'Horas', dataIndex: 'hours', key: 'hours' },
        ]}
        size="small" className="mb-6" pagination={false}
      />
      <div className="flex justify-end gap-2">
        <Button icon={<CloudDownloadOutlined />} onClick={() => handleExport('dashboard_report.pdf')}> Exportar Reporte </Button>
        <Button type="primary" onClick={() => setModalVisible(false)}> Cerrar </Button>
      </div>
    </Modal>
  );

  const helpDrawer = (
    <Drawer
      title={ <div className="flex items-center"> <QuestionCircleOutlined className="text-slate-700 mr-2" /> <span>Centro de Ayuda</span> </div> }
      placement="right"
      onClose={() => setHelpDrawerVisible(false)}
      open={helpDrawerVisible}
      width={380}
    >
      <Collapse defaultActiveKey={['1']} className="shadow-sm">
        <Panel header="¿Cómo funciona el sistema?" key="1"> <Paragraph className="text-slate-600"> El sistema utiliza inteligencia artificial para analizar los datos de tu programa y generar automáticamente un plan de estudios estructurado, incluyendo perfiles de egreso, competencias, asignaturas y una malla curricular sugerida. </Paragraph> </Panel>
        <Panel header="¿Puedo editar el plan generado?" key="2"> <Paragraph className="text-slate-600"> Actualmente, la edición directa del plan dentro de la aplicación no está implementada. Sin embargo, puedes exportar el plan (ej. a Word) y editarlo externamente. También puedes ajustar los datos de entrada y generar un nuevo plan. </Paragraph> </Panel>
        <Panel header="¿Qué son las Demandas Socioformativas?" key="3"> <Paragraph className="text-slate-600"> Son los requerimientos y expectativas sociales, culturales, económicas y ambientales que la formación profesional debe atender para asegurar que los egresados sean pertinentes y contribuyan al desarrollo de la sociedad. </Paragraph> </Panel>
      </Collapse>
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <Title level={5} className="text-slate-800">¿Necesitas más ayuda?</Title>
        <Button type="link" icon={<TeamOutlined />} block onClick={() => notification.info({message: "Contactar Soporte (Simulado)", description:"Esta funcionalidad aún no está implementada."})}> Contactar Soporte </Button>
      </div>
    </Drawer>
  );

  const welcomeModal = isMounted && (
    <Modal
      title={ <div className="flex items-center"> <BookOutlined className="text-slate-700 mr-2" /> <span>Bienvenido al Planificador de Currícula</span> </div> }
      open={isFirstVisit}
      onCancel={() => setIsFirstVisit(false)}
      footer={[ <Button key="start" type="primary" onClick={() => setIsFirstVisit(false)}> Comenzar </Button> ]}
      width={700}
    >
      <div className="py-4">
        <Paragraph className="text-slate-600 text-lg"> ¡Hola! 👋 Bienvenido al Planificador de Currícula Inteligente. Esta herramienta te ayudará a diseñar planes de estudio universitarios de manera eficiente y estructurada. </Paragraph>
        <Divider />
        <div className="my-6">
          <Title level={5} className="text-slate-800">¿Cómo comenzar?</Title>
          <Steps direction="vertical" size="small" current={-1} className="mt-4 custom-steps-modal">
            <Step title="Define tu Programa" description="Ingresa los datos básicos de la carrera que deseas planificar." icon={<BookOutlined />} />
            <Step title="Genera el Plan" description="Nuestra IA analizará la información y creará las tablas curriculares." icon={<FileSearchOutlined />} />
            <Step title="Explora y Exporta" description="Revisa el plan generado, visualiza un dashboard y exporta los resultados." icon={<CheckCircleOutlined />} />
          </Steps>
        </div>
        <Alert message="Recuerda que este es un asistente. Siempre revisa y ajusta los resultados generados por la IA según tus necesidades y criterios académicos." type="info" showIcon />
      </div>
    </Modal>
  );

  return (
    <Layout className="min-h-screen">
      <Head>
        <title>Planificador de Currícula Universitaria</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" />
      </Head>

      <Header className="bg-slate-900 px-6 flex justify-between items-center shadow-md z-10" style={{ position: 'sticky', top: 0, height: '64px' }}>
        <div className="flex items-center">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleCollapsed}
            className="text-white mr-6 text-xl leading-none h-auto"
            style={{ fontSize: '20px' }}
          />
          <div className="flex items-center">
            <BookOutlined className="text-blue-400 text-2xl mr-2" />
            <Title level={4} className="text-white mb-0 hidden md:block">Planificador de Currícula</Title>
            <Title level={5} className="text-white mb-0 block md:hidden">PCU</Title>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Tooltip title="Centro de Ayuda">
            <Button type="text" icon={<QuestionCircleOutlined className="text-white text-xl" />} onClick={() => setHelpDrawerVisible(true)} style={{ fontSize: '20px' }} />
          </Tooltip>
          <Tooltip title="Notificaciones">
            <Badge count={1} offset={[-2, 2]} size="small"> {/* Count hardcoded, puede ser dinámico */}
              <Button type="text" icon={<BellOutlined className="text-white text-xl" />} style={{ fontSize: '20px' }} />
            </Badge>
          </Tooltip>
          <Dropdown menu={{ items: [
              { key: '1', label: 'Mi Perfil', icon: <UserOutlined /> },
              { key: '2', label: 'Configuración', icon: <SettingOutlined /> },
              { type: 'divider' },
              { key: '3', label: 'Cerrar Sesión', icon: <LogoutOutlined /> }
            ]}}>
            <div className="flex items-center cursor-pointer ml-2">
              <Avatar icon={<UserOutlined />} className="bg-blue-500" size="default" />
              <span className="text-white ml-2 hidden md:block">Admin</span>
            </div>
          </Dropdown>
        </div>
      </Header>

      <Layout>
        <Sider
          width={240} collapsible collapsed={collapsed} trigger={null}
          className="bg-slate-800 shadow-lg"
          style={{ overflow: 'auto', height: `calc(100vh - 64px)`, position: 'sticky', top: 64, left: 0 }}
        >
          <Menu
            theme="dark" mode="inline" selectedKeys={[activeSideMenu]}
            onClick={({ key }) => setActiveSideMenu(key)}
            className="bg-slate-800 border-r-0 pt-4"
            items={[
              { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
              { key: 'programs', icon: <BookOutlined />, label: 'Programas' },
              { key: 'reports', icon: <BarChartOutlined />, label: 'Reportes' },
              { key: 'users', icon: <TeamOutlined />, label: 'Usuarios' },
              { key: 'settings', icon: <SettingOutlined />, label: 'Configuración' },
              { key: 'help', icon: <QuestionCircleOutlined />, label: 'Ayuda' } // Puedes hacer que este abra el Drawer también
            ]}
          />
          <div className={`px-4 py-6 text-gray-400 mt-auto text-xs ${collapsed ? 'text-center' : ''}`}>
            <GlobalOutlined className="mr-1" />
            {!collapsed && <span>v0.1.0</span>}
          </div>
        </Sider>

        <Content className="bg-slate-100 p-4 md:p-6" style={{ minHeight: `calc(100vh - 64px - 70px)` }}>
          <Card className="shadow-lg border-0 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <Title level={3} className="text-slate-800 mb-1">Planificador de Currícula</Title>
                <Paragraph className="text-slate-600 mb-0">
                  Genera planes de estudio profesionales con inteligencia artificial.
                </Paragraph>
              </div>
              <div className="mt-4 md:mt-0">
                <Space>
                  <Badge status="success" text="IA Activa" />
                  <Divider type="vertical" />
                  <Text type="secondary"> <ClockCircleOutlined className="mr-1" /> {new Date().toLocaleDateString()} </Text>
                </Space>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-lg border border-slate-200 shadow-sm">
              <Steps current={currentStep} className="custom-steps mb-8">
                {steps.map(item => ( <Step key={item.title} title={item.title} icon={item.icon} /> ))}
              </Steps>
              <div className="min-h-[350px] sm:min-h-[400px]"> {steps[currentStep]?.content} </div>
            </div>
          </Card>
        </Content>
      </Layout>

      <Footer className="bg-slate-900 text-center text-slate-400 py-4" style={{ height: '70px' }}>
        <div className="container mx-auto"> <Text className="text-slate-500">© 2024 Planificador de Currícula. Todos los derechos reservados.</Text> </div>
      </Footer>

      {dashboardModal}
      {helpDrawer}
      {welcomeModal}

      <style jsx global>{`
        body { font-family: 'Inter', sans-serif; background-color: #f8fafc; }
        .ant-steps-item-process .ant-steps-item-icon { background-color: #1a365d; border-color: #1a365d; }
        .ant-steps-item-finish .ant-steps-item-icon { border-color: #1a365d; }
        .ant-steps-item-finish .ant-steps-item-icon > .ant-steps-icon { color: #1a365d; }
        .ant-steps-item-finish > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title::after { background-color: #1a365d; }
        .ant-btn-primary { background-color: #1a365d; border-color: #1a365d; }
        .ant-btn-primary:hover, .ant-btn-primary:focus { background-color: #2c5282; border-color: #2c5282; }
        .custom-steps .ant-steps-item-process .ant-steps-item-icon { box-shadow: 0 0 0 5px rgba(26, 54, 93, 0.1); }
        .custom-steps-modal .ant-steps-item-icon { font-size: 16px !important; }
        .custom-steps-modal .ant-steps-item-title { font-size: 14px !important; }
        .custom-steps-modal .ant-steps-item-description { font-size: 12px !important; }

        .dashboard-modal .ant-modal-content { border-radius: 8px; overflow: hidden; }
        .dashboard-modal .ant-modal-header { background-color: #f8fafc; border-bottom: 1px solid #e2e8f0; padding: 16px 24px; }
        .ant-collapse-header { font-weight: 600; color: #1a365d !important; }
        .ant-tag { border-radius: 4px; font-weight: 500; }
        .ant-card { border-radius: 8px; }
        .ant-btn { border-radius: 6px; font-weight: 500; }
        .ant-menu-dark.ant-menu-inline .ant-menu-item-selected { background-color: #1a365d; }
        /* Markdown styles */
        .markdown-content { font-size: 1rem; line-height: 1.6; color: #334155; }
        .markdown-content table { width: 100%; border-collapse: collapse; margin: 1.5em 0; font-size: 0.9em; border: 1px solid #cbd5e1; }
        .markdown-content table th, .markdown-content table td { border: 1px solid #e2e8f0; padding: 0.6em 0.8em; vertical-align: top; }
        .markdown-content table th { background-color: #f1f5f9; font-weight: 600; text-align: left; color: #1e293b; }
        .markdown-content table tr:nth-child(even) td { background-color: #f8fafc; }
        .markdown-content h1, .markdown-content h2, .markdown-content h3, .markdown-content h4 { color: #1a365d; margin-top: 1.5em; margin-bottom: 0.8em; font-weight: 600; line-height: 1.3; }
        .markdown-content h1 { font-size: 2em; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.3em; }
        .markdown-content h2 { font-size: 1.5em; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.2em;}
        .markdown-content h3 { font-size: 1.25em; }
        .markdown-content h4 { font-size: 1.1em; }
        .markdown-content p { margin-bottom: 1em; }
        .markdown-content ul, .markdown-content ol { margin-left: 1.5em; margin-bottom: 1em; }
        .markdown-content li { margin-bottom: 0.3em; }
        .markdown-content code { background-color: #e2e8f0; padding: 0.2em 0.4em; border-radius: 3px; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace; font-size: 0.9em; color: #c026d3; }
        .markdown-content pre { background-color: #f1f5f9; padding: 1em; border-radius: 6px; overflow-x: auto; margin-bottom: 1em; }
        .markdown-content pre code { background-color: transparent; padding: 0; color: inherit; }
        .markdown-content blockquote { border-left: 4px solid #60a5fa; margin-left: 0; padding: 0.5em 1em; background-color: #eff6ff; color: #475569; margin-bottom: 1em; }
        .markdown-content strong { font-weight: 600; color: #0f172a; }
        .markdown-content em { font-style: italic; }
        .markdown-content hr { border: 0; height: 1px; background: #cbd5e1; margin: 2em 0; }
      `}</style>
    </Layout>
  );
}