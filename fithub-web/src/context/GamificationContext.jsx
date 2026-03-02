// src/context/GamificationContext.jsx
import { createContext, useState } from "react";
import { TrophyToast } from "../components/common/TrophyToast";
import trophySound from "../sounds/trophy.mp3";

// 1. Criamos o contexto
export const GamificationContext = createContext();

// 2. Criamos o Provider (o componente que vai abraçar sua aplicação)
export function GamificationProvider({ children }) {
  const [showTrophy, setShowTrophy] = useState(false);
  const [conquista, setConquista] = useState(null);

  // Função global que qualquer tela pode chamar
  const ganharConquista = (dadosConquista) => {

    setConquista(dadosConquista);
    setShowTrophy(true);
    try {
      const audio = new Audio(trophySound);
      audio.volume = 0.5; 
      audio.play().catch(err => {
        // Navegadores às vezes bloqueiam áudio se o usuário não tiver clicado em nada na tela
        console.warn("Reprodução automática de áudio bloqueada pelo navegador.", err);
      });
    } catch (error) {
      console.error("Erro ao tentar tocar o som da conquista:", error);
    }
  };

  return (
    <GamificationContext.Provider value={{ ganharConquista }}>
      {children}
      
      {/* O Toast fica aqui, flutuando sobre toda a aplicação! */}
      <TrophyToast 
        show={showTrophy} 
        onClose={() => setShowTrophy(false)} 
        conquista={conquista} 
      />
    </GamificationContext.Provider>
  );
}