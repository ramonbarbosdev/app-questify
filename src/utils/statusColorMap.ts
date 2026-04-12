import { Colors } from '../theme/colors';
import { StatusJogo } from '../types/StatusJogo';

export const statusColorMap: Record<StatusJogo, string> = {
  pendente: Colors.gray,

  correto: Colors.accent,

  perto: Colors.yellow,

  // 🔢 número
  alto: '#f97316',   // laranja (alto demais)
  baixo: '#3b82f6',  // azul (baixo demais)

  errado: Colors.error,

  // usado quando finaliza sem sucesso
  fechado: '#6b7280',
};