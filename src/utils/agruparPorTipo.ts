export const agruparPorTipo = (desafios: any[]) => {
  return desafios.reduce((acc, desafio) => {
    const tipo = desafio.tpDesafio;

    if (!acc[tipo]) {
      acc[tipo] = [];
    }

    acc[tipo].push(desafio);

    return acc;
  }, {} as Record<string, any[]>);
};