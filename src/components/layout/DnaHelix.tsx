import type { CSSProperties } from "react";

const COLUMNS = 64;
/** Sarmalın genişlik boyunca kaç tur attığı */
const TWISTS = 3;
/** Bir turun süresi (saniye) */
const PERIOD = 9;

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/**
 * Somon DNA'ya gönderme yapan dönen çift sarmal. Yalnızca CSS ile çalışır (globals.css → .helix).
 * Her sütunun başlangıç açısı satır içi stil olarak yazılır; hareket azaltma tercihinde
 * animasyon kapanır ve sarmal bu ilk karesinde durağan görünür.
 */
export function DnaHelix({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`helix ${className}`} style={{ "--helix-period": `${PERIOD}s` } as Vars}>
      {Array.from({ length: COLUMNS }, (_, i) => {
        const turn = ((i / COLUMNS) * TWISTS) % 1;
        const angle = turn * 2 * Math.PI;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const delay = -turn * PERIOD;
        const dot = (c: number, z: number, d: number): Vars => ({
          "--c": c.toFixed(3),
          "--s": (0.825 + 0.375 * z).toFixed(3),
          "--o": (0.6 + 0.4 * z).toFixed(3),
          animationDelay: `${d.toFixed(2)}s`,
        });
        return (
          <span key={i} className="helix-col">
            <span className="helix-rung" style={{ "--r": Math.abs(cos).toFixed(3), animationDelay: `${delay.toFixed(2)}s` } as Vars} />
            <span className="helix-dot text-blush-300" style={dot(-cos, sin, delay)} />
            <span className="helix-dot text-plum-300" style={dot(cos, -sin, delay - PERIOD / 2)} />
          </span>
        );
      })}
    </div>
  );
}
