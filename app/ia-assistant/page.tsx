import ChatInterface from '@/components/chat/ChatInterface';
import { DashboardHeader } from '@/components/dashboard/DashboardComponents';

export default function AiAssistantPage() {
  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <DashboardHeader 
        title="Asistente Inteligente" 
        subtitle="Consulta el estado de tu negocio, obtén recomendaciones y aclara dudas sobre el inventario."
      />
      <ChatInterface />
    </div>
  );
}
