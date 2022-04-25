export const DNI_REGEX = new RegExp("^\\d{8}$");
export const NUMERO_REGEX = new RegExp("^\\d*$");
export const EDAD_REGEX = new RegExp("^\\d{1,3}$");
export const CORREO_REGEX = new RegExp("^[^@]+@[^@]+\.[a-zA-Z]{2,}$");
export const TELEFONO_REGEX = new RegExp("^\\d{9}$");
export const PESO_REGEX = new RegExp("^((?!0)\\d{1,3}|0|\\.\\d{1,2})($|\\.$|\\.\\d{1,2}$)");
export const TALLA_REGEX = new RegExp("^((?!0)\\d|0|\\.\\d{1,2})($|\\.$|\\.\\d{1,2}$)");
export const TEXTO_REGEX = new RegExp("^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$");
