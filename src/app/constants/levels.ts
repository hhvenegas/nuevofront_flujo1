import { Level } from './level';

export const LEVELS: Level[] = [
  { 
    "id": 1,
    "level" : "Novato",
    "points": "0-10188", 
    "image":"/assets/img/Novato.png",
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
    "points": "10189-11188", 
    "image":"/assets/img/Platino.png",
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
    "points": "11189-13188", 
    "image":"/assets/img/Experto.png",
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
    "points": "13189-14188", 
    "image":"/assets/img/Leyenda.png",
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