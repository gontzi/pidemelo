// Guard: este proyecto se instala EXCLUSIVAMENTE con pnpm.
//
// npm no entiende el layout de node_modules de pnpm (junctions) + pnpm-lock.yaml
// y, además de no resolverlo, puede borrar el contenido de paquetes como `next`
// antes de fallar, dejando el árbol roto. Este script aborta la instalación con
// un mensaje claro cuando NO se está usando pnpm.

const userAgent = process.env.npm_config_user_agent ?? "";

if (!userAgent.startsWith("pnpm/")) {
    const used = userAgent.split(" ")[0] || "desconocido";
    console.error(
        `\nEste proyecto usa pnpm. Se detectó "${used}".\n` +
            `Ejecuta:  pnpm install\n` +
            `(npm rompería node_modules; no uses \`npm install\`.)\n`,
    );
    process.exit(1);
}
