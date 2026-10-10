'use server'

import { db } from "@/db";
import { boards } from "@/db/schema";
import { eq } from "drizzle-orm";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

// Detecta el tipo real de imagen leyendo su firma binaria (magic bytes),
// en lugar de confiar en el MIME declarado por el cliente (falsificable).
async function detectImageMime(file: File): Promise<string | null> {
    const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());

    // JPEG: FF D8 FF
    if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg';
    // PNG: 89 50 4E 47
    if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return 'image/png';
    // WEBP: "RIFF" .... "WEBP"
    if (
        bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
        bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
    ) return 'image/webp';

    return null;
}

export async function uploadImageAction(formData: FormData) {
    const file = formData.get('file') as File | null;
    const boardId = formData.get('boardId') as string | null;

    if (!file || !boardId) {
        return { error: "Faltan datos requeridos." };
    }

    if (file.size > MAX_FILE_SIZE) {
        return { error: "La imagen supera el límite de 1MB." };
    }

    const detectedType = await detectImageMime(file);
    if (!detectedType || !ALLOWED_MIME_TYPES.includes(detectedType)) {
        return { error: "Formato no permitido. Solo se aceptan JPG, PNG y WEBP." };
    }

    try {
        const boardInfo = await db.query.boards.findFirst({
            where: eq(boards.id, boardId),
            with: { user: true }
        });

        if (!boardInfo || !boardInfo.user) {
            return { error: "Tablero no encontrado." };
        }



        // Subida a ImageKit mediante Fetch directo para soportar el Edge Runtime
        const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
        if (!privateKey) {
            throw new Error("Falta configuración de ImageKit.");
        }

        const authHeader = `Basic ${btoa(privateKey + ":")}`;

        const uploadData = new FormData();
        uploadData.append("file", file);
        uploadData.append("fileName", `${boardId}-${Date.now()}-${file.name}`);
        uploadData.append("folder", "/pidemelo-ideas");
        uploadData.append("useUniqueFileName", "true");

        const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
            method: "POST",
            headers: {
                "Authorization": authHeader,
            },
            body: uploadData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.message || "Error en la subida a ImageKit");
        }

        const uploadResponse = await response.json();

        return { success: true, url: uploadResponse.url };

    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.error("Error al subir imagen:", errorMsg);
        return { error: "Hubo un error inesperado al procesar la imagen." };
    }
}
