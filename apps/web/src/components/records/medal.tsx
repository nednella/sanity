type Metal = {
  base: string;
  dark: string;
  ink: string;
  light: string;
  rim: string;
};

const metals: Record<number, Metal> = {
  1: { base: "#f2c94c", dark: "#9a6c12", ink: "#6b4708", light: "#fff6cf", rim: "#e0a92b" },
  2: { base: "#d6dde6", dark: "#7c8794", ink: "#4a5463", light: "#ffffff", rim: "#b7c0cb" },
  3: { base: "#cd8341", dark: "#7a3f16", ink: "#5a2f10", light: "#f7d2a8", rim: "#b06a2c" }
};

type MedalProps = {
  position: number;
};

export function Medal({ position }: Readonly<MedalProps>) {
  const metal = metals[position];

  return (
    <span className="flex w-6 shrink-0 justify-center">
      {metal ? (
        <span
          className="flex size-5 items-center justify-center rounded-full text-[0.625rem] font-bold"
          style={{
            background: `conic-gradient(from 210deg, ${metal.dark}, ${metal.light}, ${metal.base}, ${metal.dark}, ${metal.light}, ${metal.base}, ${metal.dark})`,
            boxShadow: `inset 0 0 0 1px ${metal.rim}`,
            color: metal.ink
          }}
        >
          {position}
        </span>
      ) : (
        <span className="text-xs text-base-content/40 tabular-nums">{position}</span>
      )}
    </span>
  );
}
