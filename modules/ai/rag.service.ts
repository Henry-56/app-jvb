import { GoogleGenerativeAI } from "@google/generative-ai";
import { inventoryService } from "../inventory/services";
import { modelDiscoveryService } from "./model-discovery";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const aiService = {
  async askInventoryQuestion(question: string) {
    try {
      // 1. Get Context (RAG)
      const stats = await inventoryService.getDashboardStats();
      const criticalProducts = stats.products.filter(p => p.stock <= p.minStock);
      const now = new Date();
      const next30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      const expiringSoon = stats.products
        .filter(p => p.expirationDate && new Date(p.expirationDate) <= next30Days)
        .sort((a, b) => new Date(a.expirationDate!).getTime() - new Date(b.expirationDate!).getTime());

      const context = `
      Eres el asistente inteligente "AbarrotesAI". Tu objetivo es ayudar al dueño de la tienda con datos precisos y accionables analizando el inventario y las VENTAS de los últimos 30 días.
      
      RESUMEN GENERAL:
      - Total productos únicos: ${stats.totalProducts}
      - Valor del inventario: $${stats.totalInventoryValue.toFixed(2)}
      
      STOCK CRÍTICO (Reponer ya):
      ${criticalProducts.map(p => `- **${p.name}**: Quedan ${p.stock} (Reponer ${Math.ceil(p.weeklyDemand * 2)} und. para 2 semanas)`).join('\n')}
      
      PRÓXIMOS A VENCER (Próximos 30 días):
      ${expiringSoon.length > 0 
        ? expiringSoon.map(p => `- **${p.name}**: Vence el ${new Date(p.expirationDate!).toLocaleDateString('es-ES')} (Stock: ${p.stock})`).join('\n')
        : 'No hay productos próximos a vencer en los siguientes 30 días.'}

      TENDENCIAS DE VENTAS (Últimos 30 días):
      - **Más Vendidos**: ${stats.topSellers.map(p => `${p.name} (${p.totalSold} vendidos)`).join(', ')}
      - **Baja Rotación**: ${stats.lowRotation.map(p => `${p.name} (${p.totalSold} vendidos)`).join(', ')}
      
      REGLAS DE RESPUESTA:
      1. ANALIZA TENDENCIAS: Si un producto se vende mucho y queda poco, resáltalo como prioridad máxima.
      2. RECOMENDACIÓN DE COMPRA: Para "Cuánto reponer", sugiere el doble de la demanda semanal para tener 2 semanas de stock.
      3. SÉ BREVE Y DIRECTO. Usa negritas y listas.
      4. TONO: Experto en gestión de inventarios.
      `;

      // 2. Discover Best Active Models
      const prioritizedModels = await modelDiscoveryService.getPrioritizedModels();
      
      let lastError = null;

      // 3. Cascade/Waterfall Attempt
      for (const modelId of prioritizedModels) {
        try {
          console.log(`AI Attempting: ${modelId}`);
          const model = genAI.getGenerativeModel({ model: modelId });
          const result = await model.generateContent([context, question]);
          const response = await result.response;
          
          return {
            answer: response.text(),
            modelId: modelId
          };
        } catch (error: any) {
          lastError = error;
          console.warn(`Model ${modelId} failed:`, error.status || error.message);
          continue;
        }
      }

      throw lastError || new Error("No available models responded correctly.");
    } catch (error) {
      console.error("AI Cascade Failure:", error);
      return { 
        answer: "Lo siento, todos los modelos de IA están saturados en este momento. Por favor intenta de nuevo en unos segundos.",
        modelId: "Error/Overloaded"
      };
    }
  }
};
