import React, { useState } from 'react';
import supabase from '../supabase/client';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; // Importar autoTable

function Reportes() {
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [ventasTotales, setVentasTotales] = useState(0);
  const [ventasPorProducto, setVentasPorProducto] = useState([]);
  const [productos, setProductos] = useState({});

  // Función para formatear las fechas a día/mes/año
  const formatearFecha = (fecha) => {
    const fechaObj = new Date(fecha);
    const dia = fechaObj.getDate().toString().padStart(2, '0');
    const mes = (fechaObj.getMonth() + 1).toString().padStart(2, '0');
    const anio = fechaObj.getFullYear();
    return `${dia}/${mes}/${anio}`;
  };

  // Función para realizar la consulta de reportes
  const fetchReportes = async () => {
    if (fechaDesde && fechaHasta) {
      // Asegurarse de que las fechas incluyan todo el día
      const fechaDesdeConHora = new Date(fechaDesde);
      fechaDesdeConHora.setHours(0, 0, 0, 0); // Inicia desde las 00:00:00
  
      const fechaHastaConHora = new Date(fechaHasta);
      fechaHastaConHora.setHours(23, 59, 59, 999); // Termina a las 23:59:59
  
      // Obtener los pedidos en el rango de fechas ajustado
      const { data: pedidos, error: pedidosError } = await supabase
        .from('pedidos')
        .select('id, total, creado_en')
        .gte('creado_en', fechaDesdeConHora.toISOString()) // Usar fecha con hora
        .lte('creado_en', fechaHastaConHora.toISOString()); // Usar fecha con hora
  
      if (pedidosError) {
        console.error('Error al obtener pedidos:', pedidosError);
      } else {
        // Obtener las ventas totales
        const totalVentas = pedidos.reduce((acc, pedido) => acc + pedido.total, 0);
        setVentasTotales(totalVentas);
      }
  
      // Obtener los detalles de pedidos
      const { data: detallePedidos, error: detalleError } = await supabase
        .from('detalle_pedidos')
        .select('producto_id, cantidad, precio_unitario, pedido_id');
  
      if (detalleError) {
        console.error('Error al obtener detalles de pedidos:', detalleError);
      } else {
        // Filtrar los detalles de pedidos que pertenecen a los pedidos obtenidos
        const pedidosIds = pedidos.map((pedido) => pedido.id);
        const detallesFiltrados = detallePedidos.filter((detalle) =>
          pedidosIds.includes(detalle.pedido_id)
        );
  
        // Agrupar las ventas por producto
        const ventasProducto = detallesFiltrados.reduce((acc, detalle) => {
          if (!acc[detalle.producto_id]) {
            acc[detalle.producto_id] = { cantidad: 0, ingresos: 0 };
          }
          acc[detalle.producto_id].cantidad += detalle.cantidad;
          acc[detalle.producto_id].ingresos += detalle.cantidad * detalle.precio_unitario;
          return acc;
        }, {});
  
        // Obtener los nombres de los productos
        const { data: productosData, error: productosError } = await supabase
          .from('productos')
          .select('id, nombre');
  
        if (productosError) {
          console.error('Error al obtener productos:', productosError);
        } else {
          // Crear un objeto con los nombres de los productos
          const productosMap = productosData.reduce((acc, producto) => {
            acc[producto.id] = producto.nombre;
            return acc;
          }, {});
  
          setProductos(productosMap);
  
          // Convertir el objeto de ventasProducto a un array para poder renderizar
          setVentasPorProducto(Object.entries(ventasProducto));
        }
      }
    }
  };
  

  // Función para exportar la tabla completa a PDF
  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Reporte de Ventas', 14, 20);

    // Ventas Totales
    doc.setFontSize(14);
    doc.text(`Ventas Totales: $${ventasTotales.toFixed(2)}`, 14, 30);

    // Agregar las fechas en el formato día/mes/año
    doc.text(`Fecha desde: ${formatearFecha(fechaDesde)} hasta: ${formatearFecha(fechaHasta)}`, 14, 40);

    // Crear la tabla de ventas por producto
    const columnas = ['Producto', 'Cantidad Vendida', 'Ingresos Generados'];
    const filas = ventasPorProducto.map(([productoId, datos]) => [
      productos[productoId] || 'Desconocido',
      datos.cantidad,
      `$${datos.ingresos.toFixed(2)}`
    ]);

    // Agregar la tabla al PDF usando autoTable
    doc.autoTable({
      head: [columnas],
      body: filas,
      startY: 50, // Posición de inicio de la tabla
    });

    // Descargar el archivo PDF
    doc.save('reporte_completo_ventas.pdf');
  };

  return (
    <div>
      <h2>Reportes de Ventas</h2>
      
      {/* Formularios para seleccionar fechas */}
      <div className="mb-3">
        <label htmlFor="fechaDesde" className="form-label">Desde</label>
        <input
          type="date"
          className="form-control"
          id="fechaDesde"
          value={fechaDesde}
          onChange={(e) => setFechaDesde(e.target.value)}
        />
      </div>
      
      <div className="mb-3">
        <label htmlFor="fechaHasta" className="form-label">Hasta</label>
        <input
          type="date"
          className="form-control"
          id="fechaHasta"
          value={fechaHasta}
          onChange={(e) => setFechaHasta(e.target.value)}
        />
      </div>

      {/* Botón para obtener los reportes */}
      <button className="btn btn-primary" onClick={fetchReportes}>
        Generar Reporte
      </button>

      {/* Botón para exportar el reporte a PDF */}
      <button className="btn btn-secondary ms-3" onClick={exportarPDF}>
        Exportar a PDF
      </button>

      {/* Ventas Totales */}
      <h3 className="mt-4">Ventas Totales</h3>
      <p>Total de ventas: ${ventasTotales.toFixed(2)}</p>

      {/* Tabla de Ventas por Producto */}
      <h3 className="mt-4">Ventas por Producto</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad Vendida</th>
            <th>Ingresos Generados</th>
          </tr>
        </thead>
        <tbody>
          {ventasPorProducto.length > 0 ? (
            ventasPorProducto.map(([productoId, datos], index) => (
              <tr key={index}>
                <td>{productos[productoId] || 'Desconocido'}</td> {/* Mostrar el nombre del producto */}
                <td>{datos.cantidad}</td>
                <td>${datos.ingresos.toFixed(2)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No hay datos disponibles para el rango de fechas seleccionado.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Reportes;
