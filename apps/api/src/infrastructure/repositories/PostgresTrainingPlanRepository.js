const knex = require('../db/knex');
const TrainingPlan = require('../../domain/trainingPlan/TrainingPlan');

function toEntity(row, exercises = []) {
  return new TrainingPlan({
    id: row.id,
    clientId: row.client_id,
    name: row.name,
    goal: row.goal,
    notes: row.notes,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    exercises,
  });
}

function toExercise(row) {
  return {
    id: row.id,
    trainingPlanId: row.training_plan_id,
    name: row.name,
    dayLabel: row.day_label,
    sets: row.sets,
    reps: row.reps,
    weightKg: row.weight_kg ? parseFloat(row.weight_kg) : null,
    restSeconds: row.rest_seconds,
    orderIndex: row.order_index,
    createdAt: row.created_at,
  };
}

class PostgresTrainingPlanRepository {
  async findByClientId(clientId) {
    const plans = await knex('training_plans')
      .where({ client_id: clientId, is_active: true })
      .orderBy('created_at', 'desc');

    if (plans.length === 0) return [];

    const planIds = plans.map((p) => p.id);
    const exercises = await knex('training_exercises')
      .whereIn('training_plan_id', planIds)
      .orderBy([{ column: 'day_label' }, { column: 'order_index' }]);

    const exercisesByPlan = exercises.reduce((acc, ex) => {
      if (!acc[ex.training_plan_id]) acc[ex.training_plan_id] = [];
      acc[ex.training_plan_id].push(toExercise(ex));
      return acc;
    }, {});

    return plans.map((p) => toEntity(p, exercisesByPlan[p.id] || []));
  }

  async findById(id) {
    const row = await knex('training_plans').where({ id }).first();
    if (!row) return null;
    const exercises = await knex('training_exercises')
      .where({ training_plan_id: id })
      .orderBy([{ column: 'day_label' }, { column: 'order_index' }]);
    return toEntity(row, exercises.map(toExercise));
  }

  async save(plan) {
    const [row] = await knex('training_plans')
      .insert({
        client_id: plan.clientId,
        name: plan.name,
        goal: plan.goal,
        notes: plan.notes,
        is_active: plan.isActive,
      })
      .returning('*');
    return toEntity(row, []);
  }

  async update(plan) {
    const [row] = await knex('training_plans')
      .where({ id: plan.id })
      .update({
        name: plan.name,
        goal: plan.goal,
        notes: plan.notes,
        updated_at: knex.fn.now(),
      })
      .returning('*');
    const exercises = await knex('training_exercises')
      .where({ training_plan_id: plan.id })
      .orderBy([{ column: 'day_label' }, { column: 'order_index' }]);
    return toEntity(row, exercises.map(toExercise));
  }

  async softDelete(id) {
    await knex('training_plans').where({ id }).update({ is_active: false, updated_at: knex.fn.now() });
  }

  async addExercise(planId, exercise) {
    const [row] = await knex('training_exercises')
      .insert({
        training_plan_id: planId,
        name: exercise.name,
        day_label: exercise.dayLabel || null,
        sets: exercise.sets || null,
        reps: exercise.reps || null,
        weight_kg: exercise.weightKg || null,
        rest_seconds: exercise.restSeconds || null,
        order_index: exercise.orderIndex || 0,
      })
      .returning('*');
    return toExercise(row);
  }

  async removeExercise(exerciseId) {
    await knex('training_exercises').where({ id: exerciseId }).delete();
  }

  async findActiveByClientId(clientId) {
    const plan = await knex('training_plans')
      .where({ client_id: clientId, is_active: true })
      .orderBy('created_at', 'desc')
      .first();

    if (!plan) return null;

    const exercises = await knex('training_exercises')
      .where({ training_plan_id: plan.id })
      .orderBy([{ column: 'day_label' }, { column: 'order_index' }]);

    const dayMap = {};
    exercises.forEach((ex) => {
      const dayName = ex.day_label || '';
      if (!dayMap[dayName]) dayMap[dayName] = [];
      dayMap[dayName].push(toExercise(ex));
    });

    const days = Object.entries(dayMap).map(([dayName, exs]) => ({ dayName, exercises: exs }));
    const entity = toEntity(plan, exercises.map(toExercise));
    entity.days = days;
    return entity;
  }
}

module.exports = PostgresTrainingPlanRepository;
