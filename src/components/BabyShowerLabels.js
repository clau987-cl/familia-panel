import React from 'react'

const labels = Array.from({ length: 10 })

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Quicksand:wght@400;600&display=swap');

  .bs-body {
    background: #f0e8f5;
    font-family: 'Quicksand', sans-serif;
    padding: 20px;
    min-height: 100vh;
  }
  .bs-title {
    text-align: center;
    color: #a56cbf;
    font-family: 'Dancing Script', cursive;
    font-size: 28px;
    margin-bottom: 6px;
  }
  .bs-instrucciones {
    text-align: center;
    color: #888;
    font-size: 12px;
    margin-bottom: 20px;
  }
  .bs-instrucciones span {
    background: #e8d5f5;
    border-radius: 10px;
    padding: 3px 10px;
    margin: 0 4px;
    display: inline-block;
    margin-bottom: 4px;
  }
  .bs-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 18px 30px;
    max-width: 680px;
    margin: 0 auto;
  }
  .bs-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .bs-etiqueta {
    width: 240px;
    position: relative;
    border: 1.5px dashed #c89fd8;
    border-radius: 4px;
    overflow: visible;
  }
  .bs-top {
    width: 100%;
    height: 72px;
    background: linear-gradient(135deg, #f3d9fa 0%, #e8c5f5 60%, #d4a8e8 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-bottom: 2px solid #a56cbf;
    clip-path: polygon(0 0, 100% 0, 100% 85%, 90% 100%, 10% 100%);
    padding-bottom: 10px;
  }
  .bs-bot {
    width: 100%;
    height: 72px;
    background: linear-gradient(225deg, #f3d9fa 0%, #e8c5f5 60%, #d4a8e8 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-top: 2px solid #a56cbf;
    clip-path: polygon(10% 0, 90% 0, 100% 15%, 100% 100%, 0 100%);
    padding-top: 10px;
    transform: rotate(180deg);
  }
  .bs-nombre {
    font-family: 'Dancing Script', cursive;
    font-size: 26px;
    color: #6b2fa0;
    line-height: 1;
    text-shadow: 0 1px 2px rgba(255,255,255,0.6);
  }
  .bs-subtitulo {
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 1.5px;
    color: #9a4dbf;
    text-transform: uppercase;
    margin-top: 2px;
  }
  .bs-estrellitas {
    font-size: 11px;
    color: #c070e0;
    margin-top: 1px;
  }
  .bs-doblez {
    text-align: center;
    font-size: 8px;
    color: #b07cc8;
    letter-spacing: 1px;
    padding: 1px 0;
    background: #f0e0fa;
    border-top: 1px solid #d4a8e8;
    border-bottom: 1px solid #d4a8e8;
  }
  .bs-deco {
    position: absolute;
    font-size: 14px;
    opacity: 0.35;
    pointer-events: none;
  }
  .bs-cut {
    font-size: 9px;
    color: #b8a0c8;
    margin-top: 3px;
  }
  .bs-btn {
    display: block;
    margin: 24px auto 0;
    padding: 10px 32px;
    background: #a56cbf;
    color: white;
    border: none;
    border-radius: 25px;
    font-family: 'Quicksand', sans-serif;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    letter-spacing: 0.5px;
    box-shadow: 0 3px 10px rgba(165,108,191,0.4);
  }
  @media print {
    .bs-body { background: white; padding: 8mm; }
    .bs-title, .bs-instrucciones, .bs-btn { display: none !important; }
    .bs-cut { display: none; }
  }
`

export default function BabyShowerLabels() {
  return (
    <div className="bs-body">
      <style>{styles}</style>

      <h1 className="bs-title">✨ Baby Shower Bastian ✨</h1>
      <p className="bs-instrucciones">
        <span>✂ Recorta por la línea punteada</span>
        <span>📌 Dobla por la línea del medio</span>
        <span>🍬 Pega en el palito</span>
      </p>

      <div className="bs-grid">
        {labels.map((_, i) => (
          <div key={i} className="bs-wrap">
            <div className="bs-etiqueta">
              <span className="bs-deco" style={{ top: 6, left: 8 }}>🌸</span>
              <span className="bs-deco" style={{ top: 6, right: 8 }}>⭐</span>
              <span className="bs-deco" style={{ bottom: 6, left: 8, transform: 'rotate(180deg)' }}>🌸</span>
              <span className="bs-deco" style={{ bottom: 6, right: 8, transform: 'rotate(180deg)' }}>⭐</span>

              <div className="bs-top">
                <div className="bs-estrellitas">✦ ✦ ✦</div>
                <div className="bs-nombre">Bastian</div>
                <div className="bs-subtitulo">Baby Shower</div>
              </div>

              <div className="bs-doblez">── ── DOBLAR AQUÍ ── ──</div>

              <div className="bs-bot">
                <div className="bs-estrellitas">✦ ✦ ✦</div>
                <div className="bs-nombre">Bastian</div>
                <div className="bs-subtitulo">Baby Shower</div>
              </div>
            </div>
            <span className="bs-cut">✂ cortar por línea punteada</span>
          </div>
        ))}
      </div>

      <button className="bs-btn" onClick={() => window.print()}>
        🖨️ Imprimir / Guardar PDF
      </button>
    </div>
  )
}
