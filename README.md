# SEBAS PUNTO DE VENTA

Sistema de punto de venta gratuito, adaptable y con operación local offline-first.

## Identidad y separación de comercios
- La marca **SEBAS PUNTO DE VENTA** es fija y no se puede quitar ni modificar.
- Cada comerciante puede configurar el nombre, responsable, teléfono y moneda de su negocio.
- Cada negocio mantiene sus propios productos, clientes, ventas y configuración en un espacio local separado.

## Funciones implementadas en la primera etapa
- Panel de ventas del día, productos y alertas de inventario bajo.
- Catálogo con SKU, precio, costo, existencia y mínimo de stock; edición de productos sin perder sus movimientos históricos.
- Búsqueda de productos y control de existencias al cobrar.
- Registro de ventas en efectivo, tarjeta y transferencia; cálculo de cambio para efectivo.
- Clientes y proveedores, historial y búsqueda por folio/cliente.
- Registro de compras a proveedores con incremento automático de existencias.
- Ajustes de inventario (+/-) con motivo y bitácora de movimientos.
- Devoluciones parciales o completas por folio, con restitución de existencias y reportes netos que descuentan lo devuelto.
- Corte de caja con efectivo esperado, devoluciones y diferencia contra el efectivo contado.
- Reporte de ventas, utilidad estimada, unidades y formas de pago.
- Impresión del último ticket desde el historial.
- Exportación CSV de ventas e inventario.
- Respaldo JSON y restauración validada de respaldos.
- PWA instalable y caché offline básico.

## Probar localmente
Servir la carpeta raíz mediante un servidor HTTP estático (no abrir index.html como archivo local). Por ejemplo, con Node:

    npx serve .

Después abre la dirección local que indique el servidor. Para instalar como aplicación, usa un navegador compatible y la opción Instalar aplicación.

## Limitaciones importantes
- La persistencia actual usa el almacenamiento del navegador del dispositivo. Los datos no se sincronizan entre teléfonos ni se comparten automáticamente.
- Los datos locales no equivalen a un sistema multiusuario seguro. La autenticación, permisos por rol y aislamiento garantizado en servidor requieren backend y políticas de acceso; no se debe exponer información privada confiando solo en controles de interfaz.
- La impresión depende del navegador y de que se permitan ventanas emergentes.
- No se debe distribuir una APK hasta integrar el empaquetado Android y verificar compilación e instalación en dispositivo.

## Siguientes etapas
1. Backend con cuentas, roles y separación multi-tenant aplicada en servidor.
2. Compras, proveedores, entradas/salidas y ajustes auditables de inventario.
3. Devoluciones, cancelaciones, descuentos autorizados y cierre de caja.
4. Ticket personalizable y compatibilidad con impresoras térmicas.
5. Pruebas funcionales, empaquetado Android y publicación verificable.
