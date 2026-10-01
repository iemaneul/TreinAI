import initSqlJs, { type Database } from 'sql.js';
import sqlWasmUrl from 'sql.js/dist/sql-wasm.wasm?url';

type SeedExercise = { id: string; name: string; muscle: string; equipment: string; sets: number; reps: string; rest: number };
type SeedWorkout = { id: string; name: string; muscle: string; day: string; order: number; exercises: SeedExercise[] };
let db: Database | undefined;
let dbPromise: Promise<Database> | undefined;
const KEY = 'trainai.sqlite.v1';
const exercise = (id: string, name: string, muscle: string, equipment: string, sets: number, reps: string, rest: number): SeedExercise => ({ id, name, muscle, equipment, sets, reps, rest });

const seed: SeedWorkout[] = [
  { id:'workout-a', name:'Treino A', muscle:'Peito', day:'Segunda-feira', order:0, exercises:[
    exercise('supino-maquina','Supino Máquina','Peito','Máquina',4,'8–12',60),
    exercise('supino-inclinado-maquina','Supino Inclinado na Máquina','Peito','Máquina',4,'8–12',60),
    exercise('chest-press','Chest Press (Supino Articulado)','Peito','Máquina',3,'10–12',60),
    exercise('peck-deck','Peck Deck','Peito','Máquina',3,'10–15',60),
    exercise('crucifixo','Crucifixo','Peito','Polia',3,'12–15',60),
    exercise('supino-reto-barra','Supino Reto com Barra','Peito','Barra',3,'10–12',60),
    exercise('crucifixo-inclinado-maquina','Crucifixo Inclinado na Máquina','Peito','Máquina',3,'12–15',60),
    exercise('supino-inclinado-halteres','Supino Inclinado com Halteres','Peito','Halteres',3,'10–12 por lado',60),
  ]},
  { id:'workout-b', name:'Treino B', muscle:'Costas', day:'Terça-feira', order:1, exercises:[
    exercise('puxada-frontal','Puxada Frontal','Costas','Máquina/Polia',4,'8–12',60),
    exercise('puxada-articulada-neutra','Puxada Articulada com Pegada Neutra','Costas','Máquina',3,'8–12',60),
    exercise('remada-baixa-maquina','Remada Baixa na Máquina','Costas','Máquina/Polia',4,'8–12',60),
    exercise('remada-articulada-unilateral','Remada Articulada Unilateral','Costas','Máquina',3,'10–12 por lado',60),
    exercise('remada-maquina-apoio-peito','Remada Máquina com Apoio no Peito','Costas','Máquina',3,'10–12',60),
    exercise('pulldown-polia','Pulldown na Polia','Costas','Polia',3,'12–15',60),
    exercise('reverse-fly-costas','Crucifixo Inverso / Reverse Fly','Costas','Máquina',3,'12–15',60),
    exercise('extensao-lombar-maquina','Extensão Lombar na Máquina','Costas','Máquina',3,'12–15',60),
  ]},
  { id:'workout-c', name:'Treino C', muscle:'Pernas', day:'Quarta-feira', order:2, exercises:[
    exercise('leg-press-45','Leg Press 45°','Pernas','Máquina',4,'8–12',90),
    exercise('agachamento-smith','Agachamento no Smith','Pernas','Smith Machine',4,'8–12',90),
    exercise('cadeira-extensora','Cadeira Extensora','Pernas','Máquina',3,'10–15',60),
    exercise('mesa-flexora','Mesa Flexora','Pernas','Máquina',3,'10–15',60),
    exercise('cadeira-flexora','Cadeira Flexora','Pernas','Máquina',3,'10–15',60),
    exercise('leg-press-horizontal','Leg Press Horizontal','Pernas','Máquina',3,'10–12',90),
    exercise('cadeira-abdutora','Cadeira Abdutora','Pernas','Máquina',3,'12–20',60),
    exercise('panturrilha-leg-press','Panturrilha no Leg Press','Pernas','Máquina',4,'12–20',60),
  ]},
  { id:'workout-d', name:'Treino D', muscle:'Ombros + Abdômen', day:'Quinta-feira', order:3, exercises:[
    exercise('desenvolvimento-ombros-maquina','Desenvolvimento de Ombros na Máquina','Ombros','Máquina',4,'8–12',60),
    exercise('elevacao-lateral-maquina','Elevação Lateral na Máquina','Ombros','Máquina',4,'10–15',60),
    exercise('elevacao-lateral-unilateral-polia','Elevação Lateral Unilateral na Polia','Ombros','Polia',3,'12–15 por lado',60),
    exercise('reverse-fly-ombros','Reverse Fly / Crucifixo Inverso','Ombros','Máquina',3,'12–15',60),
    exercise('abdominal-maquina','Abdominal na Máquina','Abdômen','Máquina',4,'10–15',60),
    exercise('cable-crunch','Cable Crunch / Abdominal na Polia Alta','Abdômen','Polia',3,'12–15',60),
    exercise('elevacao-pernas','Elevação de Pernas','Abdômen','Máquina/Cadeira Romana',3,'10–15',60),
    exercise('rotacao-tronco','Rotação de Tronco','Abdômen','Máquina',3,'12–15 por lado',60),
  ]},
  { id:'workout-e', name:'Treino E', muscle:'Braços', day:'Sexta-feira', order:4, exercises:[
    exercise('rosca-scott-maquina','Rosca Scott na Máquina','Bíceps','Máquina',4,'8–12',60),
    exercise('rosca-biceps-maquina','Rosca Bíceps na Máquina','Bíceps','Máquina',3,'10–12',60),
    exercise('rosca-martelo-polia-corda','Rosca Martelo na Polia com Corda','Bíceps','Polia',3,'10–15',60),
    exercise('rosca-unilateral-polia','Rosca Unilateral na Polia','Bíceps','Polia',3,'10–12 por lado',60),
    exercise('triceps-pulley-corda','Tríceps Pulley com Corda','Tríceps','Polia',4,'8–12',60),
    exercise('triceps-maquina','Tríceps na Máquina','Tríceps','Máquina',3,'10–12',60),
    exercise('triceps-frances-polia','Tríceps Francês na Polia','Tríceps','Polia',3,'10–15',60),
    exercise('triceps-unilateral-polia','Tríceps Unilateral na Polia','Tríceps','Polia',3,'10–15 por lado',60),
  ]},
];

const gifByExercise: Record<string,string> = {
  'supino-maquina':'/exercises/supino-maquina.gif',
  'supino-inclinado-maquina':'/exercises/supino-inclinado-maquina.gif',
  'chest-press':'/exercises/chest-press.gif',
  'peck-deck':'/exercises/peck-deck.gif',
  'crucifixo':'/exercises/crucifixo.gif',
  'supino-reto-barra':'/exercises/supino-reto-barra.gif',
  'crucifixo-inclinado-maquina':'/exercises/crucifixo-inclinado-maquina.gif',
  'supino-inclinado-halteres':'/exercises/supino-inclinado-halteres.gif',
};

export function database(): Promise<Database> {
  if (db) return Promise.resolve(db);
  if (!dbPromise) dbPromise = initializeDatabase().catch(error => { dbPromise = undefined; throw error; });
  return dbPromise;
}

async function initializeDatabase(): Promise<Database> {
  if (!('indexedDB' in window)) throw new Error('Este navegador não oferece armazenamento IndexedDB. Abra o TreinAI em um navegador atualizado.');
  const SQL = await initSqlJs({ locateFile: () => sqlWasmUrl });
  const stored = await new Promise<ArrayBuffer | undefined>((resolve, reject) => {
    const request = indexedDB.open('trainai-local', 1);
    request.onupgradeneeded = () => { if (!request.result.objectStoreNames.contains('db')) request.result.createObjectStore('db'); };
    request.onsuccess = () => {
      const idb = request.result;
      if (!idb.objectStoreNames.contains('db')) { idb.close(); reject(new Error('O armazenamento local está em uma versão incompatível.')); return; }
      const get = idb.transaction('db').objectStore('db').get(KEY);
      get.onsuccess = () => { resolve(get.result as ArrayBuffer | undefined); idb.close(); };
      get.onerror = () => { idb.close(); reject(get.error ?? new Error('Não foi possível ler os dados locais.')); };
    };
    request.onerror = () => reject(request.error ?? new Error('Não foi possível abrir o armazenamento local.'));
    request.onblocked = () => reject(new Error('O armazenamento local está ocupado por outra aba. Feche outras abas do TreinAI e tente novamente.'));
  });
  db = stored ? new SQL.Database(new Uint8Array(stored)) : new SQL.Database();
  db.run(`PRAGMA foreign_keys=ON;
    CREATE TABLE IF NOT EXISTS workouts(id TEXT PRIMARY KEY,name TEXT,muscle_group TEXT,estimated_duration INTEGER,order_index INTEGER,day_of_week TEXT);
    CREATE TABLE IF NOT EXISTS exercises(id TEXT PRIMARY KEY,workout_id TEXT REFERENCES workouts(id),name TEXT,muscle_group TEXT,equipment TEXT,description TEXT,gif_url TEXT,order_index INTEGER,sets INTEGER,reps TEXT,rest_seconds INTEGER);
    CREATE TABLE IF NOT EXISTS workout_sessions(id TEXT PRIMARY KEY,workout_id TEXT REFERENCES workouts(id),started_at TEXT,finished_at TEXT,duration_seconds INTEGER,completed INTEGER DEFAULT 0,paused_at TEXT,resumed_at TEXT,elapsed_seconds INTEGER DEFAULT 0);
    CREATE TABLE IF NOT EXISTS set_logs(id TEXT PRIMARY KEY,session_id TEXT REFERENCES workout_sessions(id),exercise_id TEXT,set_number INTEGER,weight REAL,repetitions INTEGER,completed_at TEXT);
    CREATE TABLE IF NOT EXISTS app_settings(id INTEGER PRIMARY KEY CHECK(id=1),cycle_goal INTEGER,user_name TEXT);`);
  const columns = db.exec('PRAGMA table_info(workouts)')[0].values.map(row => String(row[1]));
  if (!columns.includes('day_of_week')) db.run('ALTER TABLE workouts ADD COLUMN day_of_week TEXT');
  const sessionColumns = db.exec('PRAGMA table_info(workout_sessions)')[0].values.map(row => String(row[1]));
  if (!sessionColumns.includes('paused_at')) db.run('ALTER TABLE workout_sessions ADD COLUMN paused_at TEXT');
  if (!sessionColumns.includes('resumed_at')) db.run('ALTER TABLE workout_sessions ADD COLUMN resumed_at TEXT');
  if (!sessionColumns.includes('elapsed_seconds')) db.run('ALTER TABLE workout_sessions ADD COLUMN elapsed_seconds INTEGER DEFAULT 0');
  db.run("INSERT OR IGNORE INTO app_settings(id,cycle_goal,user_name) VALUES(1,45,'Emanuel')");
  await migrateWorkoutIds(db);
  seedWorkouts(db);
  await saveDatabase(db);
  return db;
}

async function migrateWorkoutIds(database: Database) {
  const existing = database.exec('SELECT id,name FROM workouts')[0];
  if (!existing) return;
  for (const workout of seed) {
    const legacyIds = new Set(existing.values.filter(row => String(row[1]) === workout.name && String(row[0]) !== workout.id).map(row => String(row[0])));
    const conventionalId = `workout-${workout.name.slice(-1).toUpperCase()}`;
    if (existing.values.some(row => String(row[0]) === conventionalId)) legacyIds.add(conventionalId);
    if (legacyIds.size === 0) continue;
    database.run('INSERT OR IGNORE INTO workouts(id,name,muscle_group,estimated_duration,order_index,day_of_week) VALUES(?,?,?,55,?,?)', [workout.id, workout.name, workout.muscle, workout.order, workout.day]);
    for (const oldId of legacyIds) {
      database.run('UPDATE workout_sessions SET workout_id=? WHERE workout_id=?', [workout.id, oldId]);
      database.run('UPDATE exercises SET workout_id=? WHERE workout_id=?', [workout.id, oldId]);
      database.run('DELETE FROM workouts WHERE id=?', [oldId]);
    }
  }
}

function seedWorkouts(database: Database) {
  for (const workout of seed) {
    database.run(`INSERT INTO workouts(id,name,muscle_group,estimated_duration,order_index,day_of_week) VALUES(?,?,?,55,?,?)
      ON CONFLICT(id) DO UPDATE SET name=excluded.name,muscle_group=excluded.muscle_group,order_index=excluded.order_index,day_of_week=excluded.day_of_week`,
    [workout.id, workout.name, workout.muscle, workout.order, workout.day]);
    const keepIds = workout.exercises.map(item => item.id);
    const placeholders = keepIds.map(() => '?').join(',');
    database.run(`UPDATE exercises SET workout_id=NULL WHERE workout_id=? AND id NOT IN (${placeholders})`, [workout.id, ...keepIds]);
    workout.exercises.forEach((item, index) => database.run(`INSERT INTO exercises(id,workout_id,name,muscle_group,equipment,description,gif_url,order_index,sets,reps,rest_seconds)
      VALUES(?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET workout_id=excluded.workout_id,name=excluded.name,muscle_group=excluded.muscle_group,equipment=excluded.equipment,description=excluded.description,gif_url=excluded.gif_url,order_index=excluded.order_index,sets=excluded.sets,reps=excluded.reps,rest_seconds=excluded.rest_seconds`,
    [item.id, workout.id, item.name, item.muscle, item.equipment, '', gifByExercise[item.id] ?? '/exercises/placeholder.svg', index, item.sets, item.reps, item.rest]));
  }
}

async function saveDatabase(database: Database) {
  const bytes = database.export();
  await new Promise<void>((resolve, reject) => {
    const request = indexedDB.open('trainai-local', 1);
    request.onupgradeneeded = () => { if (!request.result.objectStoreNames.contains('db')) request.result.createObjectStore('db'); };
    request.onsuccess = () => {
      const idb = request.result;
      const transaction = idb.transaction('db', 'readwrite');
      transaction.objectStore('db').put(bytes.buffer, KEY);
      transaction.oncomplete = () => { idb.close(); resolve(); };
      transaction.onerror = () => { idb.close(); reject(transaction.error ?? new Error('Não foi possível salvar os dados locais.')); };
    };
    request.onerror = () => reject(request.error ?? new Error('Não foi possível acessar o armazenamento local.'));
  });
}

export async function persist() { await saveDatabase(await database()); }
export async function rows<T>(sql: string, params: unknown[] = []): Promise<T[]> {
  const result = (await database()).exec(sql, params as (string | number | null)[])[0];
  if (!result) return [];
  return result.values.map(value => Object.fromEntries(result.columns.map((column, index) => [column, value[index]])) as T);
}
export async function run(sql: string, params: unknown[] = []) { (await database()).run(sql, params as (string | number | null)[]); await persist(); }
export async function setting(name: 'cycle_goal' | 'user_name'): Promise<string | number> {
  const result = await rows<{ value: string | number }>(`SELECT ${name} AS value FROM app_settings WHERE id=1`);
  return result[0]?.value ?? (name === 'cycle_goal' ? 45 : 'Emanuel');
}
