import { Level } from './level';

export const LEVELS: Level[] = [
  { 
    "id": 1,
    "level" : "Novato",
    "points": "0 a 12000 puntos", 
    "image":"/assets/img/users/Novato_c.png",
    "url":"novato",
    "beneficios":[
        "Conductor designado en caso de ebriedad",
        "0% de deducible en caso de robo",
        "Acelerador de pérdida total* En vez del 70%, con nosotros el 50%"
    ]
  },
  { 
    "id": 2,
    "level" : "Platino",
    "points": "12001 a 18000 puntos",
    "image":"/assets/img/users/Platino_c.png",
    "url":"platino",
    "beneficios":[
        "Conductor designado en caso de ebriedad",
        "0% de deducible en caso de robo",
        "Acelerador de pérdida total* En vez del 70%, con nosotros el 50%",
        "Pérdida de Identidad"
    ]
  },
  { 
    "id": 3,
    "level" : "Experto",
    "points": "18001 a 24001 puntos", 
    "image":"/assets/img/users/Experto_c.png",
    "url":"experto",
    "beneficios":[
        "Conductor designado en caso de ebriedad",
        "0% de deducible en caso de robo",
        "Acelerador de pérdida total* En vez del 70%, con nosotros el 50%",
        "Pérdida de Identidad",
        "Pérdida de Documentos Oficiales"
    ]
  },
  { 
    "id": 4,
    "level" : "Leyenda",
    "points": "+24001 puntos", 
    "image":"/assets/img/users/Leyenda_c.png",
    "url":"leyenda", 
    "beneficios":[
        "Conductor designado en caso de ebriedad",
        "0% de deducible en caso de robo",
        "Acelerador de pérdida total* En vez del 70%, con nosotros el 50%",
        "Pérdida de Identidad",
        "Pérdida de Documentos Oficiales",
        "Robo de Accesorios (Llaves, Control, etc)",
        "0% de Deducible y daños materiales por pérdidas parciales."
    ]
  }
]