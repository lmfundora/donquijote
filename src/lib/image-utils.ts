/**
 * Convierte una imagen a formato WebP
 * @param file - Archivo de imagen original
 * @param quality - Calidad de compresión (0-1), default 0.8
 * @returns Promise<File> - Archivo convertido a WebP
 */
export async function convertToWebP(file: File, quality: number = 0.8): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const webpFile = new File(
                [blob],
                file.name.replace(/\.[^/.]+$/, '') + '.webp',
                { type: 'image/webp' }
              );
              resolve(webpFile);
            } else {
              reject(new Error('Error al convertir la imagen'));
            }
          },
          'image/webp',
          quality
        );
      } else {
        reject(new Error('Error al obtener el contexto del canvas'));
      }
    };

    img.onerror = () => reject(new Error('Error al cargar la imagen'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Redimensiona una imagen a un ancho máximo manteniendo el aspect ratio
 * @param file - Archivo de imagen original
 * @param maxWidth - Ancho máximo en pixels
 * @returns Promise<File> - Archivo redimensionado
 */
export async function resizeImage(file: File, maxWidth: number = 1200): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      const scale = maxWidth / img.width;
      const newWidth = maxWidth;
      const newHeight = img.height * scale;
      
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      if (ctx) {
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const resizedFile = new File(
                [blob],
                file.name,
                { type: file.type }
              );
              resolve(resizedFile);
            } else {
              reject(new Error('Error al redimensionar la imagen'));
            }
          },
          file.type,
          0.9
        );
      } else {
        reject(new Error('Error al obtener el contexto del canvas'));
      }
    };

    img.onerror = () => reject(new Error('Error al cargar la imagen'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Convierte y optimiza una imagen para web
 * @param file - Archivo de imagen original
 * @param options - Opciones de conversión
 * @returns Promise<File> - Archivo optimizado
 */
export async function optimizeImage(
  file: File,
  options: {
    maxWidth?: number;
    quality?: number;
    format?: 'webp' | 'original';
  } = {}
): Promise<File> {
  const { maxWidth = 1200, quality = 0.8, format = 'webp' } = options;

  // Primero redimensionar si es necesario
  const resized = await resizeImage(file, maxWidth);

  // Luego convertir a WebP si se solicita
  if (format === 'webp') {
    return await convertToWebP(resized, quality);
  }

  return resized;
}
