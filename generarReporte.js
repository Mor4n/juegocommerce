const fs = require('fs');
const path = require('path');
const pdf = require('pdf-creator-node');

// Configuración de la plantilla HTML
const plantillaPath = path.join(__dirname, 'plantilla.html');
const plantillaHTML = fs.readFileSync(plantillaPath, 'utf8');

// Función para generar el PDF
async function generarReporte(ventasTotales, ventasPorProducto, fechaDesde, fechaHasta) {
  // Preparar datos para la plantilla
  const data = {
    fechaDesde,
    fechaHasta,
    ventasTotales: ventasTotales.toFixed(2),
    ventas: ventasPorProducto.map((venta) => ({
      producto: venta.nombreProducto,
      cantidad: venta.cantidadVendida,
      total: venta.total.toFixed(2),
    })),
  };

  // Configuración del PDF
  const options = {
    format: 'A4',
    orientation: 'portrait',
    border: '10mm',
  };

  const documento = {
    html: plantillaHTML,
    data,
    path: './reporte_ventas.pdf',
    type: '',
  };

  try {
    // Generar el PDF
    const res = await pdf.create(documento, options);
    console.log('PDF generado:', res.filename);
    return res.filename;
  } catch (err) {
    console.error('Error generando el PDF:', err);
    throw err;
  }
}

module.exports = generarReporte;
