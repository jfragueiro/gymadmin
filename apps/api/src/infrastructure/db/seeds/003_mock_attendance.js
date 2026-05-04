exports.seed = async function (knex) {
  if (process.env.ENVIRONMENT === 'production') return;

  const [{ count }] = await knex('attendance').count('id as count');
  if (parseInt(count) > 0) return;

  const admin = await knex('users').where({ role: 'admin' }).first();
  if (!admin) return;

  const clients = await knex('clients').select('id');
  if (clients.length === 0) return;

  const start = new Date('2026-01-01');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // All available days from Jan 1 to yesterday
  const allDays = [];
  for (let d = new Date(start); d < today; d.setDate(d.getDate() + 1)) {
    allDays.push(new Date(d));
  }

  const totalDays = allDays.length;
  const rows = [];

  for (const client of clients) {
    // Random visit count: between 20% and 85% of available days
    const minVisits = Math.max(5, Math.floor(totalDays * 0.2));
    const maxVisits = Math.floor(totalDays * 0.85);
    const visitCount = minVisits + Math.floor(Math.random() * (maxVisits - minVisits + 1));

    // Pick random unique days
    const shuffled = [...allDays].sort(() => Math.random() - 0.5);
    const visitDays = shuffled.slice(0, visitCount);

    for (const day of visitDays) {
      // Random check-in hour between 7:00 and 21:00
      const hour = 7 + Math.floor(Math.random() * 15);
      const minute = Math.floor(Math.random() * 60);
      const checkedInAt = new Date(day);
      checkedInAt.setHours(hour, minute, 0, 0);

      rows.push({
        client_id: client.id,
        checked_in_by: admin.id,
        checked_in_at: checkedInAt.toISOString(),
        method: Math.random() < 0.3 ? 'qr' : 'manual',
      });
    }
  }

  // Insert in batches of 200 to avoid query size limits
  for (let i = 0; i < rows.length; i += 200) {
    await knex('attendance').insert(rows.slice(i, i + 200));
  }
};
