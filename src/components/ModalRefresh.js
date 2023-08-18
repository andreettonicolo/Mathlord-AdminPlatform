import React from "react";

const ModalRefresh = ({ onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <p>Account aggiornato con successo!</p>
        <p>Aggiorna la pagina per vedere le modifiche.</p>
        <button onClick={onClose}>Chiudi</button>
      </div>
    </div>
  );
};

export default ModalRefresh;
