/**
 * Paquete para los modelos de dominio de la aplicación.
 */
package com.market.admin.model;

/**
 * Enumeración que representa las distintas categorías a las que puede pertenecer un producto.
 */
public enum Category {
    /** Categoría para alimentos y comestibles. */
    comida,
    
    /** Categoría para productos de limpieza e higiene personal. */
    aseo,
    
    /** Categoría para gastos o productos relacionados con la movilización. */
    transporte,
    
    /** Categoría para artículos generales de mantenimiento o decoración de la casa. */
    hogar,
    
    /** Categoría por defecto para artículos no clasificados. */
    otros
}
