const required = [
  'NODE_ENV',
  'DATABASE_URL',
  'REDIS_URL',
  'JWT_ACCESS_TTL',
];

const missing = required.filter(function (k) {
  const v = process.env[k];
  return !v || v.trim() === '';
});
if (missing.length > 0) {
  console.error('Faltan variables de entorno obligatorias:', missing.join(', '));
  process.exit(1);
}
console.log('Entorno OK: todas las variables obligatorias presentes.');
