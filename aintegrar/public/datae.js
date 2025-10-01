const materiales = [
  {
    categoria: "Construcción",
    subcategorias: [
      {
        nombre: "Cementos",
        items: [
          { nombre: "Cemento Portland", precio: 120, cantidad: 50 },
          { nombre: "Cemento Rápido", precio: 140, cantidad: 30 },
          { nombre: "Cemento Blanco", precio: 160, cantidad: 20 },
          { nombre: "Cemento de Albañilería", precio: 110, cantidad: 40 },
          { nombre: "Cemento de Alta Resistencia", precio: 170, cantidad: 25 },
          { nombre: "Cemento Expansivo", precio: 180, cantidad: 15 },
          { nombre: "Cemento de Puzolana", precio: 150, cantidad: 18 },
          { nombre: "Cemento Asfáltico", precio: 190, cantidad: 10 }
        ]
      },
      {
        nombre: "Ladrillos",
        items: [
          { nombre: "Ladrillo Hueco", precio: 20, cantidad: 500 },
          { nombre: "Ladrillo Macizo", precio: 35, cantidad: 300 },
          { nombre: "Ladrillo Refractario", precio: 50, cantidad: 100 },
          { nombre: "Ladrillo Común", precio: 25, cantidad: 400 },
          { nombre: "Ladrillo Retak", precio: 60, cantidad: 80 },
          { nombre: "Ladrillo Block", precio: 45, cantidad: 120 },
          { nombre: "Ladrillo Vista", precio: 55, cantidad: 90 },
          { nombre: "Ladrillo Cerámico", precio: 30, cantidad: 200 },
          { nombre: "Ladrillo Perforado", precio: 28, cantidad: 150 }
        ]
      },
      {
        nombre: "Áridos",
        items: [
          { nombre: "Arena Fina", precio: 10, cantidad: 1000 },
          { nombre: "Arena Gruesa", precio: 12, cantidad: 800 },
          { nombre: "Piedra Partida", precio: 18, cantidad: 600 },
          { nombre: "Ripio", precio: 15, cantidad: 700 },
          { nombre: "Granza", precio: 20, cantidad: 500 },
          { nombre: "Polvo de Piedra", precio: 14, cantidad: 400 },
          { nombre: "Tosca", precio: 8, cantidad: 900 },
          { nombre: "Bolos de Piedra", precio: 22, cantidad: 300 },
          { nombre: "Grava", precio: 16, cantidad: 350 }
        ]
      },
      {
        nombre: "Cal",
        items: [
          { nombre: "Cal Hidratada", precio: 22, cantidad: 150 },
          { nombre: "Cal Viva", precio: 25, cantidad: 100 },
          { nombre: "Cal Aérea", precio: 28, cantidad: 80 },
          { nombre: "Cal Dolomítica", precio: 30, cantidad: 60 },
          { nombre: "Cal Hidráulica", precio: 32, cantidad: 70 },
          { nombre: "Cal en Pasta", precio: 27, cantidad: 90 },
          { nombre: "Cal Agrícola", precio: 24, cantidad: 110 }
        ]
      },
      {
        nombre: "Yeso",
        items: [
          { nombre: "Yeso en Polvo", precio: 30, cantidad: 80 },
          { nombre: "Yeso Proyectable", precio: 35, cantidad: 60 },
          { nombre: "Yeso Controlado", precio: 38, cantidad: 50 },
          { nombre: "Yeso Rápido", precio: 40, cantidad: 40 },
          { nombre: "Yeso para Molduras", precio: 45, cantidad: 30 },
          { nombre: "Yeso para Terminación", precio: 42, cantidad: 35 },
          { nombre: "Yeso para Placas", precio: 37, cantidad: 45 }
        ]
      }
    ]
  },
  {
    categoria: "Metales",
    subcategorias: [
      {
        nombre: "Estructurales",
        items: [
          { nombre: "Hierro", precio: 200, cantidad: 100 },
          { nombre: "Aluminio", precio: 300, cantidad: 80 },
          { nombre: "Chapa Galvanizada", precio: 180, cantidad: 90 },
          { nombre: "Perfil C", precio: 220, cantidad: 60 },
          { nombre: "Perfil U", precio: 210, cantidad: 70 },
          { nombre: "Perfil IPN", precio: 250, cantidad: 50 },
          { nombre: "Perfil T", precio: 230, cantidad: 55 },
          { nombre: "Chapa Negra", precio: 170, cantidad: 85 }
        ]
      },
      {
        nombre: "Varillas",
        items: [
          { nombre: "Varilla de Hierro 8mm", precio: 50, cantidad: 200 },
          { nombre: "Varilla de Hierro 10mm", precio: 70, cantidad: 150 },
          { nombre: "Varilla de Hierro 12mm", precio: 90, cantidad: 100 },
          { nombre: "Varilla de Acero", precio: 95, cantidad: 80 },
          { nombre: "Varilla Corrugada", precio: 85, cantidad: 120 },
          { nombre: "Varilla Lisa", precio: 80, cantidad: 110 },
          { nombre: "Varilla Galvanizada", precio: 100, cantidad: 70 }
        ]
      }
    ]
  },
  {
    categoria: "Maderas",
    subcategorias: [
      {
        nombre: "Tablas",
        items: [
          { nombre: "Tabla de Pino", precio: 60, cantidad: 120 },
          { nombre: "Tabla de Eucalipto", precio: 75, cantidad: 100 },
          { nombre: "Tabla de Saligna", precio: 80, cantidad: 90 },
          { nombre: "Tabla de Cedro", precio: 120, cantidad: 60 },
          { nombre: "Tabla de Lapacho", precio: 150, cantidad: 40 },
          { nombre: "Tabla de Roble", precio: 130, cantidad: 50 },
          { nombre: "Tabla de Paraíso", precio: 95, cantidad: 70 }
        ]
      },
      {
        nombre: "Machimbre",
        items: [
          { nombre: "Machimbre de Pino", precio: 90, cantidad: 80 },
          { nombre: "Machimbre de Eucalipto", precio: 100, cantidad: 60 },
          { nombre: "Machimbre de Saligna", precio: 110, cantidad: 50 },
          { nombre: "Machimbre de Cedro", precio: 140, cantidad: 30 },
          { nombre: "Machimbre de MDF", precio: 70, cantidad: 100 },
          { nombre: "Machimbre de PVC", precio: 60, cantidad: 120 }
        ]
      }
    ]
  },
  {
    categoria: "Aislantes",
    subcategorias: [
      {
        nombre: "Térmicos",
        items: [
          { nombre: "Lana de Vidrio", precio: 110, cantidad: 60 },
          { nombre: "Poliestireno Expandido", precio: 95, cantidad: 70 },
          { nombre: "Espuma de Poliuretano", precio: 130, cantidad: 40 },
          { nombre: "Poliestireno Extrudado", precio: 120, cantidad: 50 },
          { nombre: "Fibra de Celulosa", precio: 105, cantidad: 60 },
          { nombre: "Panel Sandwich", precio: 200, cantidad: 30 },
          { nombre: "Aislante Reflectivo", precio: 90, cantidad: 80 }
        ]
      },
      {
        nombre: "Hidrófugos",
        items: [
          { nombre: "Membrana Asfáltica", precio: 130, cantidad: 50 },
          { nombre: "Membrana Líquida", precio: 140, cantidad: 40 },
          { nombre: "Pintura Impermeabilizante", precio: 120, cantidad: 60 },
          { nombre: "Cinta Selladora", precio: 60, cantidad: 100 },
          { nombre: "Aislante Hidrófugo", precio: 150, cantidad: 30 },
          { nombre: "Barrera de Vapor", precio: 80, cantidad: 90 }
        ]
      }
    ]
  },
  {
    categoria: "Pinturas y Revestimientos",
    subcategorias: [
      {
        nombre: "Pinturas",
        items: [
          { nombre: "Pintura Látex Interior", precio: 80, cantidad: 90 },
          { nombre: "Pintura Látex Exterior", precio: 85, cantidad: 70 },
          { nombre: "Esmalte Sintético", precio: 95, cantidad: 60 },
          { nombre: "Pintura Epoxi", precio: 120, cantidad: 40 },
          { nombre: "Pintura Antióxido", precio: 110, cantidad: 50 },
          { nombre: "Barniz Marino", precio: 130, cantidad: 30 },
          { nombre: "Pintura para Piscinas", precio: 140, cantidad: 20 }
        ]
      },
      {
        nombre: "Revestimientos",
        items: [
          { nombre: "Revoque Plástico", precio: 100, cantidad: 60 },
          { nombre: "Revestimiento Texturado", precio: 120, cantidad: 40 },
          { nombre: "Revestimiento Acrílico", precio: 110, cantidad: 50 },
          { nombre: "Revestimiento Cementicio", precio: 130, cantidad: 30 },
          { nombre: "Revestimiento Símil Piedra", precio: 150, cantidad: 20 },
          { nombre: "Revestimiento Símil Madera", precio: 140, cantidad: 25 }
        ]
      }
    ]
  },
  {
    categoria: "Plásticos y PVC",
    subcategorias: [
      {
        nombre: "Caños",
        items: [
          { nombre: "Caño PVC 110mm", precio: 55, cantidad: 100 },
          { nombre: "Caño PVC 50mm", precio: 35, cantidad: 120 },
          { nombre: "Caño PVC 32mm", precio: 25, cantidad: 140 },
          { nombre: "Caño Cloacal", precio: 60, cantidad: 80 },
          { nombre: "Caño Corrugado", precio: 45, cantidad: 90 },
          { nombre: "Caño Termofusión", precio: 70, cantidad: 60 },
          { nombre: "Caño Polietileno", precio: 65, cantidad: 70 }
        ]
      }
    ]
  },
  {
    categoria: "Electricidad",
    subcategorias: [
      {
        nombre: "Cables",
        items: [
          { nombre: "Cable Unipolar 2,5mm", precio: 40, cantidad: 200 },
          { nombre: "Cable Unipolar 4mm", precio: 60, cantidad: 150 },
          { nombre: "Cable Unipolar 6mm", precio: 80, cantidad: 100 },
          { nombre: "Cable Subterráneo", precio: 120, cantidad: 60 },
          { nombre: "Cable TPR", precio: 70, cantidad: 90 },
          { nombre: "Cable Sintenax", precio: 90, cantidad: 80 },
          { nombre: "Cable Mellizo", precio: 50, cantidad: 110 }
        ]
      },
      {
        nombre: "Accesorios",
        items: [
          { nombre: "Caja de Luz", precio: 15, cantidad: 300 },
          { nombre: "Toma Corriente", precio: 20, cantidad: 200 },
          { nombre: "Interruptor", precio: 18, cantidad: 250 },
          { nombre: "Porta Lámpara", precio: 12, cantidad: 180 },
          { nombre: "Disyuntor", precio: 150, cantidad: 40 },
          { nombre: "Llave Termomagnética", precio: 130, cantidad: 50 }
        ]
      }
    ]
  },
  {
    categoria: "Plomería",
    subcategorias: [
      {
        nombre: "Accesorios",
        items: [
          { nombre: "Codo PVC 90°", precio: 10, cantidad: 250 },
          { nombre: "Te PVC", precio: 12, cantidad: 200 },
          { nombre: "Curva PVC", precio: 14, cantidad: 180 },
          { nombre: "Reducción PVC", precio: 16, cantidad: 160 },
          { nombre: "Unión PVC", precio: 18, cantidad: 140 },
          { nombre: "Válvula Esférica", precio: 50, cantidad: 100 },
          { nombre: "Sifón", precio: 35, cantidad: 120 }
        ]
      }
    ]
  }
];
// ...total: más de 40 materiales...
