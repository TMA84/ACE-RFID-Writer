'use strict';

let materialTemps = {};

const BRANDS = [
  '3DJake','3DXTech','Amolen','Anycubic','Atomic Filament','Bambu Lab','Cailab',
  'ColorFabb','Creality','Das Filament','Devil Design','Dremel','Elegoo',
  'Eryone','eSUN','Extrudr','Fiberlogy','Filamentum','Fillamentum',
  'Flashforge','FormFutura','Geeetech','Hatchbox','ICE Filaments','Inland',
  'Kimya','Kingroon','MakerBot','MatterHackers','NinjaTek','Overture',
  'Polymaker','PolyTerra','PrimaCreator','Proto-pasta','Prusament',
  'Raise3D','Real Filament','Recreus','Rigid.ink','Sakata3D','Spectrum',
  'Sunlu','Ultimaker','Verbatim','Voxelab','XYZprinting','ZIRO','Zortrax',
];

const BRAND_TEMPS = {
  '3DJake': {
    PLA:    { extruderMin: 195, extruderMax: 220, bedMin: 50,  bedMax: 65  },
    'PLA+': { extruderMin: 200, extruderMax: 230, bedMin: 50,  bedMax: 65  },
    PETG:   { extruderMin: 230, extruderMax: 250, bedMin: 70,  bedMax: 85  },
    ABS:    { extruderMin: 235, extruderMax: 260, bedMin: 85,  bedMax: 110 },
    TPU:    { extruderMin: 220, extruderMax: 235, bedMin: 30,  bedMax: 50  },
  },
  '3DXTech': {
    PLA:    { extruderMin: 190, extruderMax: 220, bedMin: 50,  bedMax: 60  },
    PETG:   { extruderMin: 230, extruderMax: 255, bedMin: 70,  bedMax: 85  },
    ABS:    { extruderMin: 240, extruderMax: 260, bedMin: 90,  bedMax: 110 },
    PA:     { extruderMin: 260, extruderMax: 280, bedMin: 75,  bedMax: 90  },
    'PA-CF':{ extruderMin: 270, extruderMax: 300, bedMin: 80,  bedMax: 100 },
    PC:     { extruderMin: 260, extruderMax: 285, bedMin: 90,  bedMax: 120 },
  },
  'Amolen': {
    PLA:    { extruderMin: 190, extruderMax: 220, bedMin: 25,  bedMax: 60  },
    SILK:   { extruderMin: 210, extruderMax: 235, bedMin: 40,  bedMax: 60  },
    TPU:    { extruderMin: 215, extruderMax: 230, bedMin: 20,  bedMax: 40  },
  },
  'Anycubic': {
    PLA:    { extruderMin: 190, extruderMax: 220, bedMin: 25,  bedMax: 60  },
    PETG:   { extruderMin: 230, extruderMax: 250, bedMin: 70,  bedMax: 85  },
    ABS:    { extruderMin: 230, extruderMax: 260, bedMin: 80,  bedMax: 110 },
    ASA:    { extruderMin: 240, extruderMax: 260, bedMin: 90,  bedMax: 110 },
    TPU:    { extruderMin: 215, extruderMax: 235, bedMin: 20,  bedMax: 40  },
  },
  'Atomic Filament': {
    PLA:    { extruderMin: 185, extruderMax: 220, bedMin: 45,  bedMax: 60  },
    PETG:   { extruderMin: 230, extruderMax: 250, bedMin: 65,  bedMax: 85  },
    ABS:    { extruderMin: 235, extruderMax: 260, bedMin: 90,  bedMax: 110 },
    ASA:    { extruderMin: 240, extruderMax: 260, bedMin: 90,  bedMax: 110 },
  },
  'Bambu Lab': {
    PLA:    { extruderMin: 210, extruderMax: 230, bedMin: 35,  bedMax: 45  },
    'PLA+': { extruderMin: 215, extruderMax: 235, bedMin: 35,  bedMax: 45  },
    PETG:   { extruderMin: 240, extruderMax: 270, bedMin: 70,  bedMax: 80  },
    ABS:    { extruderMin: 260, extruderMax: 270, bedMin: 90,  bedMax: 110 },
    ASA:    { extruderMin: 260, extruderMax: 270, bedMin: 90,  bedMax: 110 },
    PA:     { extruderMin: 270, extruderMax: 280, bedMin: 70,  bedMax: 80  },
    'PA-CF':{ extruderMin: 280, extruderMax: 300, bedMin: 80,  bedMax: 90  },
    TPU:    { extruderMin: 220, extruderMax: 240, bedMin: 20,  bedMax: 40  },
  },
  'Cailab': {
    PLA:    { extruderMin: 190, extruderMax: 220, bedMin: 25,  bedMax: 60  },
    'PLA+': { extruderMin: 200, extruderMax: 230, bedMin: 30,  bedMax: 60  },
    PETG:   { extruderMin: 230, extruderMax: 250, bedMin: 70,  bedMax: 85  },
    ABS:    { extruderMin: 235, extruderMax: 255, bedMin: 85,  bedMax: 110 },
    SILK:   { extruderMin: 210, extruderMax: 230, bedMin: 40,  bedMax: 60  },
    TPU:    { extruderMin: 215, extruderMax: 235, bedMin: 20,  bedMax: 40  },
  },
  'ColorFabb': {
    PLA:    { extruderMin: 195, extruderMax: 220, bedMin: 50,  bedMax: 60  },
    'PLA+': { extruderMin: 195, extruderMax: 225, bedMin: 50,  bedMax: 65  },
    PETG:   { extruderMin: 230, extruderMax: 250, bedMin: 70,  bedMax: 85  },
    ABS:    { extruderMin: 240, extruderMax: 265, bedMin: 85,  bedMax: 110 },
    PA:     { extruderMin: 260, extruderMax: 280, bedMin: 70,  bedMax: 90  },
    PC:     { extruderMin: 260, extruderMax: 280, bedMin: 100, bedMax: 120 },
  },
  'Creality': {
    PLA:    { extruderMin: 190, extruderMax: 220, bedMin: 45,  bedMax: 60  },
    PETG:   { extruderMin: 230, extruderMax: 250, bedMin: 70,  bedMax: 85  },
    ABS:    { extruderMin: 230, extruderMax: 250, bedMin: 80,  bedMax: 110 },
    TPU:    { extruderMin: 210, extruderMax: 230, bedMin: 20,  bedMax: 40  },
  },
  'Das Filament': {
    PLA:    { extruderMin: 195, extruderMax: 220, bedMin: 15,  bedMax: 60  },
    PETG:   { extruderMin: 225, extruderMax: 250, bedMin: 50,  bedMax: 80  },
  },
  'Devil Design': {
    PLA:    { extruderMin: 190, extruderMax: 220, bedMin: 50,  bedMax: 60  },
    'PLA+': { extruderMin: 195, extruderMax: 225, bedMin: 50,  bedMax: 65  },
    PETG:   { extruderMin: 230, extruderMax: 250, bedMin: 70,  bedMax: 85  },
    ABS:    { extruderMin: 235, extruderMax: 255, bedMin: 85,  bedMax: 110 },
    ASA:    { extruderMin: 240, extruderMax: 260, bedMin: 90,  bedMax: 110 },
    SILK:   { extruderMin: 195, extruderMax: 215, bedMin: 40,  bedMax: 60  },
    TPU:    { extruderMin: 215, extruderMax: 235, bedMin: 20,  bedMax: 50  },
  },
  'Dremel': {
    PLA:    { extruderMin: 195, extruderMax: 230, bedMin: 25,  bedMax: 60  },
    PETG:   { extruderMin: 230, extruderMax: 250, bedMin: 70,  bedMax: 85  },
    ABS:    { extruderMin: 230, extruderMax: 260, bedMin: 80,  bedMax: 110 },
    PA:     { extruderMin: 255, extruderMax: 275, bedMin: 70,  bedMax: 90  },
  },
  'Elegoo': {
    PLA:    { extruderMin: 190, extruderMax: 220, bedMin: 25,  bedMax: 60  },
    PETG:   { extruderMin: 230, extruderMax: 250, bedMin: 70,  bedMax: 85  },
    ABS:    { extruderMin: 230, extruderMax: 250, bedMin: 80,  bedMax: 110 },
    ASA:    { extruderMin: 240, extruderMax: 260, bedMin: 90,  bedMax: 110 },
    TPU:    { extruderMin: 215, extruderMax: 235, bedMin: 20,  bedMax: 40  },
  },
  'Eryone': {
    PLA:    { extruderMin: 190, extruderMax: 220, bedMin: 25,  bedMax: 60  },
    PETG:   { extruderMin: 230, extruderMax: 250, bedMin: 70,  bedMax: 85  },
    ABS:    { extruderMin: 230, extruderMax: 250, bedMin: 80,  bedMax: 110 },
    SILK:   { extruderMin: 210, extruderMax: 230, bedMin: 35,  bedMax: 55  },
    TPU:    { extruderMin: 210, extruderMax: 230, bedMin: 20,  bedMax: 40  },
  },
  'eSUN': {
    PLA:    { extruderMin: 190, extruderMax: 220, bedMin: 25,  bedMax: 60  },
    'PLA+': { extruderMin: 200, extruderMax: 230, bedMin: 25,  bedMax: 60  },
    PETG:   { extruderMin: 230, extruderMax: 250, bedMin: 70,  bedMax: 85  },
    ABS:    { extruderMin: 230, extruderMax: 250, bedMin: 80,  bedMax: 110 },
    ASA:    { extruderMin: 240, extruderMax: 260, bedMin: 90,  bedMax: 110 },
    TPU:    { extruderMin: 220, extruderMax: 235, bedMin: 30,  bedMax: 40  },
    SILK:   { extruderMin: 210, extruderMax: 230, bedMin: 40,  bedMax: 60  },
    PA:     { extruderMin: 250, extruderMax: 270, bedMin: 70,  bedMax: 90  },
    HIPS:   { extruderMin: 230, extruderMax: 250, bedMin: 90,  bedMax: 110 },
    PVA:    { extruderMin: 185, extruderMax: 200, bedMin: 45,  bedMax: 60  },
  },
  'Extrudr': {
    PLA:    { extruderMin: 200, extruderMax: 220, bedMin: 20,  bedMax: 60  },
    'PLA+': { extruderMin: 205, extruderMax: 225, bedMin: 20,  bedMax: 60  },
    PETG:   { extruderMin: 235, extruderMax: 250, bedMin: 60,  bedMax: 80  },
    ABS:    { extruderMin: 230, extruderMax: 260, bedMin: 80,  bedMax: 100 },
    ASA:    { extruderMin: 240, extruderMax: 260, bedMin: 90,  bedMax: 110 },
    TPU:    { extruderMin: 210, extruderMax: 230, bedMin: 0,   bedMax: 40  },
    PA:     { extruderMin: 255, extruderMax: 275, bedMin: 70,  bedMax: 90  },
    PC:     { extruderMin: 265, extruderMax: 285, bedMin: 100, bedMax: 120 },
  },
  'Fiberlogy': {
    PLA:    { extruderMin: 200, extruderMax: 230, bedMin: 50,  bedMax: 70  },
    'PLA+': { extruderMin: 205, extruderMax: 235, bedMin: 50,  bedMax: 70  },
    PETG:   { extruderMin: 230, extruderMax: 250, bedMin: 70,  bedMax: 90  },
    ABS:    { extruderMin: 240, extruderMax: 260, bedMin: 90,  bedMax: 110 },
    ASA:    { extruderMin: 240, extruderMax: 265, bedMin: 90,  bedMax: 110 },
    PA:     { extruderMin: 255, extruderMax: 275, bedMin: 65,  bedMax: 90  },
    TPU:    { extruderMin: 215, extruderMax: 235, bedMin: 20,  bedMax: 50  },
  },
  'Filamentum': {
    PLA:    { extruderMin: 200, extruderMax: 220, bedMin: 50,  bedMax: 60  },
    PETG:   { extruderMin: 230, extruderMax: 250, bedMin: 70,  bedMax: 85  },
    ABS:    { extruderMin: 250, extruderMax: 270, bedMin: 100, bedMax: 110 },
    ASA:    { extruderMin: 250, extruderMax: 270, bedMin: 100, bedMax: 110 },
    TPU:    { extruderMin: 220, extruderMax: 235, bedMin: 30,  bedMax: 50  },
  },
  'Fillamentum': {
    PLA:    { extruderMin: 200, extruderMax: 220, bedMin: 50,  bedMax: 60  },
    'PLA+': { extruderMin: 200, extruderMax: 225, bedMin: 50,  bedMax: 65  },
    PETG:   { extruderMin: 230, extruderMax: 250, bedMin: 70,  bedMax: 85  },
    ABS:    { extruderMin: 250, extruderMax: 270, bedMin: 100, bedMax: 110 },
    ASA:    { extruderMin: 250, extruderMax: 270, bedMin: 100, bedMax: 110 },
    PA:     { extruderMin: 250, extruderMax: 270, bedMin: 65,  bedMax: 85  },
    TPU:    { extruderMin: 220, extruderMax: 235, bedMin: 30,  bedMax: 50  },
  },
  'Flashforge': {
    PLA:    { extruderMin: 190, extruderMax: 220, bedMin: 45,  bedMax: 55  },
    PETG:   { extruderMin: 230, extruderMax: 250, bedMin: 70,  bedMax: 80  },
    ABS:    { extruderMin: 230, extruderMax: 240, bedMin: 100, bedMax: 110 },
    ASA:    { extruderMin: 240, extruderMax: 260, bedMin: 90,  bedMax: 110 },
    TPU:    { extruderMin: 210, extruderMax: 230, bedMin: 20,  bedMax: 40  },
  },
  'FormFutura': {
    PLA:    { extruderMin: 195, extruderMax: 220, bedMin: 25,  bedMax: 60  },
    'PLA+': { extruderMin: 200, extruderMax: 225, bedMin: 25,  bedMax: 60  },
    PETG:   { extruderMin: 225, extruderMax: 245, bedMin: 60,  bedMax: 80  },
    ABS:    { extruderMin: 235, extruderMax: 255, bedMin: 85,  bedMax: 100 },
    ASA:    { extruderMin: 240, extruderMax: 255, bedMin: 90,  bedMax: 110 },
    PA:     { extruderMin: 255, extruderMax: 280, bedMin: 70,  bedMax: 90  },
    PC:     { extruderMin: 260, extruderMax: 285, bedMin: 100, bedMax: 120 },
    TPU:    { extruderMin: 215, extruderMax: 235, bedMin: 20,  bedMax: 45  },
    HIPS:   { extruderMin: 230, extruderMax: 250, bedMin: 90,  bedMax: 110 },
    PVA:    { extruderMin: 185, extruderMax: 210, bedMin: 45,  bedMax: 60  },
  },
  'Geeetech': {
    PLA:    { extruderMin: 190, extruderMax: 220, bedMin: 25,  bedMax: 60  },
    PETG:   { extruderMin: 230, extruderMax: 250, bedMin: 70,  bedMax: 85  },
    ABS:    { extruderMin: 230, extruderMax: 260, bedMin: 80,  bedMax: 110 },
    SILK:   { extruderMin: 210, extruderMax: 230, bedMin: 35,  bedMax: 55  },
    TPU:    { extruderMin: 210, extruderMax: 230, bedMin: 20,  bedMax: 40  },
  },
  'Hatchbox': {
    PLA:    { extruderMin: 180, extruderMax: 220, bedMin: 40,  bedMax: 60  },
    PETG:   { extruderMin: 230, extruderMax: 250, bedMin: 60,  bedMax: 80  },
    ABS:    { extruderMin: 210, extruderMax: 240, bedMin: 80,  bedMax: 110 },
    TPU:    { extruderMin: 210, extruderMax: 230, bedMin: 20,  bedMax: 40  },
    SILK:   { extruderMin: 200, extruderMax: 225, bedMin: 40,  bedMax: 55  },
  },
  'ICE Filaments': {
    PLA:    { extruderMin: 190, extruderMax: 220, bedMin: 50,  bedMax: 65  },
    PETG:   { extruderMin: 230, extruderMax: 250, bedMin: 70,  bedMax: 85  },
    ABS:    { extruderMin: 230, extruderMax: 260, bedMin: 90,  bedMax: 110 },
    ASA:    { extruderMin: 240, extruderMax: 260, bedMin: 90,  bedMax: 110 },
  },
  'Inland': {
    PLA:    { extruderMin: 185, extruderMax: 215, bedMin: 45,  bedMax: 60  },
    'PLA+': { extruderMin: 195, extruderMax: 220, bedMin: 45,  bedMax: 60  },
    PETG:   { extruderMin: 230, extruderMax: 250, bedMin: 65,  bedMax: 85  },
    ABS:    { extruderMin: 225, extruderMax: 255, bedMin: 85,  bedMax: 110 },
    TPU:    { extruderMin: 210, extruderMax: 230, bedMin: 20,  bedMax: 40  },
    SILK:   { extruderMin: 200, extruderMax: 225, bedMin: 40,  bedMax: 55  },
  },
  'Kimya': {
    PLA:    { extruderMin: 185, extruderMax: 215, bedMin: 20,  bedMax: 55  },
    'PLA+': { extruderMin: 185, extruderMax: 215, bedMin: 20,  bedMax: 55  },
    ABS:    { extruderMin: 240, extruderMax: 255, bedMin: 80,  bedMax: 110 },
    PA:     { extruderMin: 260, extruderMax: 280, bedMin: 80,  bedMax: 100 },
    PC:     { extruderMin: 265, extruderMax: 285, bedMin: 100, bedMax: 130 },
    TPU:    { extruderMin: 220, extruderMax: 240, bedMin: 20,  bedMax: 50  },
  },
  'Kingroon': {
    PLA:    { extruderMin: 190, extruderMax: 220, bedMin: 25,  bedMax: 60  },
    PETG:   { extruderMin: 230, extruderMax: 250, bedMin: 70,  bedMax: 85  },
    ABS:    { extruderMin: 230, extruderMax: 250, bedMin: 80,  bedMax: 110 },
    TPU:    { extruderMin: 210, extruderMax: 230, bedMin: 20,  bedMax: 40  },
  },
  'MakerBot': {
    PLA:    { extruderMin: 200, extruderMax: 220, bedMin: 45,  bedMax: 60  },
    'PLA+': { extruderMin: 205, extruderMax: 225, bedMin: 50,  bedMax: 65  },
    ABS:    { extruderMin: 250, extruderMax: 270, bedMin: 100, bedMax: 110 },
    'PA-CF':{ extruderMin: 280, extruderMax: 285, bedMin: 95,  bedMax: 100 },
    PC:     { extruderMin: 275, extruderMax: 285, bedMin: 95,  bedMax: 105 },
  },
  'MatterHackers': {
    PLA:    { extruderMin: 185, extruderMax: 220, bedMin: 25,  bedMax: 60  },
    'PLA+': { extruderMin: 195, extruderMax: 220, bedMin: 25,  bedMax: 60  },
    PETG:   { extruderMin: 230, extruderMax: 250, bedMin: 65,  bedMax: 80  },
    ABS:    { extruderMin: 240, extruderMax: 260, bedMin: 90,  bedMax: 110 },
    ASA:    { extruderMin: 240, extruderMax: 260, bedMin: 90,  bedMax: 110 },
    PA:     { extruderMin: 255, extruderMax: 275, bedMin: 70,  bedMax: 90  },
    'PA-CF':{ extruderMin: 265, extruderMax: 285, bedMin: 75,  bedMax: 95  },
    PC:     { extruderMin: 260, extruderMax: 290, bedMin: 100, bedMax: 120 },
  },
  'NinjaTek': {
    TPU:    { extruderMin: 225, extruderMax: 240, bedMin: 20,  bedMax: 45  },
    'PLA+': { extruderMin: 235, extruderMax: 245, bedMin: 40,  bedMax: 60  },
  },
  'Overture': {
    PLA:    { extruderMin: 190, extruderMax: 220, bedMin: 50,  bedMax: 60  },
    'PLA+': { extruderMin: 195, extruderMax: 225, bedMin: 50,  bedMax: 65  },
    PETG:   { extruderMin: 230, extruderMax: 250, bedMin: 70,  bedMax: 80  },
    ABS:    { extruderMin: 230, extruderMax: 260, bedMin: 85,  bedMax: 110 },
    ASA:    { extruderMin: 240, extruderMax: 260, bedMin: 90,  bedMax: 110 },
    TPU:    { extruderMin: 220, extruderMax: 230, bedMin: 0,   bedMax: 40  },
    SILK:   { extruderMin: 200, extruderMax: 220, bedMin: 40,  bedMax: 55  },
  },
  'Polymaker': {
    PLA:    { extruderMin: 190, extruderMax: 230, bedMin: 25,  bedMax: 60  },
    'PLA+': { extruderMin: 200, extruderMax: 235, bedMin: 25,  bedMax: 60  },
    PETG:   { extruderMin: 230, extruderMax: 250, bedMin: 70,  bedMax: 85  },
    ASA:    { extruderMin: 240, extruderMax: 260, bedMin: 90,  bedMax: 110 },
    PC:     { extruderMin: 250, extruderMax: 280, bedMin: 90,  bedMax: 120 },
    TPU:    { extruderMin: 215, extruderMax: 235, bedMin: 25,  bedMax: 60  },
    PA:     { extruderMin: 250, extruderMax: 270, bedMin: 70,  bedMax: 90  },
    'PA-CF':{ extruderMin: 260, extruderMax: 280, bedMin: 70,  bedMax: 90  },
  },
  'PolyTerra': {
    PLA:    { extruderMin: 190, extruderMax: 230, bedMin: 25,  bedMax: 60  },
    'PLA+': { extruderMin: 200, extruderMax: 230, bedMin: 25,  bedMax: 60  },
  },
  'PrimaCreator': {
    PLA:    { extruderMin: 195, extruderMax: 225, bedMin: 45,  bedMax: 65  },
    'PLA+': { extruderMin: 200, extruderMax: 230, bedMin: 50,  bedMax: 65  },
    PETG:   { extruderMin: 230, extruderMax: 250, bedMin: 65,  bedMax: 85  },
    ABS:    { extruderMin: 230, extruderMax: 255, bedMin: 85,  bedMax: 110 },
    ASA:    { extruderMin: 240, extruderMax: 260, bedMin: 90,  bedMax: 110 },
    TPU:    { extruderMin: 215, extruderMax: 235, bedMin: 20,  bedMax: 45  },
  },
  'Proto-pasta': {
    PLA:    { extruderMin: 195, extruderMax: 230, bedMin: 55,  bedMax: 70  },
    'PA-CF':{ extruderMin: 265, extruderMax: 285, bedMin: 60,  bedMax: 80  },
    PC:     { extruderMin: 270, extruderMax: 295, bedMin: 90,  bedMax: 110 },
  },
  'Prusament': {
    PLA:    { extruderMin: 210, extruderMax: 230, bedMin: 50,  bedMax: 60  },
    PETG:   { extruderMin: 240, extruderMax: 260, bedMin: 80,  bedMax: 90  },
    ABS:    { extruderMin: 250, extruderMax: 265, bedMin: 100, bedMax: 110 },
    ASA:    { extruderMin: 250, extruderMax: 265, bedMin: 100, bedMax: 110 },
    PA:     { extruderMin: 260, extruderMax: 280, bedMin: 70,  bedMax: 90  },
    PC:     { extruderMin: 275, extruderMax: 295, bedMin: 100, bedMax: 115 },
    TPU:    { extruderMin: 220, extruderMax: 235, bedMin: 30,  bedMax: 50  },
  },
  'Raise3D': {
    PLA:    { extruderMin: 200, extruderMax: 220, bedMin: 55,  bedMax: 65  },
    'PLA+': { extruderMin: 195, extruderMax: 220, bedMin: 50,  bedMax: 65  },
    PETG:   { extruderMin: 230, extruderMax: 255, bedMin: 70,  bedMax: 85  },
    ABS:    { extruderMin: 235, extruderMax: 260, bedMin: 90,  bedMax: 110 },
    ASA:    { extruderMin: 240, extruderMax: 260, bedMin: 90,  bedMax: 110 },
    PA:     { extruderMin: 260, extruderMax: 280, bedMin: 75,  bedMax: 90  },
    'PA-CF':{ extruderMin: 270, extruderMax: 300, bedMin: 80,  bedMax: 100 },
    PC:     { extruderMin: 270, extruderMax: 295, bedMin: 100, bedMax: 120 },
    TPU:    { extruderMin: 215, extruderMax: 235, bedMin: 20,  bedMax: 45  },
  },
  'Real Filament': {
    PLA:    { extruderMin: 190, extruderMax: 220, bedMin: 50,  bedMax: 60  },
    'PLA+': { extruderMin: 195, extruderMax: 225, bedMin: 50,  bedMax: 65  },
    PETG:   { extruderMin: 230, extruderMax: 250, bedMin: 70,  bedMax: 85  },
    ABS:    { extruderMin: 230, extruderMax: 255, bedMin: 85,  bedMax: 110 },
    ASA:    { extruderMin: 240, extruderMax: 260, bedMin: 90,  bedMax: 110 },
    TPU:    { extruderMin: 215, extruderMax: 235, bedMin: 20,  bedMax: 45  },
  },
  'Recreus': {
    TPU:    { extruderMin: 215, extruderMax: 235, bedMin: 20,  bedMax: 45  },
    PLA:    { extruderMin: 195, extruderMax: 220, bedMin: 45,  bedMax: 60  },
  },
  'Rigid.ink': {
    PLA:    { extruderMin: 190, extruderMax: 220, bedMin: 45,  bedMax: 60  },
    'PLA+': { extruderMin: 195, extruderMax: 225, bedMin: 50,  bedMax: 65  },
    PETG:   { extruderMin: 230, extruderMax: 250, bedMin: 65,  bedMax: 80  },
    ABS:    { extruderMin: 230, extruderMax: 260, bedMin: 85,  bedMax: 110 },
    ASA:    { extruderMin: 240, extruderMax: 260, bedMin: 85,  bedMax: 110 },
    PA:     { extruderMin: 255, extruderMax: 275, bedMin: 65,  bedMax: 85  },
    TPU:    { extruderMin: 215, extruderMax: 235, bedMin: 20,  bedMax: 45  },
  },
  'Sakata3D': {
    PLA:    { extruderMin: 195, extruderMax: 225, bedMin: 45,  bedMax: 65  },
    'PLA+': { extruderMin: 200, extruderMax: 230, bedMin: 50,  bedMax: 65  },
    PETG:   { extruderMin: 230, extruderMax: 250, bedMin: 70,  bedMax: 85  },
    ABS:    { extruderMin: 230, extruderMax: 255, bedMin: 85,  bedMax: 110 },
    ASA:    { extruderMin: 240, extruderMax: 260, bedMin: 90,  bedMax: 110 },
    TPU:    { extruderMin: 215, extruderMax: 235, bedMin: 20,  bedMax: 45  },
  },
  'Spectrum': {
    PLA:    { extruderMin: 190, extruderMax: 215, bedMin: 50,  bedMax: 60  },
    'PLA+': { extruderMin: 195, extruderMax: 225, bedMin: 50,  bedMax: 65  },
    PETG:   { extruderMin: 230, extruderMax: 250, bedMin: 70,  bedMax: 85  },
    ABS:    { extruderMin: 240, extruderMax: 260, bedMin: 90,  bedMax: 110 },
    ASA:    { extruderMin: 240, extruderMax: 260, bedMin: 90,  bedMax: 110 },
    HIPS:   { extruderMin: 220, extruderMax: 250, bedMin: 85,  bedMax: 100 },
    TPU:    { extruderMin: 215, extruderMax: 235, bedMin: 20,  bedMax: 50  },
    SILK:   { extruderMin: 200, extruderMax: 220, bedMin: 40,  bedMax: 60  },
  },
  'Sunlu': {
    PLA:    { extruderMin: 190, extruderMax: 220, bedMin: 25,  bedMax: 60  },
    'PLA+': { extruderMin: 195, extruderMax: 225, bedMin: 25,  bedMax: 60  },
    PETG:   { extruderMin: 230, extruderMax: 260, bedMin: 70,  bedMax: 80  },
    ABS:    { extruderMin: 230, extruderMax: 260, bedMin: 80,  bedMax: 110 },
    ASA:    { extruderMin: 240, extruderMax: 260, bedMin: 90,  bedMax: 110 },
    TPU:    { extruderMin: 210, extruderMax: 230, bedMin: 20,  bedMax: 40  },
    SILK:   { extruderMin: 210, extruderMax: 230, bedMin: 35,  bedMax: 55  },
  },
  'Ultimaker': {
    PLA:    { extruderMin: 200, extruderMax: 220, bedMin: 60,  bedMax: 60  },
    'PLA+': { extruderMin: 200, extruderMax: 220, bedMin: 60,  bedMax: 60  },
    PETG:   { extruderMin: 235, extruderMax: 255, bedMin: 75,  bedMax: 90  },
    ABS:    { extruderMin: 245, extruderMax: 265, bedMin: 90,  bedMax: 110 },
    ASA:    { extruderMin: 245, extruderMax: 265, bedMin: 90,  bedMax: 110 },
    PA:     { extruderMin: 250, extruderMax: 270, bedMin: 70,  bedMax: 90  },
    'PA-CF':{ extruderMin: 260, extruderMax: 290, bedMin: 80,  bedMax: 90  },
    PC:     { extruderMin: 260, extruderMax: 280, bedMin: 107, bedMax: 107 },
    TPU:    { extruderMin: 225, extruderMax: 250, bedMin: 20,  bedMax: 60  },
    PVA:    { extruderMin: 195, extruderMax: 215, bedMin: 60,  bedMax: 60  },
    HIPS:   { extruderMin: 235, extruderMax: 255, bedMin: 90,  bedMax: 110 },
  },
  'Verbatim': {
    PLA:    { extruderMin: 195, extruderMax: 225, bedMin: 45,  bedMax: 60  },
    'PLA+': { extruderMin: 200, extruderMax: 230, bedMin: 50,  bedMax: 65  },
    PETG:   { extruderMin: 230, extruderMax: 250, bedMin: 70,  bedMax: 85  },
    ABS:    { extruderMin: 235, extruderMax: 255, bedMin: 85,  bedMax: 110 },
    ASA:    { extruderMin: 240, extruderMax: 260, bedMin: 85,  bedMax: 110 },
    PA:     { extruderMin: 250, extruderMax: 275, bedMin: 65,  bedMax: 85  },
  },
  'Voxelab': {
    PLA:    { extruderMin: 190, extruderMax: 220, bedMin: 45,  bedMax: 55  },
    'PLA+': { extruderMin: 195, extruderMax: 225, bedMin: 45,  bedMax: 60  },
    PETG:   { extruderMin: 230, extruderMax: 250, bedMin: 70,  bedMax: 80  },
    ABS:    { extruderMin: 230, extruderMax: 245, bedMin: 100, bedMax: 110 },
    TPU:    { extruderMin: 210, extruderMax: 230, bedMin: 20,  bedMax: 40  },
  },
  'XYZprinting': {
    PLA:    { extruderMin: 195, extruderMax: 220, bedMin: 45,  bedMax: 60  },
    PETG:   { extruderMin: 230, extruderMax: 250, bedMin: 70,  bedMax: 85  },
    ABS:    { extruderMin: 230, extruderMax: 255, bedMin: 85,  bedMax: 110 },
    TPU:    { extruderMin: 210, extruderMax: 230, bedMin: 20,  bedMax: 40  },
  },
  'ZIRO': {
    PLA:    { extruderMin: 190, extruderMax: 220, bedMin: 25,  bedMax: 60  },
    SILK:   { extruderMin: 210, extruderMax: 230, bedMin: 35,  bedMax: 55  },
    PETG:   { extruderMin: 230, extruderMax: 250, bedMin: 70,  bedMax: 85  },
    ABS:    { extruderMin: 230, extruderMax: 255, bedMin: 80,  bedMax: 110 },
    TPU:    { extruderMin: 210, extruderMax: 230, bedMin: 20,  bedMax: 40  },
  },
  'Zortrax': {
    PLA:    { extruderMin: 200, extruderMax: 220, bedMin: 60,  bedMax: 70  },
    'PLA+': { extruderMin: 200, extruderMax: 225, bedMin: 60,  bedMax: 70  },
    PETG:   { extruderMin: 235, extruderMax: 255, bedMin: 75,  bedMax: 85  },
    ABS:    { extruderMin: 250, extruderMax: 270, bedMin: 100, bedMax: 110 },
    ASA:    { extruderMin: 250, extruderMax: 270, bedMin: 100, bedMax: 110 },
    PA:     { extruderMin: 260, extruderMax: 285, bedMin: 70,  bedMax: 85  },
    PC:     { extruderMin: 270, extruderMax: 290, bedMin: 105, bedMax: 120 },
  },
};

// --- DOM ---
const readerDot   = document.getElementById('readerDot');
const readerLabel = document.getElementById('readerLabel');
const tagDot      = document.getElementById('tagDot');
const tagLabel    = document.getElementById('tagLabel');
const btnRead     = document.getElementById('btnRead');
const btnWrite    = document.getElementById('btnWrite');
const toast       = document.getElementById('toast');

const fields = {
  brand:       document.getElementById('brand'),
  material:    document.getElementById('material'),
  sku:         document.getElementById('sku'),
  weight:      document.getElementById('weight'),
  colorPicker: document.getElementById('colorPicker'),
  colorHex:    document.getElementById('colorHex'),
  extruderMin: document.getElementById('extruderMin'),
  extruderMax: document.getElementById('extruderMax'),
  bedMin:      document.getElementById('bedMin'),
  bedMax:      document.getElementById('bedMax'),
};

// --- Toast ---
let toastTimer = null;
function showToast(msg, type = 'success') {
  toast.textContent = msg;
  toast.className   = `toast ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.className = 'toast hidden'; }, 3000);
}

// --- Status ---
let readerReady = false;
let tagPresent  = false;

function setReaderStatus(connected, name = '') {
  readerReady           = connected;
  readerDot.className   = 'dot' + (connected ? ' connected' : '');
  readerLabel.textContent = connected ? name : 'Reader nicht verbunden';
  updateButtons();
}

function setTagStatus(present, uid = '') {
  tagPresent            = present;
  tagDot.className      = 'dot' + (present ? ' tag-active' : '');
  tagLabel.textContent  = present ? `Tag: ${uid}` : 'Kein Tag';
  updateButtons();
}

function updateButtons() {
  const canAct  = readerReady && tagPresent;
  btnRead.disabled  = !canAct;
  btnWrite.disabled = !canAct;
}

// --- Color ---
function hexToRgb(hex) {
  const m = hex.replace('#', '').match(/.{2}/g);
  if (!m || m.length < 3) return null;
  return { r: parseInt(m[0], 16), g: parseInt(m[1], 16), b: parseInt(m[2], 16) };
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

fields.colorPicker.addEventListener('input', () => {
  fields.colorHex.value = fields.colorPicker.value.toUpperCase();
});

fields.colorHex.addEventListener('input', () => {
  const val = fields.colorHex.value.trim();
  const hex = val.startsWith('#') ? val : '#' + val;
  if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
    fields.colorPicker.value = hex.toLowerCase();
  }
});

// --- Brand autocomplete ---
(function () {
  const input    = fields.brand;
  const dropdown = document.getElementById('brandDropdown');
  let activeIdx  = -1;

  function show(items) {
    dropdown.innerHTML = '';
    activeIdx = -1;
    if (!items.length) { dropdown.classList.add('hidden'); return; }
    items.forEach((name, i) => {
      const li = document.createElement('li');
      li.textContent = name;
      li.addEventListener('mousedown', e => { e.preventDefault(); select(name); });
      dropdown.appendChild(li);
    });
    dropdown.classList.remove('hidden');
  }

  function hide() { dropdown.classList.add('hidden'); activeIdx = -1; }

  function select(name) { input.value = name; hide(); applyTemps(); }

  function setActive(idx) {
    const items = dropdown.querySelectorAll('li');
    items.forEach(li => li.classList.remove('active'));
    if (idx >= 0 && idx < items.length) {
      items[idx].classList.add('active');
      items[idx].scrollIntoView({ block: 'nearest' });
      activeIdx = idx;
    }
  }

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase();
    if (!q) { show(BRANDS); return; }
    show(BRANDS.filter(b => b.toLowerCase().includes(q)));
  });

  input.addEventListener('focus', () => {
    const q = input.value.toLowerCase();
    show(q ? BRANDS.filter(b => b.toLowerCase().includes(q)) : BRANDS);
  });

  input.addEventListener('blur', () => setTimeout(hide, 150));

  input.addEventListener('keydown', e => {
    const items = dropdown.querySelectorAll('li');
    if (e.key === 'ArrowDown')  { e.preventDefault(); setActive(Math.min(activeIdx + 1, items.length - 1)); }
    if (e.key === 'ArrowUp')    { e.preventDefault(); setActive(Math.max(activeIdx - 1, 0)); }
    if (e.key === 'Enter' && activeIdx >= 0) { e.preventDefault(); select(items[activeIdx].textContent); }
    if (e.key === 'Escape')     { hide(); }
  });
})();

// --- Temperature auto-fill (brand-specific overrides material defaults) ---
function applyTemps() {
  const mat = fields.material.value;
  if (!mat) return;
  const brand = fields.brand.value.trim();
  const temps = (BRAND_TEMPS[brand] && BRAND_TEMPS[brand][mat]) || materialTemps[mat];
  if (!temps) return;
  fields.extruderMin.value = temps.extruderMin;
  fields.extruderMax.value = temps.extruderMax;
  fields.bedMin.value      = temps.bedMin;
  fields.bedMax.value      = temps.bedMax;
}

fields.material.addEventListener('change', applyTemps);

// --- Form → payload ---
function getPayload() {
  const rgb = hexToRgb(fields.colorHex.value || fields.colorPicker.value) ?? { r: 255, g: 255, b: 255 };
  return {
    sku:         fields.sku.value.trim(),
    brand:       fields.brand.value.trim(),
    material:    fields.material.value,
    colorR:      rgb.r,
    colorG:      rgb.g,
    colorB:      rgb.b,
    extruderMin: parseInt(fields.extruderMin.value) || 190,
    extruderMax: parseInt(fields.extruderMax.value) || 230,
    bedMin:      parseInt(fields.bedMin.value)      || 50,
    bedMax:      parseInt(fields.bedMax.value)      || 60,
    weightG:     parseInt(fields.weight.value)      || 1000,
  };
}

// --- Clear form ---
function clearForm() {
  fields.brand.value       = '';
  fields.sku.value         = '';
  fields.material.value    = '';
  fields.weight.value      = '1000';
  fields.extruderMin.value = '';
  fields.extruderMax.value = '';
  fields.bedMin.value      = '';
  fields.bedMax.value      = '';
  fields.colorPicker.value = '#ffffff';
  fields.colorHex.value    = '';
}

// --- Populate form ---
function populateForm(data) {
  fields.brand.value       = data.brand       ?? '';
  fields.sku.value         = data.sku         ?? '';
  fields.extruderMin.value = data.extruderMin ?? 190;
  fields.extruderMax.value = data.extruderMax ?? 230;
  fields.bedMin.value      = data.bedMin      ?? 50;
  fields.bedMax.value      = data.bedMax      ?? 60;

  if (data.material) {
    const opt = [...fields.material.options].find(o => o.value === data.material);
    if (opt) fields.material.value = data.material;
  }

  const hex = rgbToHex(data.colorR ?? 255, data.colorG ?? 255, data.colorB ?? 255);
  fields.colorPicker.value = hex;
  fields.colorHex.value    = hex.toUpperCase();

  if (data.weightG) {
    const opt = [...fields.weight.options].find(o => o.value === String(data.weightG));
    if (opt) fields.weight.value = String(data.weightG);
  }
}

// --- IPC event handler ---
function handleEvent(msg) {
  switch (msg.type) {
    case 'reader_connected':    setReaderStatus(true, msg.name);      break;
    case 'reader_disconnected': setReaderStatus(false);                break;
    case 'tag_detected':        setTagStatus(true, msg.uid);           break;
    case 'tag_removed':         setTagStatus(false); clearForm();       break;
    case 'tag_data':            populateForm(msg.fields); showToast('Tag gelesen'); break;
    case 'write_success':       showToast('Tag erfolgreich beschrieben'); break;
    case 'error':               showToast(msg.message, 'error');       break;
  }
}

// --- Buttons ---
btnRead.addEventListener('click', () => {
  window.electronNFC.send('read');
});

btnWrite.addEventListener('click', () => {
  const payload = getPayload();
  if (!payload.material) {
    showToast('Bitte Material wählen', 'error');
    return;
  }
  window.electronNFC.send('write', { fields: payload });
});

// --- Init ---
async function init() {
  try {
    const conf  = await window.electronNFC.getConfig();
    materialTemps = conf.materialTemps ?? {};
  } catch (e) {
    console.warn('Config nicht geladen', e);
  }
  window.electronNFC.onEvent(handleEvent);
}

init();
